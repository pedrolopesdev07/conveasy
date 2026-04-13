#!/usr/bin/env python3
"""
Script para iniciar o servidor FastAPI com configurações corretas
"""

import uvicorn
from app.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",  # Aceita conexões de qualquer IP
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
