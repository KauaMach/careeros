from fastapi import Query, APIRouter, Depends, status
from app.core.response import ApiResponse
from app.modules.auth.models import User
from app.modules.auth.deps import get_current_user
import uuid

from .schemas import CertificateCreate, CertificateUpdate, CertificateResponse
from .service import CertificateService
from .deps import get_certificate_service

router = APIRouter(prefix="/certificates", tags=["certificates"])

@router.post("", response_model=ApiResponse[CertificateResponse], status_code=status.HTTP_201_CREATED)
async def create(
    request: CertificateCreate,
    current_user: User = Depends(get_current_user),
    service: CertificateService = Depends(get_certificate_service)
):
    item = await service.create(current_user.id, request)
    return ApiResponse(data=item, message="Certificate created successfully")

@router.get("", response_model=ApiResponse[list[CertificateResponse]])
async def list_all(
    current_user: User = Depends(get_current_user),
    service: CertificateService = Depends(get_certificate_service)
):
    items = await service.list_all(current_user.id, skip=skip, limit=limit)
    return ApiResponse(data=items)

@router.get("/{item_id}", response_model=ApiResponse[CertificateResponse])
async def get(
    item_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: CertificateService = Depends(get_certificate_service)
):
    item = await service.get(item_id, current_user.id)
    return ApiResponse(data=item)

@router.patch("/{item_id}", response_model=ApiResponse[CertificateResponse])
async def update(
    item_id: uuid.UUID,
    request: CertificateUpdate,
    current_user: User = Depends(get_current_user),
    service: CertificateService = Depends(get_certificate_service)
):
    item = await service.update(item_id, current_user.id, request)
    return ApiResponse(data=item, message="Certificate updated successfully")

@router.delete("/{item_id}", response_model=ApiResponse[None])
async def delete(
    item_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: CertificateService = Depends(get_certificate_service)
):
    await service.delete(item_id, current_user.id)
    return ApiResponse(data=None, message="Certificate deleted successfully")
