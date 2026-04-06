"""
Router Principal da API v1
Agrega todos os endpoints da versão 1
"""

from fastapi import APIRouter

from app.api.v1.endpoints import empresa, convenio, usuario

router = APIRouter(prefix="/api/v1")

# Inclui rotas de cada recurso
router.include_router(usuario.router)
router.include_router(empresa.router)
router.include_router(convenio.router)
