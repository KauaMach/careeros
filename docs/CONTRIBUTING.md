# Guia de Contribuição - Central de Carreira (CareerOS)

Bem-vindo ao repositório do **CareerOS**! Este projeto é desenvolvido com as melhores práticas da indústria (Padrão Enterprise) e possui políticas estritas de segurança, qualidade e formatação de código.

## 🏗️ Arquitetura do Projeto
O projeto utiliza um Monorepo:
- `apps/api`: Backend FastAPI, SQLAlchemy, Alembic (PostgreSQL).
- `apps/web`: Frontend Next.js (React), Tailwind CSS, Zustand.
- `docker/`: Configurações de infraestrutura (Caddy, PostgreSQL, Redis, MinIO).

## 🚀 Como Executar o Projeto Localmente

1. **Dependências**:
   - Docker e Docker Compose
   - Node.js (v20+)
   - uv (Python Package Manager)

2. **Infraestrutura**:
   ```bash
   docker compose up -d db redis minio
   ```

3. **Backend**:
   ```bash
   cd apps/api
   cp .env.example .env # Configure suas chaves
   uv sync
   uv run alembic upgrade head
   uv run fastapi dev app/main.py
   ```

4. **Frontend**:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

## 🛡️ Padrões de Código e Qualidade
O repositório é guardado por um fluxo rigoroso automatizado por `Husky` e `lint-staged`.

### Backend (Python)
- **Ferramenta**: Ruff (Linter e Formatter) e Pytest (Testes Unitários).
- Antes de commitar, execute:
  ```bash
  uv run ruff check --fix
  uv run ruff format
  uv run pytest
  ```

### Frontend (TypeScript)
- **Ferramenta**: Prettier, ESLint e Vitest.
- Antes de commitar, execute:
  ```bash
  npm run lint
  npx prettier --write .
  npm run test
  ```

## 📜 Convenção de Commits
Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `sec:` Correções de segurança e conformidade
- `test:` Adição ou correção de testes
- `chore:` Tarefas de build, infraestrutura, documentação, etc.

*O repositório está configurado para formatar e testar automaticamente (via Git Hooks) os arquivos que você modificou antes de aceitar o commit.*
