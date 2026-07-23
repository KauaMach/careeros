"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { JobStatus } from "./kanban-board";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function JobModal({ isOpen, onClose, onSuccess }: JobModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<JobStatus>("BACKLOG");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/jobs", {
        title,
        company,
        status,
      });

      if (!res.ok) {
        throw new Error("Erro ao criar vaga");
      }

      onSuccess();
      setTitle("");
      setCompany("");
      setStatus("BACKLOG");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border shadow-lg rounded-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">Nova Vaga</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-sm text-destructive">{error}</div>}
          
          <div className="space-y-2">
            <Label htmlFor="title">Cargo / Posição</Label>
            <Input
              id="title"
              placeholder="Ex: Senior Frontend Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              placeholder="Ex: Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status Inicial</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as JobStatus)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="BACKLOG">Salvas</option>
              <option value="APPLIED">Aplicadas</option>
              <option value="INTERVIEW">Entrevista</option>
              <option value="OFFER">Proposta</option>
              <option value="REJECTED">Rejeitado</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
