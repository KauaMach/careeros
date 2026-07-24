"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ResumeEditor } from "@/components/resumes/resume-editor";
import { api } from "@/lib/api";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditResumePage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    
    async function fetchResume() {
      try {
        const res = await api.get(`/resumes/${params.id}`);
        if (res.ok) {
          const json = await res.json();
          setResume(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, [params.id, isNew]);

  const handleSave = async (data: any) => {
    try {
      if (isNew) {
        const res = await api.post("/resumes", data);
        if (res.ok) {
          const json = await res.json();
          router.push(`/resumes/${json.data.id}`);
        }
      } else {
        await api.patch(`/resumes/${params.id}`, data);
      }
    } catch (err) {
      alert("Erro ao salvar currículo.");
    }
  };

  return (
    <div className="p-8 h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <Link href="/resumes" className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            {isNew ? "Criar Novo Currículo" : "Editar Currículo"}
          </h1>
          <p className="text-muted-foreground">
            {isNew ? "Preencha os campos abaixo para iniciar." : "Faça ajustes dinâmicos ou utilize IA para melhorar."}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ResumeEditor initialData={resume || {}} onSave={handleSave} />
        )}
      </div>
    </div>
  );
}
