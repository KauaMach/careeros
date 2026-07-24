import pytest
from unittest.mock import AsyncMock, patch
import uuid
from app.modules.auth.service import AuthService
from app.modules.auth.schemas import RegisterRequest, LoginRequest
from app.core.exceptions import AppException, UnauthorizedException
from app.modules.auth.models import User
from app.core.security import PasswordHasher

@pytest.fixture
def mock_repo():
    return AsyncMock()

@pytest.fixture
def auth_service(mock_repo):
    return AuthService(repository=mock_repo)

@pytest.mark.asyncio
async def test_register_success(auth_service, mock_repo):
    # Setup
    mock_repo.get_by_email.return_value = None
    
    def create_side_effect(user):
        user.id = uuid.uuid4()
        user.is_active = True
        user.is_verified = False
        from datetime import datetime, timezone
        user.created_at = datetime.now(timezone.utc)
        user.updated_at = datetime.now(timezone.utc)
        return user
    mock_repo.create.side_effect = create_side_effect
    
    req = RegisterRequest(name="Test User", email="test@example.com", password="password123")
    
    # Execute
    result = await auth_service.register(req)
    
    # Assert
    assert result.email == "test@example.com"
    assert result.name == "Test User"
    mock_repo.create.assert_called_once()

@pytest.mark.asyncio
async def test_register_email_exists(auth_service, mock_repo):
    # Setup
    mock_repo.get_by_email.return_value = User(email="test@example.com")
    req = RegisterRequest(name="Test", email="test@example.com", password="password")
    
    # Execute & Assert
    with pytest.raises(AppException) as exc:
        await auth_service.register(req)
    assert exc.value.status_code == 400

@pytest.mark.asyncio
async def test_login_success(auth_service, mock_repo):
    # Setup
    user_id = uuid.uuid4()
    hashed_pwd = PasswordHasher.hash("password123")
    mock_user = User(id=user_id, email="test@example.com", password_hash=hashed_pwd)
    mock_repo.get_by_email.return_value = mock_user
    
    req = LoginRequest(email="test@example.com", password="password123")
    
    # Execute
    token_response, refresh_token = await auth_service.login(req)
    
    # Assert
    assert token_response.access_token is not None
    assert refresh_token is not None
    assert token_response.token_type == "bearer"

@pytest.mark.asyncio
async def test_login_invalid_credentials(auth_service, mock_repo):
    # Setup
    mock_repo.get_by_email.return_value = None
    req = LoginRequest(email="wrong@example.com", password="password123")
    
    # Execute & Assert
    with pytest.raises(UnauthorizedException):
        await auth_service.login(req)
