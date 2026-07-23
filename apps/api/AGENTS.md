# CareerOS Backend — Instruções para Agentes

## Contexto

Este é o backend do CareerOS, construído com **Python 3.12 + FastAPI**.
O documento-mestre é o [PROJECT.md](../../PROJECT.md) (seções 8, 9, 10, 11).

---

## Stack Backend

| Tecnologia | Propósito |
|---|---|
| **FastAPI** | Framework web async |
| **Pydantic v2** | Validação e serialização |
| **SQLAlchemy 2.0** | ORM (async) |
| **Alembic** | Migrations |
| **Celery + Redis** | Task queue assíncrona |
| **python-jose** | JWT tokens |
| **passlib[bcrypt]** | Hashing de senhas |
| **boto3** | Upload S3/MinIO |
| **LangChain** | Abstração para IA multi-provider |
| **Loguru** | Logging |
| **Pytest + httpx** | Testes |
| **Ruff** | Linting + formatting |
| **mypy** | Type checking |
| **uv** | Gerenciador de pacotes |

---

## Estrutura de Módulos

Cada módulo segue o padrão:

```
modules/<nome>/
├── router.py          # Endpoints FastAPI (APIRouter)
├── service.py         # Lógica de negócio
├── repository.py      # Acesso a dados (SQLAlchemy)
├── schemas.py         # Pydantic models (request/response)
├── models.py          # SQLAlchemy models
├── dependencies.py    # Dependencies específicas do módulo (opcional)
└── use_cases/         # Casos de uso complexos (opcional)
    ├── create_job.py
    └── import_job.py
```

---

## Padrões de Código

### Router (router.py)
```python
from fastapi import APIRouter, Depends, status
from app.core.security import get_current_user
from app.modules.jobs.schemas import CreateJobRequest, JobResponse
from app.modules.jobs.service import JobService

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    data: CreateJobRequest,
    current_user: User = Depends(get_current_user),
    service: JobService = Depends(),
) -> JobResponse:
    """Cria uma nova vaga."""
    return await service.create(data, user_id=current_user.id)
```

### Service (service.py)
```python
from uuid import UUID
from app.modules.jobs.repository import JobRepository
from app.modules.jobs.schemas import CreateJobRequest, JobResponse


class JobService:
    def __init__(self, repository: JobRepository = Depends()):
        self.repository = repository

    async def create(self, data: CreateJobRequest, user_id: UUID) -> JobResponse:
        """Cria uma nova vaga para o usuário."""
        job = await self.repository.create(data, user_id)
        return JobResponse.model_validate(job)
```

### Repository (repository.py)
```python
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Depends
from app.database import get_session
from app.modules.jobs.models import Job


class JobRepository:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session

    async def create(self, data: CreateJobRequest, user_id: UUID) -> Job:
        """Persiste uma nova vaga no banco."""
        job = Job(**data.model_dump(), user_id=user_id)
        self.session.add(job)
        await self.session.commit()
        await self.session.refresh(job)
        return job

    async def get_by_id(self, job_id: UUID, user_id: UUID) -> Job | None:
        """Busca vaga por ID, garantindo ownership."""
        stmt = select(Job).where(Job.id == job_id, Job.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
```

### Schemas (schemas.py)
```python
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field
from app.modules.jobs.models import JobStatus


class CreateJobRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    company_id: UUID | None = None
    description: str | None = None
    salary_min: Decimal | None = Field(None, ge=0)
    salary_max: Decimal | None = Field(None, ge=0)
    status: JobStatus = JobStatus.INTERESTED
    technologies: list[str] = []


class JobResponse(BaseModel):
    id: UUID
    title: str
    status: JobStatus
    is_favorite: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
```

### Model (models.py)
```python
import enum
from uuid import uuid4
from datetime import datetime, UTC
from sqlalchemy import String, Text, Numeric, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class JobStatus(str, enum.Enum):
    INTERESTED = "interested"
    APPLIED = "applied"
    SCREENING = "screening"
    INTERVIEW = "interview"
    OFFER = "offer"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class Job(Base):
    __tablename__ = "job"

    id: Mapped[uuid4] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[uuid4] = mapped_column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    company_id: Mapped[uuid4 | None] = mapped_column(UUID(as_uuid=True), ForeignKey("company.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[JobStatus] = mapped_column(Enum(JobStatus), default=JobStatus.INTERESTED)
    salary_min: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    salary_max: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    checklist: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    technologies: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    # Relationships
    user = relationship("User", back_populates="jobs")
    company = relationship("Company", back_populates="jobs")
```

