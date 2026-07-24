from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import uuid

class CompanyBase(BaseModel):
    name: str
    industry: Optional[str] = None
    benefits: List[str] = []
    salary_range_min: Optional[float] = None
    salary_range_max: Optional[float] = None
    technologies: List[str] = []

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    benefits: Optional[List[str]] = None
    salary_range_min: Optional[float] = None
    salary_range_max: Optional[float] = None
    technologies: Optional[List[str]] = None

class CompanyResponse(CompanyBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
