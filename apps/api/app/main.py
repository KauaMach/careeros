from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.modules.auth.router import router as auth_router
from app.modules.jobs.router import router as jobs_router
from app.core.exceptions import AppException
from app.core.response import ApiResponse
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # setup
    yield
    # teardown

app = FastAPI(title="CareerOS API", lifespan=lifespan)

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

app.include_router(auth_router)
app.include_router(jobs_router)

@app.get("/health")
async def health_check():
    return ApiResponse(data={"status": "ok"})
