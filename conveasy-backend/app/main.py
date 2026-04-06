"""
Aplicação FastAPI Principal
Ponto de entrada da API ConvEasy
"""

import logging
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.config import settings
from app.middlewares.cors import setup_cors_middleware
from app.api.v1.router import router as v1_router

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Criação da aplicação FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API de Gerenciamento de Convênios - TEIA UNDB",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configuração de CORS
setup_cors_middleware(app)

# Inclusão de rotas
app.include_router(v1_router)


@app.get("/", tags=["Root"])
async def read_root():
    """
    Endpoint raiz da API

    Returns:
        dict: Informações sobre a API
    """
    return {
        "message": "Bem-vindo à API ConvEasy",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Verifica a saúde da aplicação

    Returns:
        dict: Status da aplicação
    """
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME
    }


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """
    Handler para exceções gerais não capturadas

    Args:
        request: Requisição HTTP
        exc: Exceção capturada

    Returns:
        JSONResponse: Resposta padronizada de erro
    """
    logger.error(f"Erro não tratado: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Erro interno do servidor",
            "error": str(exc) if settings.DEBUG else "Internal Server Error"
        }
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
