from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import uuid

class CertificateBase(BaseModel):
    title: str
    institution: str
    hours: Optional[int] = None
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    file_url: Optional[str] = None
    category: Optional[str] = None

class CertificateCreate(CertificateBase):
    pass

class CertificateUpdate(BaseModel):
    title: Optional[str] = None
    institution: Optional[str] = None
    hours: Optional[int] = None
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    file_url: Optional[str] = None
    category: Optional[str] = None

class CertificateResponse(CertificateBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
