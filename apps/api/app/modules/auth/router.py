from fastapi import APIRouter, Depends
from app.modules.auth.schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.modules.auth.service import AuthService
from app.modules.auth.deps import get_auth_service, get_current_user
from app.core.response import ApiResponse
from app.modules.auth.models import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=ApiResponse[UserResponse])
async def register(
    request: RegisterRequest,
    service: AuthService = Depends(get_auth_service)
):
    user = await service.register(request)
    return ApiResponse(data=user, message="User registered successfully")

@router.post("/login", response_model=ApiResponse[TokenResponse])
async def login(
    request: LoginRequest,
    service: AuthService = Depends(get_auth_service)
):
    token = await service.login(request)
    return ApiResponse(data=token, message="Login successful")

@router.get("/me", response_model=ApiResponse[UserResponse])
async def get_me(
    current_user: User = Depends(get_current_user)
):
    return ApiResponse(data=UserResponse.model_validate(current_user))
