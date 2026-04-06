"""
Schemas de Convênio
Schemas Pydantic para validação de requisições/respostas
"""

from app.models.convenio import (
    ConvenioBase,
    ConvenioCreate,
    ConvenioUpdate,
    ConvenioResponse,
    StatusConvenio
)

__all__ = [
    "ConvenioBase",
    "ConvenioCreate",
    "ConvenioUpdate",
    "ConvenioResponse",
    "StatusConvenio"
]
