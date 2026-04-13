"""
Modelo de Convênio
Define a estrutura de dados para Convênios no sistema
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date
from enum import Enum


# Função manual que faz o papel do 'to_camel' (compatível com Pydantic V1)
def to_camel(string: str) -> str:
    """Converte 'numero_convenio' para 'numeroConvenio'"""
    words = string.split('_')
    return words[0] + ''.join(word.capitalize() for word in words[1:])


class StatusConvenio(str, Enum):
    """Enumeração de status de convênio"""
    PROPOSTA = "proposta"
    ATIVO = "ativo"
    SUSPENSO = "suspenso"
    ENCERRADO = "encerrado"
    CANCELADO = "cancelado"


class ConvenioBase(BaseModel):
    """Base model com atributos comuns de Convênio"""
    numero_convenio: str = Field(..., min_length=1, max_length=50)
    empresa_id: str = Field(..., description="ID da empresa parceira")
    descricao: str = Field(..., min_length=1, max_length=500)
    data_inicio: date = Field(..., description="Data de início da vigência")
    data_fim: date = Field(..., description="Data de término da vigência")
    status: StatusConvenio = Field(default=StatusConvenio.PROPOSTA)
    escopo: str = Field(..., min_length=1, max_length=1000)
    responsavel_id: str = Field(..., description="ID do usuário responsável")
    observacoes: Optional[str] = Field(None, max_length=1000)

    # Configuração compatível com Pydantic V2
    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,  # Substitui allow_population_by_field_name
        "from_attributes": True     # Substitui orm_mode
    }


class ConvenioCreate(ConvenioBase):
    """Schema para criação de Convênio"""
    pass


class ConvenioUpdate(BaseModel):
    """Schema para atualização de Convênio"""
    descricao: Optional[str] = Field(None, min_length=1, max_length=500)
    data_inicio: Optional[date] = None
    data_fim: Optional[date] = None
    status: Optional[StatusConvenio] = None
    escopo: Optional[str] = Field(None, min_length=1, max_length=1000)
    responsavel_id: Optional[str] = None
    observacoes: Optional[str] = Field(None, max_length=1000)


class ConvenioResponse(ConvenioBase):
    """Schema para resposta de Convênio"""
    id: str
    data_criacao: datetime
    data_atualizacao: Optional[datetime] = None
    documento_url: Optional[str] = None

    
