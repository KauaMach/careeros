from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.modules.auth.router import router as auth_router
from app.modules.jobs.router import router as jobs_router
from app.modules.resumes.router import router as resumes_router
from app.modules.companies.router import router as companies_router
from app.modules.certificates.router import router as certificates_router
from app.core.exceptions import AppException
from app.core.response import ApiResponse
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # setup
    yield
    # teardown

app = FastAPI(
    title="CareerOS API",
    description="API for CareerOS platform",
    version="1.0.0",
    lifespan=lifespan
)

from app.core.config import settings
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.rate_limit import limiter

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ApiResponse(
            success=False,
            message=exc.message,
            errors=exc.errors
        ).model_dump()
    )

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(jobs_router)
api_router.include_router(resumes_router)
api_router.include_router(companies_router)
api_router.include_router(certificates_router)
app.include_router(api_router)

@app.get("/health")
async def health_check():
    return ApiResponse(data={"status": "ok"})
