from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import uuid
from .models import Company

class CompanyRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, item: Company) -> Company:
        self.session.add(item)
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def get_by_id(self, item_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Company]:
        query = select(Company).where(Company.id == item_id, Company.user_id == user_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def list_by_user(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Company]:
        query = select(Company).where(Company.user_id == user_id).order_by(Company.created_at.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def update(self, item: Company) -> Company:
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def delete(self, item: Company) -> None:
        await self.session.delete(item)
        await self.session.commit()
