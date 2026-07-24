# CareerOS — Instruções para Agentes

## Visão Geral do Projeto

**CareerOS** é uma plataforma web SaaS que funciona como "Sistema Operacional da Carreira".
Centraliza vagas, candidaturas, currículos, certificados, projetos, networking, entrevistas, concursos, estudos e IA.

O documento-mestre de arquitetura é o [PROJECT.md](./PROJECT.md).
Consulte-o SEMPRE antes de tomar decisões arquiteturais.

---

## Arquitetura

- **Frontend**: Next.js 15 (App Router) + TypeScript + shadcn/ui + Tailwind CSS v4
- **Backend**: Python 3.12 + FastAPI + Pydantic v2 + SQLAlchemy 2.0 + Alembic
- **Banco**: PostgreSQL 16
- **Cache/Filas**: Redis + Celery
- **Storage**: MinIO (dev) / S3 (prod)
- **IA**: Multi-provider (Ollama, Gemini, Groq, OpenRouter, OpenAI) — chaves do usuário
- **Testes**: Pytest + httpx (backend), Vitest + Testing Library + Playwright (frontend)
- **Gerenciador Python**: uv
- **Containerização**: Docker + Docker Compose

---

## Princípios Obrigatórios

### Arquitetura
- **Clean Architecture**: Entities → Use Cases → Interface Adapters → Frameworks
- **SOLID**: Cada classe/módulo tem responsabilidade única
- **DDD**: Quando fizer sentido, usar Domain Services, Value Objects, Aggregates
- **Repository Pattern**: Desacoplar acesso a dados do domínio
- **Strategy Pattern**: Exportação de currículo, providers de IA
- **Regra de dependência**: Camadas internas NUNCA dependem das externas

### Código
- **Clean Code**: Nomes descritivos, funções pequenas, sem comentários óbvios
- **Type hints**: SEMPRE em Python (PEP 484/585). SEMPRE em TypeScript
- **Docstrings**: Em todas as funções públicas (Google style em Python)
- **Sem magic numbers**: Usar constantes nomeadas
- **Sem código morto**: Remover imports não usados, variáveis mortas
- **DRY**: Não repetir lógica — extrair para utils/helpers

### Padrões de Nomenclatura
- **Python**: snake_case para variáveis/funções, PascalCase para classes, UPPER_SNAKE para constantes
- **TypeScript**: camelCase para variáveis/funções, PascalCase para componentes/types/interfaces
- **Arquivos Python**: snake_case.py
- **Arquivos React**: kebab-case.tsx para componentes, use-nome.ts para hooks
- **Banco de dados**: snake_case para tabelas e colunas, singular (user, job, resume)

---

## Estrutura do Projeto

```
careeeros/
├── apps/
│   ├── web/          # Frontend Next.js — ver apps/web/AGENTS.md
│   └── api/          # Backend FastAPI — ver apps/api/AGENTS.md
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfile.api
├── .env.example
└── PROJECT.md        # Documento-mestre de arquitetura
```

---

## Convenções de Git

### Branches
- `main` — produção estável
- `develop` — desenvolvimento integrado
- `feature/<modulo>/<descricao>` — novas features (ex: `feature/jobs/kanban-board`)
- `fix/<modulo>/<descricao>` — correções
- `refactor/<descricao>` — refatorações

### Commits (Conventional Commits)
```
feat(jobs): add kanban drag and drop
fix(auth): fix token refresh race condition
refactor(resumes): extract exporter strategy
test(ats): add unit tests for score calculation
docs(api): update OpenAPI descriptions
chore(docker): update compose volumes
```

### Pull Requests
- Sempre com descrição do que muda e por quê
- Referenciar issue/etapa do PROJECT.md
- Mínimo de testes para a feature
- CI verde antes de merge

---

## Padrão de Resposta da API

Toda resposta segue o envelope pattern:

```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "per_page": 20, "total": 150 },
  "errors": null
}
```

Erros:
```json
{
  "success": false,
  "data": null,
  "errors": [{ "code": "VALIDATION_ERROR", "message": "...", "field": "title" }]
}
```

