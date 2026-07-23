from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.modules.auth.repository import UserRepository
from app.modules.auth.service import AuthService
from app.core.security import JWTHandler
from app.core.exceptions import UnauthorizedException
from app.modules.auth.models import User
import uuid

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_auth_service(session: AsyncSession = Depends(get_session)) -> AuthService:
    repository = UserRepository(session)
    return AuthService(repository)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_session)
) -> User:
    payload = JWTHandler.decode_access_token(token)
    if not payload:
        raise UnauthorizedException("Invalid token")
        
    user_id_str = payload.get("sub")
    if not user_id_str:
        raise UnauthorizedException("Invalid token payload")
        
    try:
        user_id = uuid.UUID(user_id_str)
    except ValueError:
        raise UnauthorizedException("Invalid user id")
        
    repository = UserRepository(session)
    user = await repository.get_by_id(user_id)
    if not user:
        raise UnauthorizedException("User not found")
        
    return user
