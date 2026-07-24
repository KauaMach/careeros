"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Sparkles, Loader2, Plus, Trash2 } from "lucide-react";

export function ResumeEditor({ initialData = {}, onSave }: { initialData?: any, onSave: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialData.title || "");
  const [experiences, setExperiences] = useState<any[]>(initialData.content?.experiences || []);

  const handleSave = async () => {
    setLoading(true);
    await onSave({
      title,
      is_master: initialData.is_master || false,
      content: {
        experiences,
        // we can add education, skills, etc. here later
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

  return (
    <div className="flex gap-6 h-full w-full">
      {/* Editor Sidebar */}
      <div className="w-1/2 flex flex-col gap-6 overflow-y-auto pr-2 pb-10">
        
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
              <div key={exp.id} className="p-4 border border-border rounded-lg relative bg-background/50">
                <button 
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
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
                    <Label className="flex justify-between">
                      Descrição
                      <button className="text-xs text-primary flex items-center gap-1 hover:underline">
                        <Sparkles size={12} /> Melhorar com IA
                      </button>
                    </Label>
                    <Textarea 
                      rows={4}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      placeholder="Descreva suas conquistas e responsabilidades..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
            {experiences.length === 0 && (
              <p className="text-center text-muted-foreground py-4 text-sm">
                Nenhuma experiência adicionada.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Preview Pane */}
      <div className="w-1/2 bg-white rounded-xl shadow-lg border border-border/50 p-8 overflow-y-auto">
        <div className="max-w-[21cm] mx-auto min-h-[29.7cm] text-black">
          <header className="border-b-2 border-gray-300 pb-4 mb-6">
            <h1 className="text-3xl font-bold uppercase tracking-wider">{title || "Seu Cargo Aqui"}</h1>
          </header>
          
          {experiences.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 mb-3">Experiência Profissional</h2>
              <div className="space-y-4">
                {experiences.map((exp: any) => (
                  <div key={exp.id}>
                    <h3 className="font-bold text-gray-900">{exp.role || "Cargo"}</h3>
                    <div className="text-gray-600 text-sm font-medium mb-1">{exp.company || "Nome da Empresa"}</div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{exp.description || "Descrição da experiência..."}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border p-2 rounded-full shadow-xl flex items-center gap-2">
        <Button onClick={handleSave} disabled={loading} className="rounded-full px-6 gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