---

## Fluxo de Desenvolvimento

1. Cada módulo segue as **etapas definidas no PROJECT.md** (seção 14)
2. **Sempre criar testes** junto com a feature
3. **Sempre rodar lint** antes de commitar:
   - Backend: `ruff check . && ruff format .`
   - Frontend: `npm run lint && npm run format`
4. **Sempre verificar tipos**:
   - Backend: `mypy app/`
   - Frontend: `npx tsc --noEmit`
5. Ao finalizar uma etapa, **parar e aguardar aprovação**

---

## Variáveis de Ambiente

Sempre definir em `.env.example` com valores placeholder. Nunca commitar `.env`.

Variáveis obrigatórias:
```env
# Database
DATABASE_URL=postgresql+asyncpg://careeeros:careeeros@localhost:5432/careeeros

# Redis
REDIS_URL=redis://localhost:6379/0

# Auth
JWT_SECRET_KEY=change-me-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# Storage
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=careeeros

# AI (user configures in Settings UI, stored encrypted in DB)
# These are fallback/default values only
AI_PROVIDER=ollama
AI_MODEL=llama3.1:8b
OLLAMA_BASE_URL=http://localhost:11434
```

---

## Segurança

- Senhas: bcrypt via passlib (work factor ≥ 12)
- JWT: python-jose, tokens com expiração
- API keys de IA: armazenadas **criptografadas** no banco (Fernet)
- CORS: apenas domínios permitidos
- Rate limiting: 100 req/min auth, 10 req/min IA
- Inputs: SEMPRE validar com Pydantic antes de processar
- SQL: NUNCA concatenar strings — usar SQLAlchemy ORM/queries parametrizadas
- Uploads: validar tipo MIME, tamanho máximo, sanitizar nome do arquivo


# 🤖 Procedimentos Operacionais Padrão (SOPs) para IAs

> Este arquivo dita como agentes de IA devem criar e modificar o código neste projeto.

## 1. Stack Base
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Zustand, Axios/Fetch customizado.
- **Backend:** FastAPI, Python 3.12, SQLAlchemy 2.0 (Async), PostgreSQL, Alembic.
- **Design System:** Baseado em shadcn/ui e Lucide React. (Usamos `divs` e `Tailwind` para estilizar).

## 2. Como criar um novo Módulo no Backend (FastAPI)
Sempre que for solicitado a criação de um novo módulo (ex: `projects`), siga esta estrutura estrita:
1. Crie a pasta em `apps/api/app/modules/<nome>/`.
2. Crie `models.py` (Herdando de `app.database.Base` e usando `UUID` para IDs).
3. Crie `schemas.py` (Pydantic V2).
4. Crie `repository.py` (Uso de `AsyncSession` e `select`).
5. Crie `service.py` (Regras de negócio, lançando `AppException`).
6. Crie `deps.py` (Injeção de dependências do repositório e serviço com `get_session`).
7. Crie `router.py` (Rotas REST retornando o modelo `ApiResponse`).
8. Registre as rotas no `apps/api/app/main.py`.
9. Registre os models no `apps/api/migrations/env.py`.
10. Rode a migração autogerada: `uv run alembic revision --autogenerate -m "..."` e `uv run alembic upgrade head`.

## 3. Como criar novas Telas no Frontend (Next.js)
1. Crie os types e a conexão no arquivo de service: `apps/web/src/services/<nome>.ts`. Lembre-se de importar `api` de `@/lib/api` e de **Sempre** usar `.json()` nas respostas e retornar o objeto `.data`.
2. Crie a interface em `apps/web/src/app/(dashboard)/<rota>/page.tsx`.
3. Use componentes do Lucide React para ícones.
4. Use os componentes `Card`, `Button`, `Input` que já estão na pasta `@/components/ui/`.
5. Se for uma nova página do dashboard, adicione o link no `layout.tsx` do dashboard.

## 4. Subagentes
Se a tarefa for gigantesca (ex: reescrever todo o CSS ou pesquisar referências externas), você é encorajado a usar subagentes (`research` ou `self`) para trabalhar de forma assíncrona.
