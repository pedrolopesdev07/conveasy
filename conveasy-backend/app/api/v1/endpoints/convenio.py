"""
Endpoints de Convênio
CRUD de convênios
"""

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from typing import List
from uuid import uuid4
import logging

from app.schemas.convenio import ConvenioCreate, ConvenioUpdate, ConvenioResponse
from app.database.supabase_client import get_supabase
from app.api.v1.dependencies import get_current_gestor_or_admin, get_current_user
from app.core.security import TokenData
from app.utils.validators import validate_file_size, validate_file_type, sanitize_filename

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/convenios",
    tags=["convenios"]
)


@router.get("/", response_model=List[ConvenioResponse])
async def list_convenios(
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Lista todos os convênios cadastrados

    Args:
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        List[ConvenioResponse]: Lista de convênios
    """
    try:
        response = supabase.table("convenios").select("*").execute()
        return response.data
    except Exception as e:
        logger.error(f"Erro ao listar convênios: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao listar convênios"
        )


@router.post("/", response_model=ConvenioResponse, status_code=status.HTTP_201_CREATED)
async def create_convenio(
    convenio: ConvenioCreate,
    current_user: TokenData = Depends(get_current_gestor_or_admin),
    supabase=Depends(get_supabase)
):
    """
    Cria um novo convênio

    Args:
        convenio: Dados do convênio a criar
        current_user: Usuário autenticado (deve ser gestor ou admin)
        supabase: Cliente Supabase

    Returns:
        ConvenioResponse: Convênio criado
    """
    try:
        response = supabase.table("convenios").insert(
            convenio.dict()
        ).execute()

        return response.data[0]

    except Exception as e:
        logger.error(f"Erro ao criar convênio: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar convênio"
        )


@router.get("/{convenio_id}", response_model=ConvenioResponse)
async def get_convenio(
    convenio_id: str,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Obtém detalhes de um convênio específico

    Args:
        convenio_id: ID do convênio
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        ConvenioResponse: Dados do convênio
    """
    try:
        response = supabase.table("convenios") \
            .select("*") \
            .eq("id", convenio_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Convênio não encontrado"
            )

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter convênio: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao obter convênio"
        )


@router.post("/{convenio_id}/documentos", status_code=status.HTTP_201_CREATED)
async def upload_documento(
    convenio_id: str,
    file: UploadFile = File(...),
    current_user: TokenData = Depends(get_current_gestor_or_admin),
    supabase=Depends(get_supabase)
):
    """
    Faz upload de um documento para um convênio no Supabase Storage.
    Valida tamanho (máx 10MB) e tipo de arquivo permitido.
    """
    try:
        # Validar tamanho do arquivo (máx 10MB)
        content = await file.read()
        if not validate_file_size(len(content), 10):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Arquivo muito grande. Tamanho máximo: 10MB"
            )

        # Validar tipo de arquivo
        allowed_types = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png']
        if not validate_file_type(file.filename, allowed_types):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tipo de arquivo não permitido. Tipos aceitos: {', '.join(allowed_types)}"
            )

        # Sanitizar nome do arquivo
        sanitized_filename = sanitize_filename(file.filename)

        storage_path = f"{convenio_id}/{uuid4().hex}_{sanitized_filename}"
        upload_response = supabase.storage.from_("documentos").upload(
            storage_path,
            content,
            content_type=file.content_type,
        )

        if upload_response.error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao enviar documento"
            )

        metadata = {
            "convenio_id": convenio_id,
            "nome": sanitized_filename,
            "tipo": (sanitized_filename.split(".")[-1] or "FILE").upper(),
            "tamanho": str(len(content)),
            "storage_path": storage_path,
            "uploaded_at": datetime.utcnow().isoformat(),
            "uploaded_by": current_user.user_id,
        }

        insert_response = supabase.table("documentos").insert(metadata).execute()
        if insert_response.error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao salvar metadados do documento"
            )

        return {"message": "Documento enviado com sucesso", "storage_path": storage_path}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro no upload de documento: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao fazer upload de documento"
        )


@router.put("/{convenio_id}", response_model=ConvenioResponse)
async def update_convenio(
    convenio_id: str,
    convenio_update: ConvenioUpdate,
    current_user: TokenData = Depends(get_current_gestor_or_admin),
    supabase=Depends(get_supabase)
):
    """
    Atualiza dados de um convênio

    Args:
        convenio_id: ID do convênio
        convenio_update: Dados a atualizar
        current_user: Usuário autenticado (deve ser gestor ou admin)
        supabase: Cliente Supabase

    Returns:
        ConvenioResponse: Convênio atualizado
    """
    try:
        update_data = convenio_update.dict(exclude_unset=True)

        response = supabase.table("convenios") \
            .update(update_data) \
            .eq("id", convenio_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Convênio não encontrado"
            )

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar convênio: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar convênio"
        )


@router.delete("/{convenio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_convenio(
    convenio_id: str,
    current_user: TokenData = Depends(get_current_gestor_or_admin),
    supabase=Depends(get_supabase)
):
    """
    Deleta um convênio (soft delete)

    Args:
        convenio_id: ID do convênio
        current_user: Usuário autenticado (deve ser gestor ou admin)
        supabase: Cliente Supabase
    """
    try:
        supabase.table("convenios") \
            .update({"status": "cancelado"}) \
            .eq("id", convenio_id) \
            .execute()

    except Exception as e:
        logger.error(f"Erro ao deletar convênio: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao deletar convênio"
        )
