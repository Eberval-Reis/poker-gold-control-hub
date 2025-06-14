
import { Pencil, Trash2, Check, X, Calendar as CalendarIcon, CircleDollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { ScheduleEvent } from "@/hooks/useScheduleEvents";
import { twMerge } from "tailwind-merge";

interface EventCardProps {
  event: ScheduleEvent;
  onEdit: (event: ScheduleEvent) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (event: ScheduleEvent) => void;
  onChangeReason?: (id: string, reason: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onToggleStatus,
  onChangeReason,
}) => {
  const isDone = event.status === "done";
  const isNotDone = event.status === "not_done";

  return (
    <div className="bg-card rounded-lg shadow-poker p-4 flex flex-col gap-2 relative animate-fade-in border border-poker-gold/10">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <CircleDollarSign className="text-green-500" />
          <span className="text-lg font-bold text-poker-gold">{event.tournamentName}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(event)}
            className="text-blue-500 hover:text-blue-400 p-1 rounded transition-all"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="text-red-500 hover:text-red-400 p-1 rounded transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-foreground">
        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
        <span>
          {event.date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1")} - {event.time}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Badge
          className="bg-poker-gold/90 text-white font-bold border-none"
        >Buy-in: R$ {event.buyIn.toFixed(2)}</Badge>
        <Badge className="bg-blue-700/90 text-white font-bold border-none">Rebuys: {event.rebuys}</Badge>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <span
          className={twMerge(
            "flex items-center gap-1 text-xs font-semibold",
            isDone
              ? "text-green-600"
              : isNotDone
              ? "text-red-500"
              : "text-poker-gold"
          )}
        >
          {isDone && <Check className="inline h-4 w-4" />} 
          {isNotDone && <X className="inline h-4 w-4" />}
          {isDone
            ? "Cumprido"
            : isNotDone
            ? "Não Cumprido"
            : "Pendente"}
        </span>
        <Switch
          checked={isDone}
          onCheckedChange={() => onToggleStatus(event)}
          className={isDone ? "bg-green-600" : isNotDone ? "bg-red-600" : ""}
        />
        <span className="text-xs text-muted-foreground">Marcar como Cumprido</span>
      </div>
      {isNotDone && (
        <div className="mt-2">
          <input
            type="text"
            placeholder="Motivo"
            value={event.reason || ""}
            onChange={(e) => onChangeReason && onChangeReason(event.id, e.target.value)}
            className="w-full p-2 rounded bg-background text-foreground border border-border outline-none"
          />
        </div>
      )}
    </div>
  );
};
