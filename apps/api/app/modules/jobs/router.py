from fastapi import APIRouter, Depends, status
from app.modules.jobs.schemas import JobCreate, JobUpdate, JobResponse
from app.modules.jobs.service import JobService
from app.modules.jobs.deps import get_job_service
from app.core.response import ApiResponse
from app.modules.auth.models import User
from app.modules.auth.deps import get_current_user
import uuid

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.post("", response_model=ApiResponse[JobResponse], status_code=status.HTTP_201_CREATED)
async def create_job(
    request: JobCreate,
    current_user: User = Depends(get_current_user),
    service: JobService = Depends(get_job_service)
):
    job = await service.create_job(current_user.id, request)
    return ApiResponse(data=job, message="Job created successfully")

@router.get("", response_model=ApiResponse[list[JobResponse]])
async def list_jobs(
    current_user: User = Depends(get_current_user),
    service: JobService = Depends(get_job_service)
):
    jobs = await service.list_jobs(current_user.id)
    return ApiResponse(data=jobs)

@router.get("/{job_id}", response_model=ApiResponse[JobResponse])
async def get_job(
    job_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: JobService = Depends(get_job_service)
):
    job = await service.get_job(job_id, current_user.id)
    return ApiResponse(data=job)

@router.patch("/{job_id}", response_model=ApiResponse[JobResponse])
async def update_job(
    job_id: uuid.UUID,
    request: JobUpdate,
    current_user: User = Depends(get_current_user),
    service: JobService = Depends(get_job_service)
):
    job = await service.update_job(job_id, current_user.id, request)
    return ApiResponse(data=job, message="Job updated successfully")

@router.delete("/{job_id}", response_model=ApiResponse[None])
async def delete_job(
    job_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: JobService = Depends(get_job_service)
):
    await service.delete_job(job_id, current_user.id)
    return ApiResponse(data=None, message="Job deleted successfully")
