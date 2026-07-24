from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from .repository import CertificateRepository
from .service import CertificateService

def get_certificate_repository(session: AsyncSession = Depends(get_session)) -> CertificateRepository:
    return CertificateRepository(session)

def get_certificate_service(repository: CertificateRepository = Depends(get_certificate_repository)) -> CertificateService:
    return CertificateService(repository)
