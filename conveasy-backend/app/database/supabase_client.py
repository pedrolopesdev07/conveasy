"""
Cliente Supabase
Gerencia a conexão com o Supabase (PostgreSQL + Storage + Auth)
"""

from supabase import create_client, Client
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class SupabaseClient:
    """
    Cliente singleton para comunicação com Supabase
    Fornece métodos para operações CRUD e storage
    """

    _instance: Client = None

    @classmethod
    def get_client(cls) -> Client:
        """
        Obtém ou cria uma instância do cliente Supabase

        Returns:
            Client: Instância do cliente Supabase

        Raises:
            ValueError: Se as credenciais do Supabase não estiverem configuradas
        """
        if cls._instance is None:
            cls._instance = cls._create_client()
        return cls._instance

    @classmethod
    def _create_client(cls) -> Client:
        """
        Cria uma nova instância do cliente Supabase

        Returns:
            Client: Cliente Supabase autenticado

        Raises:
            ValueError: Se SUPABASE_URL ou SUPABASE_KEY estiverem vazios
        """
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise ValueError(
                "SUPABASE_URL e SUPABASE_KEY devem estar configurados no .env"
            )

        try:
            client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            logger.info("Cliente Supabase conectado com sucesso")
            return client
        except Exception as e:
            logger.error(f"Erro ao conectar ao Supabase: {str(e)}")
            raise


def get_supabase() -> Client:
    """
    Dependency para obter o cliente Supabase em endpoints

    Returns:
        Client: Instância do cliente Supabase

    Exemplo:
        ```python
        from fastapi import Depends
        from app.database.supabase_client import get_supabase

        @router.get("/empresas")
        async def list_empresas(supabase: Client = Depends(get_supabase)):
            response = supabase.table("empresas").select("*").execute()
            return response.data
        ```
    """
    return SupabaseClient.get_client()
