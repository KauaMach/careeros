"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, FileText, Loader2, Edit3, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResumes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/resumes");
      if (res.ok) {
        const json = await res.json();
        setResumes(json.data || []);
      }
    } catch (err) {
      setError("Falha ao carregar currículos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este currículo?")) return;
    
    try {
      await api.delete(`/resumes/${id}`);
      loadResumes();
    } catch (err) {
      alert("Erro ao excluir currículo.");
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Meus Currículos</h1>
          <p className="text-muted-foreground">Gerencie seus currículos e versões otimizadas.</p>
        </div>
        <Link 
          href="/resumes/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg active:scale-95"
        >
          <Plus size={18} /> Novo Currículo
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>
      ) : resumes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-card border border-border border-dashed rounded-xl p-8">
          <FileText size={48} className="mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhum currículo encontrado</h3>
          <p className="text-sm text-center max-w-md mb-6">Você ainda não criou nenhum currículo. Crie seu currículo Master para começar a gerar versões otimizadas.</p>
          <Link 
            href="/resumes/new"
            className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/20 transition-colors"
          >
            Criar meu primeiro currículo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div key={resume.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                  <FileText size={24} />
                </div>
                {resume.is_master && (
                  <span className="bg-amber-500/10 text-amber-600 text-xs font-semibold px-2 py-1 rounded-full">
                    Master
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold mb-1 truncate">{resume.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
              
              <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
                <Link 
                  href={`/resumes/${resume.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-2 rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium"
                >
                  <Edit3 size={16} /> Editar
                </Link>
                <button 
                  onClick={() => handleDelete(resume.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
