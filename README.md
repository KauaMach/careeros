# 🚀 CareerOS — Central de Carreira

O **CareerOS** é o sistema operacional definitivo para a gestão da sua carreira. Muito mais do que um simples organizador de vagas, é uma plataforma inteligente e centralizada projetada para profissionais que desejam assumir o controle do seu desenvolvimento.

## 🎯 Principais Funcionalidades

- **Gestão de Vagas (Kanban):** Acompanhe suas candidaturas de ponta a ponta com um painel Kanban intuitivo.
- **Análise com IA (ATS Score):** Valide seu currículo contra descrições de vagas utilizando múltiplos motores de Inteligência Artificial.
- **Gestão de Currículos:** Crie e versione currículos focados para diferentes áreas (ex: Cloud, Backend, Data).
- **Módulo de Estudos & Concursos:** Planeje cronogramas de estudo, editais e acompanhe seu tempo com a técnica Pomodoro.
- **Networking & Certificados:** Centralize seus contatos estratégicos e mantenha o controle de validade dos seus certificados.

## 🛠 Stack Tecnológica

Este projeto utiliza uma arquitetura de monorepo dividida entre Frontend e Backend:

- **Frontend (`apps/web`):** [Next.js](https://nextjs.org/) (React), TailwindCSS, TypeScript e dark mode nativo.
- **Backend (`apps/api`):** [FastAPI](https://fastapi.tiangolo.com/) (Python), SQLAlchemy, Alembic (para migrações), Autenticação JWT.
- **Banco de Dados:** PostgreSQL (gerenciado localmente via Docker).
- **Infraestrutura Local:** Docker e Docker Compose para facilitar a execução de todos os serviços simultaneamente.

## 📂 Estrutura do Projeto

```
careeros/
├── apps/
│   ├── api/          # Backend em FastAPI (Python)
│   └── web/          # Frontend em Next.js (React)
├── docker-compose.yml
├── PROJECT.md        # Documento master de arquitetura e roadmap
└── README.md
```

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js (v18+)
- Python (3.10+) e `uv` (gerenciador de dependências)
- Docker e Docker Compose instalados

### 1. Inicializando o Banco de Dados (PostgreSQL)

Na raiz do projeto, suba o container do banco de dados:

```bash
docker compose up -d
```

### 2. Rodando o Backend (FastAPI)

Navegue até a pasta da API, instale as dependências e inicie o servidor:

```bash
cd apps/api
# Instale as dependências usando uv
uv sync
# Rode as migrações do banco de dados
uv run alembic upgrade head
# Inicie o servidor FastAPI (normalmente porta 8000)
uv run fastapi dev app/main.py
```

### 3. Rodando o Frontend (Next.js)

Em um novo terminal, navegue até a pasta da aplicação web, instale as dependências e inicie:

```bash
cd apps/web
npm install
npm run dev
```

Acesse o sistema no navegador através de `http://localhost:3000`.

---
*Projeto em desenvolvimento ativo. Consulte o `PROJECT.md` para o roadmap completo e as próximas entregas.*
