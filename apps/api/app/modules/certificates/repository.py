from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import uuid
from .models import Certificate

class CertificateRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, item: Certificate) -> Certificate:
        self.session.add(item)
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def get_by_id(self, item_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Certificate]:
        query = select(Certificate).where(Certificate.id == item_id, Certificate.user_id == user_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def list_by_user(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Certificate]:
        query = select(Certificate).where(Certificate.user_id == user_id).order_by(Certificate.created_at.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def update(self, item: Certificate) -> Certificate:
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def delete(self, item: Certificate) -> None:
        await self.session.delete(item)
        await self.session.commit()
