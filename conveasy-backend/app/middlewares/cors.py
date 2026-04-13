"""
Configuração de CORS
Middleware para permitir requisições cross-origin
"""

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.config import settings


def setup_cors_middleware(app: FastAPI) -> None:
    """
    Configura o middleware CORS na aplicação FastAPI

    Args:
        app: Instância da aplicação FastAPI

    Nota:
        Temporariamente permitindo todas as origens para debug
    """
    # Temporariamente permitir todas as origens para debug
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Temporário para debug
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
