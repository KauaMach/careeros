from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

class ChecklistItem(BaseModel):
    id: str
    text: str
    done: bool

class JobCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    company: str = Field(..., min_length=2, max_length=255)
    status: str = "BACKLOG"
    url: str | None = None
    location: str | None = None
    salary: str | None = None
    technologies: list[str] | None = None
    is_favorite: bool = False
    notes: str | None = None
    checklist: list[ChecklistItem] | None = None

class JobUpdate(BaseModel):
    title: str | None = None
    company: str | None = None
    status: str | None = None
    url: str | None = None
    location: str | None = None
    salary: str | None = None
    technologies: list[str] | None = None
    is_favorite: bool | None = None
    notes: str | None = None
    checklist: list[ChecklistItem] | None = None

class JobResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    company: str
    status: str
    url: str | None = None
    location: str | None = None
    salary: str | None = None
    technologies: list[str] | None = None
    is_favorite: bool
    notes: str | None = None
    checklist: list[ChecklistItem] | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
