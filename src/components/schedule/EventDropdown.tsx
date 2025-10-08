
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AgendaEvent } from "@/hooks/useAgendaEventList";

interface EventDropdownProps {
  events: AgendaEvent[];
  value: string;
  onChange: (eventId: string, eventName?: string | null) => void;
  disabled?: boolean;
}

export const EventDropdown: React.FC<EventDropdownProps> = ({
  events,
  value,
  onChange,
  disabled,
}) => (
  <Select
    value={value}
    onValueChange={id => {
      const selected = events.find(ev => ev.id === id);
      onChange(id, selected?.name ?? "");
    }}
    disabled={disabled}
  >
    <SelectTrigger className={cn("w-full h-10 bg-background", disabled ? "opacity-50" : "")}>
      <SelectValue placeholder="Selecione..." />
    </SelectTrigger>
    <SelectContent className="z-[60] bg-background">
      {events.length === 0 ? (
        <div className="p-2 text-sm text-muted-foreground text-center">
          Nenhum evento cadastrado
        </div>
      ) : (
        events.map((ev) => (
          <SelectItem key={ev.id} value={ev.id}>
            {ev.name} {ev.date ? `(${ev.date})` : ""}
          </SelectItem>
        ))
      )}
    </SelectContent>
  </Select>
);
