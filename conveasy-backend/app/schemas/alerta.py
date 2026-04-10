"""
Schemas para Alertas
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AlertaBase(BaseModel):
    """
    Schema base para alertas
    """
    titulo: str
    mensagem: str
    tipo: str  # 'info', 'warning', 'error', 'success'
    prioridade: str  # 'baixa', 'media', 'alta', 'critica'
    lido: bool = False
    convenio_id: Optional[str] = None
    empresa_id: Optional[str] = None


class AlertaCreate(AlertaBase):
    """
    Schema para criação de alertas
    """
    pass


class AlertaUpdate(BaseModel):
    """
    Schema para atualização de alertas
    """
    titulo: Optional[str] = None
    mensagem: Optional[str] = None
    tipo: Optional[str] = None
    prioridade: Optional[str] = None
    lido: Optional[bool] = None


class AlertaResponse(AlertaBase):
    """
    Schema de resposta para alertas
    """
    id: str
    usuario_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True