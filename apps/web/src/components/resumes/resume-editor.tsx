"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Sparkles, Loader2, Plus, Trash2, Download } from "lucide-react";
import { api } from "@/lib/api";

export function ResumeEditor({ initialData = {}, onSave }: { initialData?: any, onSave: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [enhancingId, setEnhancingId] = useState<string | null>(null);
  const [title, setTitle] = useState(initialData.title || "");
  const [experiences, setExperiences] = useState<any[]>(initialData.content?.experiences || []);

  const handleSave = async () => {
    setLoading(true);
    await onSave({
      title,
      is_master: initialData.is_master || false,
      content: {
        experiences,
      }
    });
    setLoading(false);
  };

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now().toString(), company: "", role: "", description: "" }]);
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const enhanceWithAI = async (id: string) => {
    const exp = experiences.find(e => e.id === id);
    if (!exp || !exp.description) return;
    
    setEnhancingId(id);
    try {
      const res = await api.post("/resumes/enhance", {
        text: exp.description,
        role: exp.role,
        company: exp.company
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.improved_text) {
          updateExperience(id, "description", json.data.improved_text);
        }
      } else {
        alert("Erro ao conectar com a IA.");
      }
    } catch (err) {
      alert("Falha ao se comunicar com a inteligência artificial.");
    } finally {
      setEnhancingId(null);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="flex gap-6 h-full w-full">
      {/* Estilos para impressão */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Editor Sidebar */}
      <div className="w-1/2 flex flex-col gap-6 overflow-y-auto pr-2 pb-24 no-print">
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Informações Básicas</h2>
          <div className="space-y-4">
            <div>
              <Label>Nome do Currículo</Label>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Desenvolvedor Front-end Pleno"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Experiência Profissional</h2>
            <Button variant="outline" size="sm" onClick={addExperience} className="gap-2">
              <Plus size={16} /> Adicionar
            </Button>
          </div>
          
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="p-4 border border-border rounded-lg relative bg-background/50 focus-within:ring-2 ring-primary/20 transition-all">
                <button 
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                  title="Remover Experiência"
                >
                  <Trash2 size={16} />
                </button>
                <div className="space-y-4 pr-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Empresa</Label>
                      <Input 
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        placeholder="Ex: Google"
                      />
                    </div>
                    <div>
                      <Label>Cargo</Label>
                      <Input 
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                        placeholder="Ex: Desenvolvedor Senior"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="flex justify-between items-center mb-1">
                      Descrição
                      <button 
                        onClick={() => enhanceWithAI(exp.id)}
                        disabled={enhancingId === exp.id || !exp.description.trim()}
                        className="text-xs font-semibold text-blue-500 flex items-center gap-1 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-blue-500/10 px-2 py-1 rounded-md"
                      >
                        {enhancingId === exp.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Sparkles size={12} />
                        )}
                        Melhorar com IA
                      </button>
                    </Label>
                    <Textarea 
                      rows={6}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      placeholder="Descreva suas conquistas e responsabilidades (A IA vai ajudar a melhorar!)"
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            {experiences.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg text-muted-foreground">
                <p className="text-sm">Nenhuma experiência adicionada.</p>
                <Button variant="link" onClick={addExperience}>Adicionar primeira experiência</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Pane */}
      <div className="w-1/2 bg-white rounded-xl shadow-lg border border-border/50 p-8 overflow-y-auto">
        <div id="resume-preview" className="max-w-[21cm] mx-auto min-h-[29.7cm] text-black">
          <header className="border-b-2 border-gray-300 pb-4 mb-6">
            <h1 className="text-3xl font-bold uppercase tracking-wider">{title || "Seu Cargo Aqui"}</h1>
          </header>
          
          {experiences.length > 0 ? (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 mb-4 flex items-center gap-2">
                <BriefcaseIcon />
                Experiência Profissional
              </h2>
              <div className="space-y-6">
                {experiences.map(exp => (
                  <div key={exp.id} className="relative">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{exp.role || "Cargo"}</h3>
                    </div>
                    <div className="text-primary font-medium text-sm mb-2">{exp.company || "Nome da Empresa"}</div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{exp.description || "Sua descrição aparecerá aqui..."}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : (
             <div className="flex items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg no-print">
               Preencha os dados ao lado para visualizar seu currículo.
             </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border p-2 rounded-full shadow-2xl flex items-center gap-2 no-print z-50">
        <Button onClick={handleExportPDF} variant="secondary" className="rounded-full px-6 gap-2 border border-border">
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
        <Button onClick={handleSave} disabled={loading} className="rounded-full px-8 gap-2 shadow-md">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}

function BriefcaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}
