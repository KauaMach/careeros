from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
import uuid
from typing import List, Optional
from app.modules.resumes.models import Resume
from app.modules.resumes.schemas import ResumeCreate, ResumeUpdate

class ResumeRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, resume_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Resume]:
        result = await self.session.execute(
            select(Resume).where(Resume.id == resume_id, Resume.user_id == user_id)
        )
        return result.scalars().first()

    async def get_all(self, user_id: uuid.UUID) -> List[Resume]:
        result = await self.session.execute(
            select(Resume).where(Resume.user_id == user_id)
        )
        return list(result.scalars().all())

    async def create(self, user_id: uuid.UUID, data: ResumeCreate) -> Resume:
        resume = Resume(
            user_id=user_id,
            title=data.title,
            is_master=data.is_master,
            content=data.content
        )
        self.session.add(resume)
        await self.session.commit()
        await self.session.refresh(resume)
        return resume

    async def update(self, resume: Resume, data: ResumeUpdate) -> Resume:
        if data.title is not None:
            resume.title = data.title
        if data.is_master is not None:
            resume.is_master = data.is_master
        if data.content is not None:
            resume.content = data.content
            
        await self.session.commit()
        await self.session.refresh(resume)
        return resume

    async def delete(self, resume: Resume):
        await self.session.delete(resume)
        await self.session.commit()
