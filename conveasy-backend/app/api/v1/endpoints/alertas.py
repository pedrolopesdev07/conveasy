"""
Endpoints de Alertas
Sistema de notificações e alertas
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import logging

from app.schemas.alerta import AlertaCreate, AlertaUpdate, AlertaResponse
from app.database.supabase_client import get_supabase
from app.api.v1.dependencies import get_current_user
from app.core.security import TokenData

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/alertas",
    tags=["alertas"]
)


@router.get("/", response_model=List[AlertaResponse])
async def list_alertas(
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Lista todos os alertas do usuário atual

    Args:
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        List[AlertaResponse]: Lista de alertas
    """
    try:
        response = supabase.table("alertas") \
            .select("*") \
            .eq("usuario_id", current_user.user_id) \
            .order("created_at", desc=True) \
            .execute()
        return response.data
    except Exception as e:
        logger.error(f"Erro ao listar alertas: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao listar alertas"
        )


@router.post("/", response_model=AlertaResponse, status_code=status.HTTP_201_CREATED)
async def create_alerta(
    alerta: AlertaCreate,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Cria um novo alerta

    Args:
        alerta: Dados do alerta a criar
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        AlertaResponse: Alerta criado
    """
    try:
        alerta_data = alerta.dict()
        alerta_data["usuario_id"] = current_user.user_id

        response = supabase.table("alertas").insert(alerta_data).execute()

        return response.data[0]

    except Exception as e:
        logger.error(f"Erro ao criar alerta: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar alerta"
        )


@router.get("/{alerta_id}", response_model=AlertaResponse)
async def get_alerta(
    alerta_id: str,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Obtém detalhes de um alerta específico

    Args:
        alerta_id: ID do alerta
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        AlertaResponse: Dados do alerta
    """
    try:
        response = supabase.table("alertas") \
            .select("*") \
            .eq("id", alerta_id) \
            .eq("usuario_id", current_user.user_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Alerta não encontrado"
            )

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter alerta: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao obter alerta"
        )


@router.put("/{alerta_id}", response_model=AlertaResponse)
async def update_alerta(
    alerta_id: str,
    alerta_update: AlertaUpdate,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Atualiza dados de um alerta

    Args:
        alerta_id: ID do alerta
        alerta_update: Dados a atualizar
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        AlertaResponse: Alerta atualizado
    """
    try:
        update_data = alerta_update.dict(exclude_unset=True)

        response = supabase.table("alertas") \
            .update(update_data) \
            .eq("id", alerta_id) \
            .eq("usuario_id", current_user.user_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Alerta não encontrado"
            )

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar alerta: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar alerta"
        )


@router.delete("/{alerta_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_alerta(
    alerta_id: str,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Deleta um alerta

    Args:
        alerta_id: ID do alerta
        current_user: Usuário autenticado
        supabase: Cliente Supabase
    """
    try:
        response = supabase.table("alertas") \
            .delete() \
            .eq("id", alerta_id) \
            .eq("usuario_id", current_user.user_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Alerta não encontrado"
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao deletar alerta: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao deletar alerta"
        )


@router.post("/{alerta_id}/marcar-lida", response_model=AlertaResponse)
async def marcar_alerta_lida(
    alerta_id: str,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Marca um alerta como lido

    Args:
        alerta_id: ID do alerta
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        AlertaResponse: Alerta atualizado
    """
    try:
        response = supabase.table("alertas") \
            .update({"lido": True}) \
            .eq("id", alerta_id) \
            .eq("usuario_id", current_user.user_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Alerta não encontrado"
            )

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao marcar alerta como lido: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao marcar alerta como lido"
        )