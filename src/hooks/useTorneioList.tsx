
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Torneio {
  id: string;
  name: string;
  buyin_amount: number | null;
  event_id: string | null;
}

interface UseTorneioListProps {
  eventId?: string;
}

export function useTorneioList(props?: UseTorneioListProps) {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('User not authenticated');
          setLoading(false);
          return;
        }

        let query = supabase
          .from("tournaments")
          .select("id, name, buyin_amount, event_id")
          .eq("user_id", user.id);

        // Filtrar por evento se especificado
        if (props?.eventId) {
          query = query.eq("event_id", props.eventId);
        }

        const { data, error } = await query.order("name");

        if (error) {
          console.error('Error fetching tournaments:', error);
        } else {
          // Filter to get unique tournament names
          const uniqueNames = new Set<string>();
          const uniqueTournaments: Torneio[] = [];
          
          data?.forEach((tournament) => {
            if (!uniqueNames.has(tournament.name)) {
              uniqueNames.add(tournament.name);
              uniqueTournaments.push(tournament);
            }
          });
          
          setTorneios(uniqueTournaments);
        }
      } catch (error) {
        console.error('Error in fetchTournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [props?.eventId]);

  return { torneios, loading };
}
