
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
    setLoading(true);
    supabase
      .from("tournaments")
      .select("id, name")
      .then(({ data }) => {
        setTorneios(data || []);
        setLoading(false);
      });
  }, []);

  return { torneios, loading };
}
