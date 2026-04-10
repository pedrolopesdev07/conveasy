"""
Endpoints de Usuário
Autenticação, CRUD e gerenciamento de usuários
"""

from collections import defaultdict
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import List, Dict, Any
import logging

from app.schemas.usuario import (
    UsuarioCreate, UsuarioUpdate, UsuarioUpdateRole,
    UsuarioResponse, UsuarioLoginRequest, UsuarioLoginResponse,
    UsuarioRefreshRequest, UsuarioChangePassword
)
from app.database.supabase_client import get_supabase
from app.api.v1.dependencies import (
    get_current_user, get_current_admin, get_current_gestor_or_admin
)
from app.core.security import (
    TokenData, create_access_token, create_refresh_token,
    get_password_hash, verify_password, verify_refresh_token
)

logger = logging.getLogger(__name__)

login_attempts: Dict[str, Dict[str, Any]] = defaultdict(lambda: {"count": 0, "last_attempt": datetime.utcnow()})
MAX_LOGIN_ATTEMPTS = 5
LOGIN_BLOCK_MINUTES = 15


def get_client_ip(request: Request) -> str:
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    client = request.client
    return client.host if client else "unknown"


def is_ip_blocked(client_ip: str) -> bool:
    entry = login_attempts.get(client_ip)
    if not entry:
        return False
    if entry["count"] < MAX_LOGIN_ATTEMPTS:
        return False
    return datetime.utcnow() - entry["last_attempt"] < timedelta(minutes=LOGIN_BLOCK_MINUTES)


def record_failed_attempt(client_ip: str) -> None:
    entry = login_attempts[client_ip]
    entry["count"] += 1
    entry["last_attempt"] = datetime.utcnow()


def reset_login_attempts(client_ip: str) -> None:
    if client_ip in login_attempts:
        del login_attempts[client_ip]


router = APIRouter(
    prefix="/usuarios",
    tags=["usuarios"]
)


@router.post("/login", response_model=UsuarioLoginResponse)
async def login(
    request: Request,
    login_data: UsuarioLoginRequest,
    supabase=Depends(get_supabase)
):
    """
    Autentica um usuário e retorna um token JWT

    Args:
        request: Requisição HTTP para capturar IP
        login_data: Email e senha do usuário
        supabase: Cliente Supabase

    Returns:
        UsuarioLoginResponse: Token de acesso e dados do usuário

    Raises:
        HTTPException: Se email ou senha forem inválidos
    """
    client_ip = get_client_ip(request)

    if is_ip_blocked(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Muitas tentativas de login. Tente novamente mais tarde."
        )

    try:
        # Busca usuário pelo email
        response = supabase.table("usuarios") \
            .select("*") \
            .eq("email", login_data.email) \
            .execute()

        if not response.data:
            record_failed_attempt(client_ip)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )

        usuario = response.data[0]

        # Valida senha
        if not verify_password(login_data.senha, usuario.get("senha_hash", "")):
            record_failed_attempt(client_ip)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )

        reset_login_attempts(client_ip)

        access_token = create_access_token(
            data={
                "sub": usuario["email"],
                "user_id": usuario["id"],
                "role": usuario["role"]
            }
        )
        refresh_token = create_refresh_token(
            data={
                "sub": usuario["email"],
                "user_id": usuario["id"],
                "role": usuario["role"]
            }
        )

        return UsuarioLoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
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


@router.post("/signup", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    usuario: UsuarioCreate,
    supabase=Depends(get_supabase)
):
    """
    Cadastra um novo usuário sem exigir autenticação de admin.

    Args:
        usuario: Dados do usuário a criar
        supabase: Cliente Supabase

    Returns:
        UsuarioResponse: Usuário criado
    """
    try:
        existing = supabase.table("usuarios") \
            .select("*") \
            .eq("email", usuario.email) \
            .execute()

        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )

        senha_hash = get_password_hash(usuario.senha)

        response = supabase.table("usuarios").insert({
            **usuario.dict(exclude={"senha"}),
            "senha_hash": senha_hash
        }).execute()

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro no cadastro: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao cadastrar usuário"
        )


@router.post("/refresh-token", response_model=UsuarioLoginResponse)
async def refresh_token(
    refresh_data: UsuarioRefreshRequest,
    supabase=Depends(get_supabase)
):
    """
    Emite um novo access token usando o refresh token.

    Args:
        refresh_data: Token de refresh
        supabase: Cliente Supabase

    Returns:
        UsuarioLoginResponse: Novo access token e dados do usuário
    """
    try:
        token_data = verify_refresh_token(refresh_data.refresh_token)
        response = supabase.table("usuarios") \
            .select("*") \
            .eq("id", token_data.user_id) \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )

        usuario = response.data[0]
        access_token = create_access_token(
            data={
                "sub": usuario["email"],
                "user_id": usuario["id"],
                "role": usuario["role"]
            }
        )
        refresh_token = create_refresh_token(
            data={
                "sub": usuario["email"],
                "user_id": usuario["id"],
                "role": usuario["role"]
            }
        )

        return UsuarioLoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            usuario=UsuarioResponse(**usuario)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro no refresh token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar token"
        )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    current_user: TokenData = Depends(get_current_user)
):
    """
    Finaliza a sessão do usuário no cliente.

    Note:
        Como o backend é stateless, este endpoint apenas confirma o logout.
    """
    return


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    change_data: UsuarioChangePassword,
    current_user: TokenData = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """
    Altera a senha do usuário autenticado.
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

        usuario = response.data[0]
        if not verify_password(change_data.current_password, usuario.get("senha_hash", "")):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Senha atual incorreta"
            )

        senha_hash = get_password_hash(change_data.new_password)
        supabase.table("usuarios") \
            .update({"senha_hash": senha_hash}) \
            .eq("id", current_user.user_id) \
            .execute()

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao alterar senha: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao alterar senha"
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
