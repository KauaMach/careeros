# CareerOS Frontend — Instruções para Agentes

## Contexto

Este é o frontend do CareerOS, construído com **Next.js 15 (App Router) + TypeScript**.
O documento-mestre é o [PROJECT.md](../../PROJECT.md) (seções 8, 11, 13).

---

## Stack Frontend

| Tecnologia | Propósito |
|---|---|
| **Next.js 15** | Framework React (App Router, SSR/SSG) |
| **TypeScript** | Type safety |
| **shadcn/ui** | Componentes UI (Radix UI base) |
| **Tailwind CSS v4** | Estilização utility-first |
| **Zustand** | State management (client) |
| **TanStack Query** | Server state + cache |
| **React Hook Form** | Formulários |
| **Zod** | Validação de schemas |
| **dnd-kit** | Drag and drop (Kanban) |
| **Recharts** | Gráficos do Dashboard |
| **Vitest** | Testes unitários |
| **Testing Library** | Testes de componentes |
| **Playwright** | Testes E2E |

---

## Estrutura de Pastas

```
src/
├── app/                      # Next.js App Router (rotas)
│   ├── (auth)/               # Grupo de rotas públicas
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/          # Grupo de rotas protegidas
│   │   ├── layout.tsx        # Layout com sidebar
│   │   ├── page.tsx          # Dashboard
│   │   ├── jobs/
│   │   │   ├── page.tsx      # Lista/Kanban
│   │   │   └── [id]/page.tsx # Detalhes
│   │   ├── resumes/
│   │   ├── companies/
│   │   ├── certificates/
│   │   ├── settings/
│   │   │   └── page.tsx      # Inclui config de IA
│   │   └── ...
│   ├── layout.tsx            # Root layout
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn/ui (não editar manualmente)
│   ├── layout/               # Sidebar, Header, ThemeToggle
│   ├── dashboard/            # KPIs, Heatmap, Charts
│   ├── jobs/                 # JobCard, JobKanban, JobForm
│   ├── resumes/              # ResumeEditor, ResumePreview
│   └── shared/               # Componentes reutilizáveis
├── hooks/                    # Custom hooks
├── lib/                      # Utilitários, API client
├── stores/                   # Zustand stores
├── types/                    # TypeScript types/interfaces
└── styles/                   # Estilos globais extras
```

---

## Padrões de Componentes

### Page (Server Component por padrão)
```tsx
// app/(dashboard)/jobs/page.tsx
import { Metadata } from "next";
import { JobKanban } from "@/components/jobs/job-kanban";
import { JobFilters } from "@/components/jobs/job-filters";

export const metadata: Metadata = {
  title: "Vagas | CareerOS",
  description: "Gerencie suas vagas e candidaturas",
};

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vagas</h1>
        <JobFilters />
      </div>
      <JobKanban />
    </div>
  );
}
```

### Client Component
```tsx
// components/jobs/job-kanban.tsx
"use client";

import { useJobs } from "@/hooks/use-jobs";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { JobColumn } from "./job-column";
import { JOB_STATUSES } from "@/lib/constants";

export function JobKanban() {
  const { jobs, updateStatus, isLoading } = useJobs();

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    updateStatus(active.id as string, over.id as string);
  }

  if (isLoading) return <JobKanbanSkeleton />;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {JOB_STATUSES.map((status) => (
          <JobColumn
            key={status.value}
            status={status}
            jobs={jobs.filter((j) => j.status === status.value)}
          />
        ))}
      </div>
    </DndContext>
  );
}
```

### Custom Hook (TanStack Query)
```tsx
// hooks/use-jobs.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Job, CreateJobRequest } from "@/types/job";

export function useJobs() {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => api.get<Job[]>("/jobs"),
  });

  const { mutate: createJob } = useMutation({
    mutationFn: (data: CreateJobRequest) => api.post<Job>("/jobs", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/jobs/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  return { jobs, isLoading, createJob, updateStatus };
}
```

### API Client
```tsx
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const token = this.getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      // Handle 401 → refresh token logic
      if (response.status === 401) {
        // TODO: implement token refresh
      }
      throw new ApiError(response.status, await response.json());
    }

    const json = await response.json();
    return json.data;
  }

  get<T>(endpoint: string) { return this.request<T>("GET", endpoint); }
  post<T>(endpoint: string, body: unknown) { return this.request<T>("POST", endpoint, body); }
  patch<T>(endpoint: string, body: unknown) { return this.request<T>("PATCH", endpoint, body); }
  delete<T>(endpoint: string) { return this.request<T>("DELETE", endpoint); }
}

export const api = new ApiClient();
```

