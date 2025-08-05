
import { supabase } from "@/integrations/supabase/client";

export interface FinalTablePerformance {
  id: string;
  tournament_id: string;
  tournament_date: string;
  buyin_amount: number;
  rebuy_amount?: number;
  rebuy_quantity?: number;
  addon_enabled?: boolean;
  addon_amount?: number;
  itm_achieved?: boolean;
  final_table_achieved?: boolean;
  position?: number;
  prize_amount?: number;
  ft_photo_url?: string;
  news_link?: string;
  created_at?: string;
  updated_at?: string;
  tournaments?: {
    name: string;
    date: string;
    clubs?: {
      name: string;
    } | null;
  } | null;
}

export const getFinalTablePerformances = async (): Promise<FinalTablePerformance[]> => {
  console.log('Fetching final table performances...');
  
  const { data, error } = await supabase
    .from('tournament_performance')
    .select(`
      id,
      tournament_id,
      tournament_date,
      buyin_amount,
      rebuy_amount,
      rebuy_quantity,
      addon_enabled,
      addon_amount,
      itm_achieved,
      final_table_achieved,
      position,
      prize_amount,
      ft_photo_url,
      news_link,
      created_at,
      updated_at,
      tournaments (
        name,
        date,
        clubs:club_id (
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
  
  console.log('Fetched final table performances:', data);
  
  return (data || []) as FinalTablePerformance[];
};

export const finalTableService = {
  getFinalTablePerformances
};
