
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Torneio {
  id: string;
  name: string;
}
export function useTorneioList() {
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

        const { data, error } = await supabase
          .from("tournaments")
          .select("id, name")
          .eq("user_id", user.id);

        if (error) {
          console.error('Error fetching tournaments:', error);
        } else {
          setTorneios(data || []);
        }
      } catch (error) {
        console.error('Error in fetchTournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return { torneios, loading };
}
