"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { JobCard } from "./kanban-board";
import { Building2, MoreHorizontal } from "lucide-react";

interface KanbanCardProps {
  card: JobCard;
  isOverlay?: boolean;
}

export function KanbanCard({ card, isOverlay }: KanbanCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: "Task", card },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="h-[90px] rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 opacity-50" 
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm hover:border-primary/30 transition-colors cursor-grab active:cursor-grabbing group ${isOverlay ? 'rotate-3 shadow-2xl scale-105 ring-2 ring-primary' : ''}`}
    >
      <div className="flex items-start justify-between">
        <h4 className="font-semibold text-sm leading-tight line-clamp-2 pr-4">{card.title}</h4>
        <button className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground absolute right-3 top-3" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <Building2 size={14} />
        <span>{card.company}</span>
      </div>
    </div>
  );
}
