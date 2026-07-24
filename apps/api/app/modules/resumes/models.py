import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False, index=True)
    title = Column(String, nullable=False) # e.g. "Master", "Python Developer"
    is_master = Column(Boolean, default=False)
    content = Column(JSONB, default=dict) # Stores sections: experience, education, skills

    user = relationship("User", backref="resumes")
