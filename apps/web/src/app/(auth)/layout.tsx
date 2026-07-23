import { ReactNode } from "react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Briefcase } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            CO
          </div>
          CareerOS
        </div>
        <div className="space-y-6 max-w-md">
          <h1 className="text-4xl font-bold tracking-tight">
            Assuma o controle da sua carreira.
          </h1>
          <p className="text-zinc-400 text-lg">
            A plataforma definitiva para gerenciar suas vagas, currículos, networking e estudos em um só lugar.
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Briefcase size={16} /> Centralize vagas
            </div>
            <span>&bull;</span>
            <div>Analise com IA</div>
            <span>&bull;</span>
            <div>Voe alto</div>
          </div>
        </div>
        <div className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} CareerOS. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="p-6 flex justify-end">
          <ThemeSwitcher />
        </div>
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 md:px-24 max-w-2xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
