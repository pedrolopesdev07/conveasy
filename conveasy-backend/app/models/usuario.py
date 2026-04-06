"""
Modelo de Usuário
Define a estrutura de dados para Usuários no sistema
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    """Enumeração de papéis de usuário"""
    ADMIN = "admin"
    GESTOR = "gestor"
    USUARIO = "usuario"


class UsuarioBase(BaseModel):
    """Base model com atributos comuns de Usuário"""
    nome_completo: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    role: UserRole = Field(default=UserRole.USUARIO)
    telefone: Optional[str] = Field(None, max_length=20)
    departamento: Optional[str] = Field(None, max_length=100)


class UsuarioCreate(UsuarioBase):
    """Schema para criação de Usuário"""
    senha: str = Field(..., min_length=8, max_length=255)


class UsuarioUpdate(BaseModel):
    """Schema para atualização de Usuário"""
    nome_completo: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    telefone: Optional[str] = Field(None, max_length=20)
    departamento: Optional[str] = Field(None, max_length=100)


class UsuarioUpdateRole(BaseModel):
    """Schema para atualização de role de usuário (apenas Admin)"""
    role: UserRole


class UsuarioResponse(UsuarioBase):
    """Schema para resposta de Usuário"""
    id: str
    data_criacao: datetime
    data_atualizacao: Optional[datetime] = None
    ativo: bool = True
    ultimo_acesso: Optional[datetime] = None

    class Config:
        from_attributes = True


class UsuarioLoginRequest(BaseModel):
    """Schema para requisição de login"""
    email: EmailStr
    senha: str


class UsuarioLoginResponse(BaseModel):
    """Schema para resposta de login"""
    access_token: str
    token_type: str
    usuario: UsuarioResponse
