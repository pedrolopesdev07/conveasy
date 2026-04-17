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
    ESTAGIARIO = "estagiario"


class UsuarioBase(BaseModel):
    """Base model com atributos comuns de Usuário"""
    usuario: str = Field(..., min_length=1, max_length=255)
    nome: Optional[str] = Field(None, min_length=1, max_length=255, alias="nome_completo")
    email: EmailStr
    perfil: UserRole = Field(default=UserRole.USUARIO, alias="role")
    setor: Optional[str] = Field(None, max_length=100, alias="departamento")
    
    model_config = {
        "populate_by_name": True
    }


class UsuarioCreate(UsuarioBase):
    """Schema para criação de Usuário"""
    senha: str = Field(..., min_length=8, max_length=255)


class UsuarioUpdate(BaseModel):
    """Schema para atualização de Usuário"""
    nome: Optional[str] = Field(None, min_length=1, max_length=255, alias="nome_completo")
    email: Optional[EmailStr] = None
    setor: Optional[str] = Field(None, max_length=100, alias="departamento")
    
    model_config = {
        "populate_by_name": True
    }


class UsuarioUpdateRole(BaseModel):
    """Schema para atualização de role de usuário (apenas Admin)"""
    role: UserRole


class UsuarioResponse(UsuarioBase):
    """Schema para resposta de Usuário"""
    id: str
    usuario: str = Field(alias="nome_completo")  # ✅ Mapear 'nome_completo' do banco para 'usuario' no frontend
    created_at: Optional[datetime] = None
    ultimo_acesso: Optional[str] = None
    status: str = Field(default="ativo")  # Mudar para str conforme banco
    
    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }


class UsuarioLoginRequest(BaseModel):
    """Schema para requisição de login"""
    email: EmailStr
    senha: str


class UsuarioLoginResponse(BaseModel):
    """Schema para resposta de login"""
    access_token: str
    refresh_token: str
    token_type: str
    usuario: UsuarioResponse


class UsuarioRefreshRequest(BaseModel):
    """Schema para refresh token"""
    refresh_token: str


class UsuarioChangePassword(BaseModel):
    """Schema para mudança de senha"""
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=255)
