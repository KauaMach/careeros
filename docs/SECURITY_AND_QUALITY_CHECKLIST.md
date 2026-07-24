# Security and Quality Checklist - CareerOS

Este documento serve como guia oficial de segurança, qualidade e conformidade do projeto **Central de Carreira (CareerOS)**. Ele foi elaborado com base nos padrões da indústria (OWASP, NIST, ISO 27001, CIS Benchmarks).

---

## 1. Segurança da Aplicação

### Proteção contra SQL Injection
**Status:** ✅ Implementado
**Descrição:** O uso de queries parametrizadas e ORMs previne a injeção de código SQL malicioso.
**Risco:** Vazamento, alteração ou deleção de dados críticos do banco de dados.
**Como implementar:** O projeto já utiliza o `SQLAlchemy 2.0` com tipagem forte e sessions assíncronas, evitando qualquer concatenação manual de strings.
**Prioridade:** Crítica
**Complexidade:** Baixa (já implementado)

### Proteção contra XSS (Cross-Site Scripting)
**Status:** ✅ Implementado
**Descrição:** Evita que scripts maliciosos sejam executados no navegador dos usuários.
**Risco:** Roubo de sessão, ações não autorizadas em nome do usuário.
**Como implementar:** O Next.js (React) já faz o escape automático de todo o conteúdo renderizado. Manter a regra de NUNCA utilizar `dangerouslySetInnerHTML`.
**Prioridade:** Crítica
**Complexidade:** Baixa (já implementado)

### Autenticação e Hashing de Senhas
**Status:** ✅ Implementado
**Descrição:** Garantir que as senhas não sejam armazenadas em texto plano e usar algoritmos fortes.
**Risco:** Exposição de credenciais em caso de vazamento do banco de dados.
**Como implementar:** O sistema utiliza `bcrypt` com *work factor* seguro no backend para todas as senhas.
**Prioridade:** Crítica
**Complexidade:** Baixa (já implementado)

### Gestão de Sessão (JWT)
**Status:** ⚠️ Parcial
**Descrição:** Uso de tokens para gerenciar a sessão do usuário de forma stateless.
**Risco:** Tokens não expirados ou roubados podem dar acesso permanente a invasores.
**Como implementar:** O JWT já está implementado (expiração de 30 minutos para Access Token). Falta implementar a rotação/invalidação (Blacklist) no Redis e o fluxo de Refresh Token seguro (HttpOnly cookies).
**Prioridade:** Alta
**Complexidade:** Média

### CORS (Cross-Origin Resource Sharing)
**Status:** ⚠️ Parcial
**Descrição:** Restringe quais domínios externos podem fazer requisições para a API.
**Risco:** Sites maliciosos podem fazer requisições em nome do usuário logado se o CORS estiver mal configurado.
**Como implementar:** Atualmente o `main.py` permite `allow_origins=["*"]`. Em produção, deve ser alterado para a URL exata do frontend (ex: `https://app.careeros.com`).
**Prioridade:** Alta
**Complexidade:** Baixa

### Rate Limiting
**Status:** ❌ Ausente
**Descrição:** Limitar a quantidade de requisições que um IP ou usuário pode fazer por segundo.
**Risco:** Ataques de força bruta (ex: `/login`), DDoS na camada de aplicação e esgotamento de recursos (ex: IA limits).
**Como implementar:** Utilizar `slowapi` ou um middleware de Rate Limit no FastAPI conectado ao Redis.
**Prioridade:** Alta
**Complexidade:** Média

---

## 2. Segurança da Infraestrutura

