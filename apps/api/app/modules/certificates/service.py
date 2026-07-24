from typing import List
import uuid
from app.core.exceptions import AppException
from .models import Certificate
from .schemas import CertificateCreate, CertificateUpdate, CertificateResponse
from .repository import CertificateRepository

class CertificateService:
    def __init__(self, repository: CertificateRepository):
        self.repository = repository

    async def create(self, user_id: uuid.UUID, data: CertificateCreate) -> CertificateResponse:
        item = Certificate(user_id=user_id, **data.model_dump())
        created = await self.repository.create(item)
        return CertificateResponse.model_validate(created)

    async def list_all(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[CertificateResponse]:
        items = await self.repository.list_by_user(user_id, skip=skip, limit=limit)
        return [CertificateResponse.model_validate(item) for item in items]

    async def get(self, item_id: uuid.UUID, user_id: uuid.UUID) -> CertificateResponse:
        item = await self.repository.get_by_id(item_id, user_id)
        if not item:
            raise AppException("Certificate not found", 404)
        return CertificateResponse.model_validate(item)

    async def update(self, item_id: uuid.UUID, user_id: uuid.UUID, data: CertificateUpdate) -> CertificateResponse:
        item = await self.repository.get_by_id(item_id, user_id)
        if not item:
            raise AppException("Certificate not found", 404)
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(item, key, value)
            
        updated = await self.repository.update(item)
        return CertificateResponse.model_validate(updated)

    async def delete(self, item_id: uuid.UUID, user_id: uuid.UUID) -> None:
        item = await self.repository.get_by_id(item_id, user_id)
        if not item:
            raise AppException("Certificate not found", 404)
        await self.repository.delete(item)