### Zustand Store
```tsx
// stores/theme-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "careeeros-theme" },
  ),
);
```

---

## Regras Importantes

### SEMPRE
- Usar **Server Components** por padrão (só `"use client"` quando precisa de interatividade)
- Usar `Metadata` export para SEO em cada page
- Usar shadcn/ui components (Button, Card, Dialog, etc.) — não reinventar
- Usar TanStack Query para dados do servidor (nunca `useEffect` + `fetch`)
- Usar Zustand apenas para estado de UI (theme, sidebar open, etc.)
- Usar `loading.tsx` e `error.tsx` para loading/error states
- Usar Zod para validação de formulários (integrado com React Hook Form)
- Skeleton loaders em vez de spinners quando possível
- Responsive: mobile-first, testar em 375px, 768px, 1024px, 1440px
- Acessibilidade: todos os botões com `aria-label`, inputs com `label`

### NUNCA
- Usar `useEffect` para fetch de dados (usar TanStack Query)
- Usar `any` em TypeScript (usar `unknown` e type guard se necessário)
- Importar de caminhos relativos profundos (usar `@/` alias)
- Criar componentes com mais de 150 linhas (extrair subcomponentes)
- Hardcodar strings de UI (preparar para i18n futuro)
- Usar `console.log` em produção
- Fazer chamadas de API diretamente nos componentes (usar hooks)
- Estilizar com CSS inline ou classes arbitrárias — usar Tailwind utilities

---

## Dark Mode

Implementado via `next-themes` + Tailwind:

```tsx
// No root layout
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

Usar classes Tailwind `dark:`:
```tsx
<div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
```

shadcn/ui já suporta dark mode automaticamente.

---

## Design System

### Cores principais (Tailwind)
- **Primary**: zinc (neutro premium)
- **Accent**: emerald (ações positivas), amber (alertas), red (erros)
- **Background**: white / zinc-950
- **Borders**: zinc-200 / zinc-800

### Tipografia
- Font: Inter (Google Fonts)
- Headings: font-bold
- Body: font-normal, text-sm/text-base

### Spacing
- Usar escala Tailwind (4, 6, 8, 12, 16, 24)
- Padding de cards: p-6
- Gap entre cards: gap-4 ou gap-6

### Animações
- Transições suaves: `transition-all duration-200`
- Hover effects em cards e botões
- Skeleton pulsar para loading states
- Micro-animações com Framer Motion (se necessário)

---

## Testes Frontend

### Vitest + Testing Library
```tsx
// components/jobs/__tests__/job-card.test.tsx
import { render, screen } from "@testing-library/react";
import { JobCard } from "../job-card";
import { describe, it, expect } from "vitest";

describe("JobCard", () => {
  it("renders job title and company", () => {
    render(
      <JobCard
        job={{ id: "1", title: "Senior Dev", company: "TechCo", status: "interested" }}
      />,
    );
    expect(screen.getByText("Senior Dev")).toBeInTheDocument();
    expect(screen.getByText("TechCo")).toBeInTheDocument();
  });

  it("shows favorite icon when favorited", () => {
    render(
      <JobCard
        job={{ id: "1", title: "Dev", company: "Co", status: "interested", is_favorite: true }}
      />,
    );
    expect(screen.getByLabelText("Desfavoritar")).toBeInTheDocument();
  });
});
```

### Playwright E2E
```tsx
// e2e/jobs.spec.ts
import { test, expect } from "@playwright/test";

test("should create a new job", async ({ page }) => {
  await page.goto("/jobs");
  await page.click("text=Nova Vaga");
  await page.fill('[name="title"]', "Senior Python Dev");
  await page.fill('[name="salary_min"]', "18000");
  await page.click("text=Salvar");
  await expect(page.locator("text=Senior Python Dev")).toBeVisible();
});
```

---

## Comandos

```bash
# Dev server
npm run dev

# Build
npm run build

# Lint
npm run lint

# Format
npx prettier --write .

# Type check
npx tsc --noEmit

# Testes unitários
npm run test

# Testes E2E
npx playwright test

# Adicionar componente shadcn/ui
npx shadcn@latest add button card dialog
```