### HTTPS Obrigatório e HSTS
**Status:** ❌ Ausente
**Descrição:** Todo tráfego deve ser criptografado em trânsito.
**Risco:** Interceptação de dados sensíveis (Man-in-the-Middle), como senhas e tokens JWT.
**Como implementar:** Configurar os certificados SSL (Let's Encrypt) no Reverse Proxy (Caddy, Nginx ou Traefik) e forçar cabeçalho HSTS.
**Prioridade:** Crítica
**Complexidade:** Baixa

### Secrets Hardcoded e Variáveis de Ambiente
**Status:** ✅ Implementado
**Descrição:** Senhas e chaves não devem residir no código fonte.
**Risco:** Acesso não autorizado caso o repositório seja vazado.
**Como implementar:** Todas as senhas (banco, JWT secret, minio) foram extraídas para o arquivo `.env` gerido pelo `pydantic-settings`.
**Prioridade:** Crítica
**Complexidade:** Baixa (já implementado)

---

## 3. Qualidade de Código

### Clean Architecture & SOLID
**Status:** ✅ Implementado
**Descrição:** O código deve estar desacoplado e focado em responsabilidade única.
**Risco:** Dificuldade extrema de manutenção, acoplamento profundo entre banco de dados e rotas.
**Como implementar:** O projeto já está modularizado (ex: `apps/api/app/modules/jobs`), separando `models`, `schemas`, `repository`, `service` e `router`.
**Prioridade:** Alta
**Complexidade:** Alta (já implementado)

### Padronização de Código (Linters e Formatadores)
**Status:** ⚠️ Parcial
**Descrição:** O código deve manter um único padrão visual e de qualidade para toda a equipe.
**Risco:** Dificuldade de leitura, "code smells" e pequenos bugs sintáticos.
**Como implementar:** Configurar `ruff` (Backend) e `eslint/prettier` (Frontend) no pré-commit (`husky`).
**Prioridade:** Média
**Complexidade:** Baixa

---

## 4. Testes

### Testes Unitários e Integração
**Status:** ❌ Ausente
**Descrição:** Cobertura de testes automatizados para regras de negócios e rotas da API.
**Risco:** Inserção de regressões e bugs a cada nova feature.
**Como implementar:** Criar pasta `tests/` no backend usando `pytest` e `httpx`. No frontend, adicionar `Vitest` e `React Testing Library`.
**Prioridade:** Crítica
**Complexidade:** Alta

---

## 5. DevOps / DevSecOps

### CI/CD e Quality Gates
**Status:** ❌ Ausente
**Descrição:** Pipelines automatizados que rodam testes e bloqueiam merges ruins.
**Risco:** Código quebrado ou vulnerável chegar em produção.
**Como implementar:** Criar `.github/workflows/main.yml` com steps para rodar Lint, Pytest, e Dependency Scanning (`Trivy` ou `Dependabot`).
**Prioridade:** Alta
**Complexidade:** Média

---

## 6. Banco de Dados

### Migrações Versionadas e Integridade
**Status:** ✅ Implementado
**Descrição:** Todas as mudanças estruturais do banco devem ser versionadas em código.
**Risco:** Inconsistência entre esquema de banco em Produção e Dev.
**Como implementar:** Já configurado utilizando `Alembic` e `ForeignKeys` no PostgreSQL.
**Prioridade:** Crítica
**Complexidade:** Baixa (já implementado)

### Dados Sensíveis Criptografados (IA Keys)
**Status:** ❌ Ausente
**Descrição:** Chaves de IA do usuário salvas no banco devem estar criptografadas.
**Risco:** Se o DB for vazado, chaves do Google/OpenAI do usuário serão expostas, gerando custo financeiro a eles.
**Como implementar:** Utilizar `Fernet` (cryptography) no repositório antes de salvar e após ler do DB.
**Prioridade:** Crítica
**Complexidade:** Média

---

## 7. Performance

### Paginação e Índices
**Status:** ⚠️ Parcial
**Descrição:** Queries de listagem devem ser limitadas e indexadas.
**Risco:** O sistema ficará extremamente lento e derrubará o banco de dados quando tiver muitos usuários.
**Como implementar:** Adicionar paginação (Offset/Limit ou Cursor) nos repositories (`list_all`) e criar `index=True` nos models do SQLAlchemy (ex: `user_id`).
**Prioridade:** Alta
**Complexidade:** Baixa

---

## Tabela Resumo

| Categoria | Implementado | Parcial | Ausente | Prioridade |
|-----------|--------------|----------|----------|------------|
| Proteção SQLi / XSS | ✅ | | | Crítica |
| Hashing de Senhas | ✅ | | | Crítica |
| Variáveis de Ambiente | ✅ | | | Crítica |
| Clean Architecture | ✅ | | | Alta |
| Migrações do DB | ✅ | | | Crítica |
| Sessão (JWT & Rotação) | | ⚠️ | | Alta |
| CORS | | ⚠️ | | Alta |
| Paginação e Índices | | ⚠️ | | Alta |
| Linters & Formatação | | ⚠️ | | Média |
| Rate Limiting | | | ❌ | Alta |
| HTTPS / HSTS | | | ❌ | Crítica |
| Testes Automatizados | | | ❌ | Crítica |
| CI/CD & Scan | | | ❌ | Alta |
| Criptografia no DB (Keys)| | | ❌ | Crítica |

---

## Plano de Ação (Roadmap de Qualidade)

### 1. Correções críticas imediatas
- [ ] Implementar criptografia reversível (Fernet) para as chaves de API do usuário (`GEMINI_API_KEY`).
- [ ] Ajustar as políticas de CORS para produção.
- [ ] Configurar HTTPS no servidor de deploy.

### 2. Correções de alta prioridade
- [ ] Implementar Refresh Tokens em cookies HttpOnly (segurança JWT).
- [ ] Criar CI/CD no GitHub Actions para garantir que o projeto não quebre.
- [ ] Implementar Rate Limiting nas rotas críticas (Login, Geração via IA).

### 3. Melhorias de testes
- [ ] Configurar `pytest` no Backend.
- [ ] Escrever testes unitários para a classe `AuthService` e geração de IA.
- [ ] Configurar `Vitest` no Frontend.

### 4. Melhorias arquiteturais e performance
- [ ] Adicionar parâmetros `skip` e `limit` em todas as rotas de `GET` (Paginação).
- [ ] Confirmar índices nos campos `user_id` em todas as tabelas filhas.

### 5. Melhorias de qualidade e documentação
- [ ] Configurar Husky + Lint-staged (Ruff/Prettier).
- [ ] Adicionar Swagger UI em produção com proteção (ou desativar).
- [ ] Criar documentação técnica final (`CONTRIBUTING.md`).
