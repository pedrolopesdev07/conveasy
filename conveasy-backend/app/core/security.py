"""
Módulo de Segurança - Autenticação JWT e Autorização
Implementa funcionalidades de autenticação para perfis Admin e Gestor
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from enum import Enum
import os

from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from app.config import settings


class UserRole(str, Enum):
    """Enumeração de papéis de usuário suportados"""
    ADMIN = "admin"
    GESTOR = "gestor"
    USUARIO = "usuario"


class TokenData(BaseModel):
    """Schema para dados de token JWT"""
    username: Optional[str] = None
    user_id: Optional[str] = None
    role: Optional[UserRole] = None


class TokenResponse(BaseModel):
    """Response de token após autenticação bem-sucedida"""
    access_token: str
    token_type: str


# Contexto para hash de senhas
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica se a senha em texto plano corresponde ao hash

    Args:
        plain_password: Senha em texto plano
        hashed_password: Senha em hash

    Returns:
        bool: True se a senha está correta, False caso contrário
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Gera um hash bcrypt para a senha

    Args:
        password: Senha em texto plano

    Returns:
        str: Hash bcrypt da senha
    """
    return pwd_context.hash(password)


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Cria um token JWT com os dados fornecidos

    Args:
        data: Dados a serem inclusos no token (e.g., user_id, role)
        expires_delta: Tempo de expiração do token

    Returns:
        str: Token JWT codificado

    Exemplo:
        ```python
        token = create_access_token(
            data={"sub": "user_123", "role": "admin"},
            expires_delta=timedelta(minutes=30)
        )
        ```
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt


def create_refresh_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """Cria um refresh token JWT de longo prazo."""
    if expires_delta is None:
        expires_delta = timedelta(days=7)
    return create_access_token(data, expires_delta)


def verify_refresh_token(token: str) -> TokenData:
    """Verifica o refresh token JWT."""
    return verify_token(token)


def verify_token(token: str) -> TokenData:
    """
    Verifica e decodifica um token JWT

    Args:
        token: Token JWT a ser verificado

    Returns:
        TokenData: Dados extraídos do token

    Raises:
        JWTError: Se o token for inválido ou expirado
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            raise JWTError("Token inválido")

        token_data = TokenData(
            username=username,
            user_id=payload.get("user_id"),
            role=payload.get("role")
        )

    except JWTError:
        raise

    return token_data


def check_permission(user_role: UserRole, required_roles: list) -> bool:
    """
    Verifica se o papel do usuário está autorizado

    Args:
        user_role: Papel do usuário autenticado
        required_roles: Lista de papéis permitidos

    Returns:
        bool: True se o usuário tem permissão, False caso contrário

    Exemplo:
        ```python
        if check_permission(user.role, [UserRole.ADMIN, UserRole.GESTOR]):
            # Permitir acesso
        ```
    """
    return user_role in required_roles
