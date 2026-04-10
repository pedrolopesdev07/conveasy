"""
Endpoints de Documentos
Gerenciamento de documentos de convênios
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from typing import List
import logging
import io

from app.schemas.documento import DocumentoResponse
from app.database.supabase_client import get_supabase
from app.api.v1.dependencies import get_current_user
from app.core.security import TokenData

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/documentos",
    tags=["documentos"]
)


@router.get("/", response_model=List[DocumentoResponse])
async def list_documentos(
    convenio_id: str = None,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Lista todos os documentos (opcionalmente filtrados por convênio)

    Args:
        convenio_id: ID do convênio para filtrar (opcional)
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        List[DocumentoResponse]: Lista de documentos
    """
    try:
        query = supabase.table("documentos").select("*")

        if convenio_id:
            query = query.eq("convenio_id", convenio_id)

        response = query.order("uploaded_at", desc=True).execute()
        return response.data
    except Exception as e:
        logger.error(f"Erro ao listar documentos: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao listar documentos"
        )


@router.get("/{documento_id}", response_model=DocumentoResponse)
async def get_documento(
    documento_id: str,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Obtém detalhes de um documento específico

    Args:
        documento_id: ID do documento
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        DocumentoResponse: Dados do documento
    """
    try:
        response = supabase.table("documentos") \
            .select("*") \
            .eq("id", documento_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Documento não encontrado"
            )

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter documento: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao obter documento"
        )


@router.get("/{documento_id}/download")
async def download_documento(
    documento_id: str,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Faz download de um documento do Supabase Storage

    Args:
        documento_id: ID do documento
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        StreamingResponse: Arquivo para download
    """
    try:
        # Busca metadados do documento
        doc_response = supabase.table("documentos") \
            .select("*") \
            .eq("id", documento_id) \
            .execute()

        if not doc_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Documento não encontrado"
            )

        documento = doc_response.data[0]

        # Faz download do arquivo do storage
        storage_response = supabase.storage.from_("documentos").download(documento["storage_path"])

        if storage_response.error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao fazer download do documento"
            )

        # Retorna o arquivo como streaming response
        file_data = io.BytesIO(storage_response.data)
        filename = documento["nome"]

        return StreamingResponse(
            file_data,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao fazer download do documento: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao fazer download do documento"
        )


@router.delete("/{documento_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_documento(
    documento_id: str,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Deleta um documento do banco e do storage

    Args:
        documento_id: ID do documento
        current_user: Usuário autenticado
        supabase: Cliente Supabase
    """
    try:
        # Busca metadados do documento
        doc_response = supabase.table("documentos") \
            .select("*") \
            .eq("id", documento_id) \
            .execute()

        if not doc_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Documento não encontrado"
            )

        documento = doc_response.data[0]

        # Remove do storage
        storage_response = supabase.storage.from_("documentos").remove([documento["storage_path"]])

        if storage_response.error:
            logger.warning(f"Erro ao remover arquivo do storage: {storage_response.error}")

        # Remove do banco de dados
        supabase.table("documentos") \
            .delete() \
            .eq("id", documento_id) \
            .execute()

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao deletar documento: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao deletar documento"
        )