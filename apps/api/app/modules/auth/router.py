from fastapi import APIRouter, Depends, Request, Response
from app.modules.auth.schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.modules.auth.service import AuthService
from app.modules.auth.deps import get_auth_service, get_current_user
from app.core.response import ApiResponse
from app.modules.auth.models import User
from app.core.rate_limit import limiter
from app.core.security import JWTHandler
from app.core.exceptions import UnauthorizedException

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=ApiResponse[UserResponse])
@limiter.limit("5/minute")
async def register(
    request: Request,
    payload: RegisterRequest,
    service: AuthService = Depends(get_auth_service)
):
    user = await service.register(payload)
    return ApiResponse(data=user, message="User registered successfully")

@router.post("/login", response_model=ApiResponse[TokenResponse])
@limiter.limit("10/minute")
async def login(
    request: Request,
    payload: LoginRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service)
):
    token_response, refresh_token = await service.login(payload)
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True, # Should be true in production
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )
    
    return ApiResponse(data=token_response, message="Login successful")

@router.post("/refresh", response_model=ApiResponse[TokenResponse])
async def refresh(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise UnauthorizedException("Refresh token missing")
        
    payload = JWTHandler.decode_access_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise UnauthorizedException("Invalid refresh token")
        
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid token payload")
        
    access_token = JWTHandler.create_access_token(subject=user_id)
    return ApiResponse(data=TokenResponse(access_token=access_token), message="Token refreshed")

@router.get("/me", response_model=ApiResponse[UserResponse])
async def get_me(
    current_user: User = Depends(get_current_user)
):
    return ApiResponse(data=UserResponse.model_validate(current_user))
