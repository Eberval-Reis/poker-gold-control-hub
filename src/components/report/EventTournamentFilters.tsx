import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventTournamentFiltersProps {
  eventId?: string;
  setEventId: (id?: string) => void;
  tournamentId?: string;
  setTournamentId: (id?: string) => void;
}

const EventTournamentFilters: React.FC<EventTournamentFiltersProps> = ({
  eventId,
  setEventId,
  tournamentId,
  setTournamentId,
}) => {
  // Buscar eventos
  const { data: events = [] } = useQuery({
    queryKey: ["schedule-events-dre"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedule_events")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Buscar torneios (filtrados por evento se selecionado)
  const { data: tournaments = [] } = useQuery({
    queryKey: ["tournaments-dre", eventId],
    queryFn: async () => {
      let query = supabase
        .from("tournaments")
        .select("id, name, event_id")
        .order("name");

      if (eventId) {
        query = query.eq("event_id", eventId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const handleEventChange = (value: string) => {
    if (value === "all") {
      setEventId(undefined);
      setTournamentId(undefined);
    } else {
      setEventId(value);
      setTournamentId(undefined); // Reset torneio ao trocar evento
    }
  };

  const handleTournamentChange = (value: string) => {
    if (value === "all") {
      setTournamentId(undefined);
    } else {
      setTournamentId(value);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      <div className="flex-1 min-w-[180px]">
        <label className="block text-sm font-medium mb-1">Evento</label>
        <Select value={eventId || "all"} onValueChange={handleEventChange}>
          <SelectTrigger className="w-full h-11 text-base">
            <SelectValue placeholder="Todos os Eventos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Eventos</SelectItem>
            {events.map((event: any) => (
              <SelectItem key={event.id} value={event.id}>
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[180px]">
        <label className="block text-sm font-medium mb-1">Torneio</label>
        <Select value={tournamentId || "all"} onValueChange={handleTournamentChange}>
          <SelectTrigger className="w-full h-11 text-base">
            <SelectValue placeholder="Todos os Torneios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Torneios</SelectItem>
            {tournaments.map((tournament: any) => (
              <SelectItem key={tournament.id} value={tournament.id}>
                {tournament.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EventTournamentFilters;
