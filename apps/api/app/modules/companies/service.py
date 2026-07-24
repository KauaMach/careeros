from typing import List
import uuid
from app.core.exceptions import AppException
from .models import Company
from .schemas import CompanyCreate, CompanyUpdate, CompanyResponse
from .repository import CompanyRepository

class CompanyService:
    def __init__(self, repository: CompanyRepository):
        self.repository = repository

    async def create(self, user_id: uuid.UUID, data: CompanyCreate) -> CompanyResponse:
        item = Company(user_id=user_id, **data.model_dump())
        created = await self.repository.create(item)
        return CompanyResponse.model_validate(created)

    async def list_all(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[CompanyResponse]:
        items = await self.repository.list_by_user(user_id, skip=skip, limit=limit)
        return [CompanyResponse.model_validate(item) for item in items]

    async def get(self, item_id: uuid.UUID, user_id: uuid.UUID) -> CompanyResponse:
        item = await self.repository.get_by_id(item_id, user_id)
        if not item:
            raise AppException("Company not found", 404)
        return CompanyResponse.model_validate(item)

    async def update(self, item_id: uuid.UUID, user_id: uuid.UUID, data: CompanyUpdate) -> CompanyResponse:
        item = await self.repository.get_by_id(item_id, user_id)
        if not item:
            raise AppException("Company not found", 404)
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(item, key, value)
            
        updated = await self.repository.update(item)
        return CompanyResponse.model_validate(updated)

    async def delete(self, item_id: uuid.UUID, user_id: uuid.UUID) -> None:
        item = await self.repository.get_by_id(item_id, user_id)
        if not item:
            raise AppException("Company not found", 404)
        await self.repository.delete(item)
