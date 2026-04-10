"""
Dependências da API v1
Funções reutilizáveis para validação e autorização
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
import logging

from app.core.security import verify_token, TokenData, UserRole

logger = logging.getLogger(__name__)

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> TokenData:
    """
    Valida o token JWT ea retorna os dados do usuário atual

    Args:
        credentials: Credenciais HTTP Bearer

    Returns:
        TokenData: Dados do usuário extraídos do token

    Raises:
        HTTPException: Se o token for inválido ou expirado

    Exemplo:
        ```python
        @router.get("/me")
        async def get_current_user_info(
            current_user: TokenData = Depends(get_current_user)
        ):
            return {"user_id": current_user.user_id}
        ```
    """
    try:
        token = credentials.credentials
        token_data = verify_token(token)
        return token_data

    except JWTError as e:
        logger.warning(f"Token inválido: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_admin(
    current_user: TokenData = Depends(get_current_user)
) -> TokenData:
    """
    Valida que o usuário atual é um administrador

    Args:
        current_user: Dados do usuário atual

    Returns:
        TokenData: Dados do usuário

    Raises:
        HTTPException: Se o usuário não for admin

    Exemplo:
        ```python
        @router.delete("/usuarios/{user_id}")
        async def delete_user(
            user_id: str,
            admin: TokenData = Depends(get_current_admin)
        ):
            # Apenas admins podem deletar usuários
        ```
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito a administradores"
        )
    return current_user


async def get_current_gestor_or_admin(
    current_user: TokenData = Depends(get_current_user)
) -> TokenData:
    """
    Valida que o usuário é gestor ou administrador

    Args:
        current_user: Dados do usuário atual

    Returns:
        TokenData: Dados do usuário

    Raises:
        HTTPException: Se o usuário não for gestor ou admin

    Exemplo:
        ```python
        @router.post("/convenios")
        async def create_convenio(
            convenio: ConvenioCreate,
            user: TokenData = Depends(get_current_gestor_or_admin)
        ):
            # Apenas gestores e admins podem criar convênios
        ```
    """
    if current_user.role not in [UserRole.ADMIN, UserRole.GESTOR]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito a gestores e administradores"
        )
    return current_user
