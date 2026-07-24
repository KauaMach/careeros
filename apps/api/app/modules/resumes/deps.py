from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.modules.resumes.repository import ResumeRepository
from app.modules.resumes.service import ResumeService

def get_resume_service(session: AsyncSession = Depends(get_session)) -> ResumeService:
    repository = ResumeRepository(session)
    return ResumeService(repository)
