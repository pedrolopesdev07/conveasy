"""
Endpoints de Convênio
CRUD de convênios
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import logging

from app.schemas.convenio import ConvenioCreate, ConvenioUpdate, ConvenioResponse
from app.database.supabase_client import get_supabase
from app.api.v1.dependencies import get_current_gestor_or_admin, get_current_user
from app.core.security import TokenData

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
