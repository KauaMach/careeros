"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { JobCard } from "./kanban-board";
import { KanbanCard } from "./kanban-card";

interface ColumnProps {
  column: { id: string; title: string; color: string };
  cards: JobCard[];
}

export function KanbanColumn({ column, cards }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: "Column", column },
  });

  return (
    <div className="flex flex-col flex-shrink-0 w-80 bg-card/60 border border-border/50 rounded-2xl overflow-hidden shadow-sm backdrop-blur-md">
      <div className="p-4 border-b border-border/40 flex items-center justify-between bg-card/40">
        <div className="flex items-center gap-3">
          <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${column.color}`}>
            {column.title}
          </div>
          <span className="text-muted-foreground text-xs font-semibold bg-muted px-2 py-0.5 rounded-md">{cards.length}</span>
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 min-h-[150px]"
      >
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
