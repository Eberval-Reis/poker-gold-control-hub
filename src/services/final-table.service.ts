
import { supabase } from "@/integrations/supabase/client";
import { TournamentPerformance } from '@/lib/supabase';

export const getFinalTablePerformances = async (): Promise<TournamentPerformance[]> => {
  const { data, error } = await supabase
    .from('tournament_performance')
    .select(`
      *,
      tournaments!tournament_id (
        name,
        date,
        clubs!club_id (
          name
        )
      )
    `)
    .eq('final_table_achieved', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching final table performances:', error);
    throw error;
  }
  
  return (data || []) as TournamentPerformance[];
};

export const finalTableService = {
  getFinalTablePerformances
};
