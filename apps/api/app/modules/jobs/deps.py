from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.modules.jobs.repository import JobRepository
from app.modules.jobs.service import JobService

def get_job_service(session: AsyncSession = Depends(get_session)) -> JobService:
    repository = JobRepository(session)
    return JobService(repository)
