import { KanbanBoard } from "@/components/jobs/kanban-board";
import { Plus } from "lucide-react";

export default function JobsPage() {
  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Minhas Vagas</h1>
          <p className="text-muted-foreground">Gerencie o status de suas aplicações através do Kanban.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg active:scale-95">
          <Plus size={18} /> Nova Vaga
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  );
}
