
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

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("schedule_events")
        .select("id, name, date")
        .order("date", { ascending: false });
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const refreshEvents = () => {
    fetchEvents();
  };

  return { events, loading, refreshEvents };
}
