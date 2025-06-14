
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AgendaEvent {
  id: string;
  name: string;
  date?: string | null;
}
export function useAgendaEventList() {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("schedule_events")
      .select("id, name, date")
      .then(({ data }) => {
        setEvents(data || []);
        setLoading(false);
      });
  }, []);

  return { events, loading };
}
