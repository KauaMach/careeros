from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from .repository import CompanyRepository
from .service import CompanyService

def get_company_repository(session: AsyncSession = Depends(get_session)) -> CompanyRepository:
    return CompanyRepository(session)

def get_company_service(repository: CompanyRepository = Depends(get_company_repository)) -> CompanyService:
    return CompanyService(repository)
