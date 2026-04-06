"""
Endpoints de Usuário
Autenticação, CRUD e gerenciamento de usuários
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import logging
from datetime import timedelta

from app.schemas.usuario import (
    UsuarioCreate, UsuarioUpdate, UsuarioUpdateRole,
    UsuarioResponse, UsuarioLoginRequest, UsuarioLoginResponse
)
from app.database.supabase_client import get_supabase
from app.api.v1.dependencies import (
    get_current_user, get_current_admin, get_current_gestor_or_admin
)
from app.core.security import (
    TokenData, create_access_token, get_password_hash,
    verify_password
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/usuarios",
    tags=["usuarios"]
)


@router.post("/login", response_model=UsuarioLoginResponse)
async def login(
    login_data: UsuarioLoginRequest,
    supabase=Depends(get_supabase)
):
    """
    Autentica um usuário e retorna um token JWT

    Args:
        login_data: Email e senha do usuário
        supabase: Cliente Supabase

    Returns:
        UsuarioLoginResponse: Token de acesso e dados do usuário

    Raises:
        HTTPException: Se email ou senha forem inválidos
    """
    try:
        # Busca usuário pelo email
        response = supabase.table("usuarios") \
            .select("*") \
            .eq("email", login_data.email) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )

        usuario = response.data[0]

        # Valida senha
        if not verify_password(login_data.senha, usuario.get("senha_hash", "")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )

        # Cria token JWT
        access_token = create_access_token(
            data={
                "sub": usuario["email"],
                "user_id": usuario["id"],
                "role": usuario["role"]
            }
        )

        return UsuarioLoginResponse(
            access_token=access_token,
            token_type="bearer",
            usuario=UsuarioResponse(**usuario)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro no login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao fazer login"
        )


@router.post("/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def create_usuario(
    usuario: UsuarioCreate,
    current_user: TokenData = Depends(get_current_admin),
    supabase=Depends(get_supabase)
):
    """
    Cria um novo usuário (apenas admin)

    Args:
        usuario: Dados do usuário a criar
        current_user: Usuário autenticado (deve ser admin)
        supabase: Cliente Supabase

    Returns:
        UsuarioResponse: Usuário criado
    """
    try:
        # Verifica email único
        existing = supabase.table("usuarios") \
            .select("*") \
            .eq("email", usuario.email) \
            .execute()

        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )

        # Hash da senha
        senha_hash = get_password_hash(usuario.senha)

        # Insere usuário
        response = supabase.table("usuarios").insert({
            **usuario.dict(exclude={"senha"}),
            "senha_hash": senha_hash
        }).execute()

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao criar usuário: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar usuário"
        )


@router.get("/me", response_model=UsuarioResponse)
async def get_me(
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Retorna os dados do usuário autenticado

    Args:
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        UsuarioResponse: Dados do usuário
    """
    try:
        response = supabase.table("usuarios") \
            .select("*") \
            .eq("id", current_user.user_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )

        return UsuarioResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter usuário: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao obter usuário"
        )


@router.get("/", response_model=List[UsuarioResponse])
async def list_usuarios(
    current_user: TokenData = Depends(get_current_admin),
    supabase=Depends(get_supabase)
):
    """
    Lista todos os usuários (apenas admin)

    Args:
        current_user: Usuário autenticado (deve ser admin)
        supabase: Cliente Supabase

    Returns:
        List[UsuarioResponse]: Lista de usuários
    """
    try:
        response = supabase.table("usuarios").select("*").execute()
        return [UsuarioResponse(**u) for u in response.data]
    except Exception as e:
        logger.error(f"Erro ao listar usuários: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao listar usuários"
        )


@router.put("/{usuario_id}", response_model=UsuarioResponse)
async def update_usuario(
    usuario_id: str,
    usuario_update: UsuarioUpdate,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Atualiza dados de um usuário

    Args:
        usuario_id: ID do usuário
        usuario_update: Dados a atualizar
        current_user: Usuário autenticado
        supabase: Cliente Supabase

    Returns:
        UsuarioResponse: Usuário atualizado

    Note:
        Um usuário comum só pode atualizar seus próprios dados
    """
    try:
        # Valida permissão
        if current_user.user_id != usuario_id and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Sem permissão para editar este usuário"
            )

        update_data = usuario_update.dict(exclude_unset=True)

        response = supabase.table("usuarios") \
            .update(update_data) \
            .eq("id", usuario_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )

        return UsuarioResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar usuário: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar usuário"
        )


@router.patch("/{usuario_id}/role", response_model=UsuarioResponse)
async def update_usuario_role(
    usuario_id: str,
    role_update: UsuarioUpdateRole,
    current_user: TokenData = Depends(get_current_admin),
    supabase=Depends(get_supabase)
):
    """
    Atualiza o role de um usuário (apenas admin)

    Args:
        usuario_id: ID do usuário
        role_update: Novo role
        current_user: Usuário autenticado (deve ser admin)
        supabase: Cliente Supabase

    Returns:
        UsuarioResponse: Usuário com role atualizado
    """
    try:
        response = supabase.table("usuarios") \
            .update({"role": role_update.role}) \
            .eq("id", usuario_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )

        return UsuarioResponse(**response.data[0])

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar role: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar role"
        )


@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_usuario(
    usuario_id: str,
    current_user: TokenData = Depends(get_current_admin),
    supabase=Depends(get_supabase)
):
    """
    Deleta um usuário (apenas admin)

    Args:
        usuario_id: ID do usuário
        current_user: Usuário autenticado (deve ser admin)
        supabase: Cliente Supabase
    """
    try:
        supabase.table("usuarios") \
            .update({"ativo": False}) \
            .eq("id", usuario_id) \
            .execute()

    except Exception as e:
        logger.error(f"Erro ao deletar usuário: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao deletar usuário"
        )
