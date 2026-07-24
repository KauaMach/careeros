from fastapi import APIRouter, Depends, status
from app.modules.resumes.schemas import ResumeCreate, ResumeUpdate, ResumeResponse, EnhanceTextRequest, EnhanceTextResponse
from app.modules.resumes.service import ResumeService
from app.modules.resumes.deps import get_resume_service
from app.core.response import ApiResponse
from app.modules.auth.models import User
from app.modules.auth.deps import get_current_user
from app.core.ai import enhance_resume_text
import uuid

router = APIRouter(prefix="/resumes", tags=["resumes"])

@router.post("/enhance", response_model=ApiResponse[EnhanceTextResponse])
async def enhance_text(
    request: EnhanceTextRequest,
    current_user: User = Depends(get_current_user)
):
    improved_text = await enhance_resume_text(request.text, request.role, request.company)
    return ApiResponse(data=EnhanceTextResponse(improved_text=improved_text), message="Texto melhorado com sucesso")

@router.post("", response_model=ApiResponse[ResumeResponse], status_code=status.HTTP_201_CREATED)
async def create_resume(
    request: ResumeCreate,
    current_user: User = Depends(get_current_user),
    service: ResumeService = Depends(get_resume_service)
):
    resume = await service.create_resume(current_user.id, request)
    return ApiResponse(data=resume, message="Currículo criado com sucesso")

@router.get("", response_model=ApiResponse[list[ResumeResponse]])
async def list_resumes(
    current_user: User = Depends(get_current_user),
    service: ResumeService = Depends(get_resume_service)
):
    resumes = await service.list_resumes(current_user.id)
    return ApiResponse(data=resumes)

@router.get("/{resume_id}", response_model=ApiResponse[ResumeResponse])
async def get_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: ResumeService = Depends(get_resume_service)
):
    resume = await service.get_resume(resume_id, current_user.id)
    return ApiResponse(data=resume)

@router.patch("/{resume_id}", response_model=ApiResponse[ResumeResponse])
async def update_resume(
    resume_id: uuid.UUID,
    request: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    service: ResumeService = Depends(get_resume_service)
):
    resume = await service.update_resume(resume_id, current_user.id, request)
    return ApiResponse(data=resume, message="Currículo atualizado com sucesso")

@router.delete("/{resume_id}", response_model=ApiResponse[None])
async def delete_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: ResumeService = Depends(get_resume_service)
):
    await service.delete_resume(resume_id, current_user.id)
    return ApiResponse(data=None, message="Currículo excluído com sucesso")
