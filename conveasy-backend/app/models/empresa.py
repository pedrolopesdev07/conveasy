"""
Modelo de Empresa
Define a estrutura de dados para Empresas no sistema
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class EmpresaBase(BaseModel):
    """Base model com atributos comuns de Empresa"""
    razao_social: str = Field(..., min_length=1, max_length=255)
    cnpj: str = Field(..., min_length=14, max_length=18)
    endereco: str = Field(..., min_length=1, max_length=255)
    cidade: str = Field(..., min_length=1, max_length=100)
    estado: str = Field(..., min_length=2, max_length=2)
    cep: str = Field(..., min_length=8, max_length=10)
    telefone: Optional[str] = Field(None, max_length=20)
    email: str = Field(..., min_length=5, max_length=255)
    website: Optional[str] = Field(None, max_length=255)
    representante_legal: str = Field(..., min_length=1, max_length=255)
    cargo_representante: str = Field(..., min_length=1, max_length=100)


class EmpresaCreate(EmpresaBase):
    """Schema para criação de Empresa"""
    pass


class EmpresaUpdate(BaseModel):
    """Schema para atualização de Empresa"""
    razao_social: Optional[str] = Field(None, min_length=1, max_length=255)
    endereco: Optional[str] = Field(None, min_length=1, max_length=255)
    cidade: Optional[str] = Field(None, min_length=1, max_length=100)
    estado: Optional[str] = Field(None, min_length=2, max_length=2)
    cep: Optional[str] = Field(None, min_length=8, max_length=10)
    telefone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, min_length=5, max_length=255)
    website: Optional[str] = Field(None, max_length=255)
    representante_legal: Optional[str] = Field(None, min_length=1, max_length=255)
    cargo_representante: Optional[str] = Field(None, min_length=1, max_length=100)


class EmpresaResponse(EmpresaBase):
    """Schema para resposta de Empresa"""
    id: str
    data_criacao: datetime
    data_atualizacao: Optional[datetime] = None
    ativo: bool = True

    class Config:
        from_attributes = True
