
import React from "react";
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
  <select
    value={value}
    onChange={e => {
      const id = e.target.value;
      const selected = events.find(ev => ev.id === id);
      onChange(id, selected?.name ?? "");
    }}
    className={cn(
      "w-full rounded p-2 text-white bg-background border border-input outline-none"
    )}
    disabled={disabled}
  >
    <option value="">Selecione...</option>
    {events.map((ev) => (
      <option key={ev.id} value={ev.id}>
        {ev.name} {ev.date ? `(${ev.date})` : ""}
      </option>
    ))}
  </select>
);
