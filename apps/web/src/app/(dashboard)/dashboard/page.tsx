"use client";

import Link from "next/link";
import { Briefcase, FileText, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [userName, setUserName] = useState("Carregando...");
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.name) {
            setUserName(json.data.name.split(" ")[0]); // Pega o primeiro nome
          }
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    }
    if (token) fetchUser();
  }, [token]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Olá, {userName} 👋</h1>
        <p className="text-muted-foreground text-lg">
          Bem-vindo à sua Central de Carreira. O que vamos conquistar hoje?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Card Vagas */}
        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
            <Briefcase size={24} />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Painel de Vagas</h2>
          <p className="text-muted-foreground mb-8">
            Gerencie suas aplicações em um Kanban interativo. Arraste e solte vagas nas etapas de recrutamento.
          </p>
          <Link 
            href="/jobs" 
            className="inline-flex items-center text-primary font-medium group-hover:underline"
          >
            Ir para Vagas <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Card Currículos */}
        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="h-12 w-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-6">
            <FileText size={24} />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Meus Currículos</h2>
          <p className="text-muted-foreground mb-8">
            Crie currículos direcionados com a ajuda de Inteligência Artificial para aumentar suas chances.
          </p>
          <Link 
            href="/resumes" 
            className="inline-flex items-center text-blue-500 font-medium group-hover:underline"
          >
            Ir para Currículos <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
