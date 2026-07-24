from app.modules.auth.repository import UserRepository
from app.modules.auth.schemas import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
)
from app.modules.auth.models import User
from app.core.security import PasswordHasher, JWTHandler
from app.core.exceptions import AppException, UnauthorizedException
import uuid


class AuthService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def register(self, data: RegisterRequest) -> UserResponse:
        existing_user = await self.repository.get_by_email(data.email)
        if existing_user:
            raise AppException("E-mail já cadastrado", status_code=400)

        hashed_password = PasswordHasher.hash(data.password)
        user = User(email=data.email, password_hash=hashed_password, name=data.name)

        created_user = await self.repository.create(user)
        return UserResponse.model_validate(created_user)

    async def login(self, data: LoginRequest) -> TokenResponse:
        user = await self.repository.get_by_email(data.email)
        if not user or not PasswordHasher.verify(data.password, user.password_hash):
            raise UnauthorizedException("Invalid credentials")

        access_token = JWTHandler.create_access_token(subject=user.id)
        return TokenResponse(access_token=access_token)

    async def get_me(self, user_id: uuid.UUID) -> UserResponse:
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise UnauthorizedException("User not found")
        return UserResponse.model_validate(user)
