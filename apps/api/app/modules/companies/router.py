from fastapi import Query, APIRouter, Depends, status
from app.core.response import ApiResponse
from app.modules.auth.models import User
from app.modules.auth.deps import get_current_user
import uuid

from .schemas import CompanyCreate, CompanyUpdate, CompanyResponse
from .service import CompanyService
from .deps import get_company_service

router = APIRouter(prefix="/companies", tags=["companies"])

@router.post("", response_model=ApiResponse[CompanyResponse], status_code=status.HTTP_201_CREATED)
async def create(
    request: CompanyCreate,
    current_user: User = Depends(get_current_user),
    service: CompanyService = Depends(get_company_service)
):
    item = await service.create(current_user.id, request)
    return ApiResponse(data=item, message="Company created successfully")

@router.get("", response_model=ApiResponse[list[CompanyResponse]])
async def list_all(
    current_user: User = Depends(get_current_user),
    service: CompanyService = Depends(get_company_service)
):
    items = await service.list_all(current_user.id, skip=skip, limit=limit)
    return ApiResponse(data=items)

@router.get("/{item_id}", response_model=ApiResponse[CompanyResponse])
async def get(
    item_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: CompanyService = Depends(get_company_service)
):
    item = await service.get(item_id, current_user.id)
    return ApiResponse(data=item)

@router.patch("/{item_id}", response_model=ApiResponse[CompanyResponse])
async def update(
    item_id: uuid.UUID,
    request: CompanyUpdate,
    current_user: User = Depends(get_current_user),
    service: CompanyService = Depends(get_company_service)
):
    item = await service.update(item_id, current_user.id, request)
    return ApiResponse(data=item, message="Company updated successfully")

@router.delete("/{item_id}", response_model=ApiResponse[None])
async def delete(
    item_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: CompanyService = Depends(get_company_service)
):
    await service.delete(item_id, current_user.id)
    return ApiResponse(data=None, message="Company deleted successfully")
