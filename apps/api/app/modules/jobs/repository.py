from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.modules.jobs.models import Job
import uuid

class JobRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, job: Job) -> Job:
        self.session.add(job)
        await self.session.commit()
        await self.session.refresh(job)
        return job

    async def get_by_id(self, job_id: uuid.UUID, user_id: uuid.UUID) -> Job | None:
        result = await self.session.execute(
            select(Job).where(Job.id == job_id, Job.user_id == user_id)
        )
        return result.scalars().first()

    async def list_by_user(self, user_id: uuid.UUID) -> list[Job]:
        result = await self.session.execute(
            select(Job).where(Job.user_id == user_id).order_by(Job.created_at.desc())
        )
        return list(result.scalars().all())

    async def update(self, job: Job) -> Job:
        await self.session.commit()
        await self.session.refresh(job)
        return job

    async def delete(self, job_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        result = await self.session.execute(
            delete(Job).where(Job.id == job_id, Job.user_id == user_id)
        )
        await self.session.commit()
        return result.rowcount > 0
