"""
Schemas para Documentos
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DocumentoBase(BaseModel):
    """
    Schema base para documentos
    """
    nome: str
    tipo: str
    tamanho: str
    storage_path: str
    convenio_id: str
    uploaded_by: str


class DocumentoResponse(DocumentoBase):
    """
    Schema de resposta para documentos
    """
    id: str
    uploaded_at: datetime

    class Config:
        from_attributes = True