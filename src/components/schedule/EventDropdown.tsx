
import React from "react";
import { cn } from "@/lib/utils";
import { AgendaEvent } from "@/hooks/useAgendaEventList";

interface EventDropdownProps {
  events: AgendaEvent[];
  value: string;
  onChange: (value: string) => void;
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
    onChange={e => onChange(e.target.value)}
    className={cn(
      "w-full rounded p-2 text-white bg-background border border-input outline-none"
    )}
    disabled={disabled}
  >
    <option value="">Selecione...</option>
    {events.map((ev) => (
      <option key={ev.id} value={ev.name}>
        {ev.name} {ev.date ? `(${ev.date})` : ""}
      </option>
    ))}
  </select>
);

