from app.modules.jobs.repository import JobRepository
from app.modules.jobs.schemas import JobCreate, JobUpdate, JobResponse
from app.modules.jobs.models import Job
from app.core.exceptions import NotFoundException
import uuid

class JobService:
    def __init__(self, repository: JobRepository):
        self.repository = repository

    async def create_job(self, user_id: uuid.UUID, data: JobCreate) -> JobResponse:
        checklist_data = [item.model_dump() for item in data.checklist] if data.checklist else None
        job = Job(
            user_id=user_id,
            title=data.title,
            company=data.company,
            status=data.status,
            url=data.url,
            location=data.location,
            salary=data.salary,
            technologies=data.technologies,
            is_favorite=data.is_favorite,
            notes=data.notes,
            checklist=checklist_data
        )
        created = await self.repository.create(job)
        return JobResponse.model_validate(created)

    async def get_job(self, job_id: uuid.UUID, user_id: uuid.UUID) -> JobResponse:
        job = await self.repository.get_by_id(job_id, user_id)
        if not job:
            raise NotFoundException("Job not found")
        return JobResponse.model_validate(job)

    async def list_jobs(self, user_id: uuid.UUID) -> list[JobResponse]:
        jobs = await self.repository.list_by_user(user_id, skip=skip, limit=limit)
        return [JobResponse.model_validate(job) for job in jobs]

    async def update_job(self, job_id: uuid.UUID, user_id: uuid.UUID, data: JobUpdate) -> JobResponse:
        job = await self.repository.get_by_id(job_id, user_id)
        if not job:
            raise NotFoundException("Job not found")
            
        update_data = data.model_dump(exclude_unset=True)
        if "checklist" in update_data and update_data["checklist"] is not None:
            update_data["checklist"] = [item for item in update_data["checklist"]]
            
        for key, value in update_data.items():
            setattr(job, key, value)
            
        updated = await self.repository.update(job)
        return JobResponse.model_validate(updated)

    async def delete_job(self, job_id: uuid.UUID, user_id: uuid.UUID) -> None:
        deleted = await self.repository.delete(job_id, user_id)
        if not deleted:
            raise NotFoundException("Job not found")