---

## Regras Importantes

### SEMPRE
- Usar `async/await` em TODOS os endpoints e operações de banco
- Usar `Depends()` para injeção de dependência (nunca instanciar diretamente)
- Validar com Pydantic ANTES de processar qualquer dado
- Retornar `JobResponse`, nunca o model SQLAlchemy diretamente
- Usar `UUID` como tipo de ID (nunca int auto-increment)
- Usar `datetime(timezone=True)` (aware datetimes)
- Garantir **ownership** — sempre filtrar por `user_id` nas queries
- Tratar exceções com handlers globais (HTTPException com códigos claros)
- Documentar endpoints com docstrings (aparecem no Swagger)

### NUNCA
- Expor models SQLAlchemy na response (sempre converter para Pydantic)
- Usar `session.execute(text("SELECT * FROM ..."))` com strings concatenadas
- Fazer lógica de negócio no router (delegar para service)
- Fazer queries no service (delegar para repository)
- Importar módulos de infra no domain layer
- Commitar `.env` ou credenciais no código
- Usar `print()` — usar `loguru.logger`
- Bloquear o event loop com operações síncronas (usar `run_in_executor` se necessário)

---

## Testes

### Estrutura
```
tests/
├── conftest.py            # Fixtures globais (app, client, db session, user)
├── unit/
│   ├── test_job_service.py
│   └── test_ats_score.py
├── integration/
│   ├── test_job_api.py
│   └── test_auth_api.py
└── e2e/
```

### Padrão de Teste
```python
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_job(client: AsyncClient, auth_headers: dict):
    """Deve criar uma vaga com sucesso."""
    response = await client.post(
        "/api/v1/jobs",
        json={"title": "Senior Python Dev", "status": "interested"},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["title"] == "Senior Python Dev"


@pytest.mark.asyncio
async def test_create_job_unauthorized(client: AsyncClient):
    """Deve retornar 401 sem autenticação."""
    response = await client.post("/api/v1/jobs", json={"title": "Test"})
    assert response.status_code == 401
```

### Fixtures (conftest.py)
```python
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.main import app
from app.database import Base, get_session


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        yield client


@pytest.fixture
async def auth_headers(client: AsyncClient) -> dict:
    # Registra e faz login para obter token
    await client.post("/api/v1/auth/register", json={
        "email": "test@test.com",
        "password": "Test123!@#",
        "name": "Test User",
    })
    response = await client.post("/api/v1/auth/login", json={
        "email": "test@test.com",
        "password": "Test123!@#",
    })
    token = response.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}
```

---

## Comandos

```bash
# Rodar servidor de desenvolvimento
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Criar migration
alembic revision --autogenerate -m "add job table"

# Aplicar migrations
alembic upgrade head

# Rodar testes
pytest -v --cov=app tests/

# Lint + format
ruff check . --fix
ruff format .

# Type check
mypy app/

# Rodar Celery worker
celery -A celery_app worker --loglevel=info

# Rodar Celery Flower (monitoramento)
celery -A celery_app flower --port=5555
```

---

## Módulo de IA — Instruções Especiais

O módulo de IA usa o **Strategy Pattern** com múltiplos providers:

```
modules/ai/providers/
├── base.py              # AiProvider (ABC)
├── ollama_provider.py   # Ollama local (grátis)
├── gemini_provider.py   # Google Gemini
├── groq_provider.py     # Groq
├── openrouter_provider.py
├── openai_provider.py
└── factory.py           # get_ai_provider(user_settings)
```

### Regras para IA
- SEMPRE buscar as settings do usuário (provider + api_key) do banco
- API keys devem estar **criptografadas** em repouso (Fernet)
- SEMPRE usar `async` para chamadas de IA (nunca bloquear)
- Tarefas longas (geração de currículo, análise ATS) → **Celery task**
- Rate limit separado para endpoints de IA: 10 req/min
- SEMPRE incluir timeout nas chamadas de IA (30s padrão)
- Prompts ficam em `modules/ai/prompts/` — separados da lógica
- Respostas de IA devem ser parseadas e validadas com Pydantic
