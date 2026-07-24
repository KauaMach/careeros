from pydantic import BaseModel
from typing import Optional, Dict, Any
import uuid

class ResumeBase(BaseModel):
    title: str
    is_master: bool = False
    content: Dict[str, Any] = {}

class ResumeCreate(ResumeBase):
    pass

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    is_master: Optional[bool] = None
    content: Optional[Dict[str, Any]] = None

class ResumeResponse(ResumeBase):
    id: uuid.UUID
    user_id: uuid.UUID

    class Config:
        from_attributes = True

class EnhanceTextRequest(BaseModel):
    text: str
    role: Optional[str] = None
    company: Optional[str] = None

class EnhanceTextResponse(BaseModel):
    improved_text: str
