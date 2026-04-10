"""
Configurações da aplicação FastAPI
Carrega variáveis de ambiente e define configurações globais
"""

from pydantic import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Configurações da aplicação utilizando Pydantic v1
    Todas as variáveis são carregadas do arquivo .env
    """

    # Informações da API
    PROJECT_NAME: str = "ConvEasy Backend"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False

    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str

    # JWT Configuration
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS Configuration
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    class Config:
        env_file = ".env"
        case_sensitive = True


# Instância global de configurações
settings = Settings()
