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
        As origens permitidas são carregadas do arquivo .env
        Padrão: ["http://localhost:3000", "http://localhost:5173"]
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
