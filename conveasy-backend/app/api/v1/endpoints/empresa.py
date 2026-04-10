"""
Endpoints de Empresa
CRUD de empresas parceiras
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import logging

from app.schemas.empresa import EmpresaCreate, EmpresaUpdate, EmpresaResponse
from app.database.supabase_client import get_supabase
from app.api.v1.dependencies import get_current_gestor_or_admin, get_current_user
from app.core.security import TokenData
from app.utils.validators import validate_cnpj, format_cnpj

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/empresas",
    tags=["empresas"]
)


@router.get("/", response_model=List[EmpresaResponse])
async def list_empresas(
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Lista todas as empresas cadastradas

    Args:
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        List[EmpresaResponse]: Lista de empresas
    """
    try:
        response = supabase.table("empresas").select("*").execute()
        return response.data
    except Exception as e:
        logger.error(f"Erro ao listar empresas: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao listar empresas"
        )


@router.post("/", response_model=EmpresaResponse, status_code=status.HTTP_201_CREATED)
async def create_empresa(
    empresa: EmpresaCreate,
    current_user: TokenData = Depends(get_current_gestor_or_admin),
    supabase=Depends(get_supabase)
):
    """
    Cria uma nova empresa (RN06 - CNPJ deve ser único)

    Args:
        empresa: Dados da empresa a criar
        current_user: Usuário autenticado (deve ser gestor ou admin)
        supabase: Cliente Supabase

    Returns:
        EmpresaResponse: Empresa criada

    Raises:
        HTTPException: Se CNPJ for inválido ou duplicado
    """
    try:
        # Valida CNPJ
        if not validate_cnpj(empresa.cnpj):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CNPJ inválido"
            )

        # Verifica unicidade de CNPJ (RN06)
        existing = supabase.table("empresas") \
            .select("*") \
            .eq("cnpj", empresa.cnpj) \
            .execute()

        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CNPJ já cadastrado (RN06)"
            )

        # Formata CNPJ
        cnpj_formatado = format_cnpj(empresa.cnpj)

        # Insere empresa
        response = supabase.table("empresas").insert({
            **empresa.dict(),
            "cnpj": cnpj_formatado
        }).execute()

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao criar empresa: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar empresa"
        )


@router.get("/{empresa_id}", response_model=EmpresaResponse)
async def get_empresa(
    empresa_id: str,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Obtém detalhes de uma empresa específica

    Args:
        empresa_id: ID da empresa
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        EmpresaResponse: Dados da empresa
    """
    try:
        response = supabase.table("empresas") \
            .select("*") \
            .eq("id", empresa_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empresa não encontrada"
            )

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter empresa: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao obter empresa"
        )


@router.put("/{empresa_id}", response_model=EmpresaResponse)
async def update_empresa(
    empresa_id: str,
    empresa_update: EmpresaUpdate,
    current_user: TokenData = Depends(get_current_gestor_or_admin),
    supabase=Depends(get_supabase)
):
    """
    Atualiza dados de uma empresa

    Args:
        empresa_id: ID da empresa
        empresa_update: Dados a atualizar
        current_user: Usuário autenticado (deve ser gestor ou admin)
        supabase: Cliente Supabase

    Returns:
        EmpresaResponse: Empresa atualizada
    """
    try:
        update_data = empresa_update.dict(exclude_unset=True)

        response = supabase.table("empresas") \
            .update(update_data) \
            .eq("id", empresa_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Empresa não encontrada"
            )

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar empresa: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar empresa"
        )


@router.delete("/{empresa_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_empresa(
    empresa_id: str,
    current_user: TokenData = Depends(get_current_gestor_or_admin),
    supabase=Depends(get_supabase)
):
    """
    Deleta uma empresa (soft delete)

    Args:
        empresa_id: ID da empresa
        current_user: Usuário autenticado (deve ser gestor ou admin)
        supabase: Cliente Supabase
    """
    try:
        supabase.table("empresas") \
            .update({"ativo": False}) \
            .eq("id", empresa_id) \
            .execute()

    except Exception as e:
        logger.error(f"Erro ao deletar empresa: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao deletar empresa"
        )
