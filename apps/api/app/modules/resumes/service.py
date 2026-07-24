from fastapi import HTTPException, status
import uuid
from typing import List
from app.modules.resumes.repository import ResumeRepository
from app.modules.resumes.schemas import ResumeCreate, ResumeUpdate, ResumeResponse
from app.modules.resumes.models import Resume

class ResumeService:
    def __init__(self, repository: ResumeRepository):
        self.repository = repository

    async def create_resume(self, user_id: uuid.UUID, data: ResumeCreate) -> Resume:
        return await self.repository.create(user_id, data)

    async def list_resumes(self, user_id: uuid.UUID) -> List[Resume]:
        return await self.repository.get_all(user_id)

    async def get_resume(self, resume_id: uuid.UUID, user_id: uuid.UUID) -> Resume:
        resume = await self.repository.get_by_id(resume_id, user_id)
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found"
            )
        return resume

    async def update_resume(self, resume_id: uuid.UUID, user_id: uuid.UUID, data: ResumeUpdate) -> Resume:
        resume = await self.get_resume(resume_id, user_id)
        return await self.repository.update(resume, data)

    async def delete_resume(self, resume_id: uuid.UUID, user_id: uuid.UUID):
        resume = await self.get_resume(resume_id, user_id)
        await self.repository.delete(resume)
