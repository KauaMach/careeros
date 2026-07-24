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
