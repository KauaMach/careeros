import { ThemeSwitcher } from "@/components/theme-switcher";
import { ArrowRight, Sparkles, Briefcase, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-background to-background dark:from-blue-900/20" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background dark:from-indigo-900/20" />

      {/* Header */}
      <header className="relative z-10 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
              CO
            </div>
            <span className="text-xl font-bold tracking-tight">CareerOS</span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#about" className="hover:text-foreground transition-colors">Como Funciona</a>
            </nav>
            <ThemeSwitcher />
            <a href="/login" className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-transform hover:scale-105 active:scale-95">
              Entrar
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm animate-fade-in">
          <Sparkles className="mr-2 h-4 w-4" />
          <span className="animate-pulse">A Inteligência Artificial para a sua carreira</span>
        </div>

        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 animate-in slide-in-from-bottom-4 duration-700">
          Gerencie vagas, currículos e <span className="text-primary">conquiste o futuro</span>.
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 animate-in slide-in-from-bottom-6 duration-700 delay-150">
          O CareerOS centraliza suas aplicações, otimiza seus currículos para ATS e acompanha seu progresso nas entrevistas. O sistema operacional definitivo para a sua jornada profissional.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-300">
          <a href="/register" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95">
            Começar
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <a href="#features" className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background/50 backdrop-blur-sm px-8 text-base font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground active:scale-95">
            Ver Recursos
          </a>
        </div>

        {/* Feature Cards Showcase */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4 text-left animate-in fade-in duration-1000 delay-500">
          {/* Card 1 */}
          <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/40 backdrop-blur-xl p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 mb-6">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Gestão de Vagas (Kanban)</h3>
            <p className="text-muted-foreground">Acompanhe cada etapa dos processos seletivos em um quadro visual arrastável e super intuitivo.</p>
          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/40 backdrop-blur-xl p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 mb-6">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Múltiplos Currículos</h3>
            <p className="text-muted-foreground">Crie e adapte seu currículo para cada vaga específica. Gere PDFs com templates otimizados para IA.</p>
          </div>

          {/* Card 3 */}
          <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/40 backdrop-blur-xl p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 mb-6">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Checklists & Métricas</h3>
            <p className="text-muted-foreground">Nunca mais esqueça de responder um e-mail. Tenha estatísticas claras de conversão do seu perfil.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
