"use client";

import { useState, useEffect } from "react";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export type JobStatus = "BACKLOG" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export interface JobCard {
  id: string;
  title: string;
  company: string;
  status: JobStatus;
}

const columns: { id: JobStatus; title: string; color: string }[] = [
  { id: "BACKLOG", title: "Salvas", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  { id: "APPLIED", title: "Aplicadas", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { id: "INTERVIEW", title: "Entrevista", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: "OFFER", title: "Proposta", color: "bg-green-500/10 text-green-600 dark:text-green-400" },
  { id: "REJECTED", title: "Rejeitado", color: "bg-red-500/10 text-red-600 dark:text-red-400" },
];

interface KanbanBoardProps {
  refreshTrigger?: number;
}

export function KanbanBoard({ refreshTrigger = 0 }: KanbanBoardProps) {
  const [cards, setCards] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await api.get("/jobs");
        if (res.ok) {
          const json = await res.json();
          setCards(json.data || []);
        }
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [refreshTrigger]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  async function handleDragOver(event: any) {
    const { active, over } = event;
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === activeId);
        const overIndex = cards.findIndex((t) => t.id === overId);
        
        if (cards[activeIndex].status !== cards[overIndex].status) {
          cards[activeIndex].status = cards[overIndex].status;
        }
        return arrayMove(cards, activeIndex, overIndex);
      });
    }

    if (isActiveTask && isOverColumn) {
      setCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === activeId);
        cards[activeIndex].status = overId as JobStatus;
        return arrayMove(cards, activeIndex, activeIndex);
      });
    }
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;
    
    // Save to backend
    const card = cards.find(c => c.id === active.id);
    if (card) {
      try {
        await api.patch(`/jobs/${card.id}`, { status: card.status });
      } catch (err) {
        console.error("Failed to update status", err);
      }
    }
  }

  const activeCard = cards.find((c) => c.id === activeId);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart} 
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full overflow-x-auto pb-4 pt-2 px-1">
        {columns.map((col) => (
          <KanbanColumn 
            key={col.id} 
            column={col} 
            cards={cards.filter((c) => c.status === col.id)} 
          />
        ))}
      </div>

      <DragOverlay>
        {activeCard ? <KanbanCard card={activeCard} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
