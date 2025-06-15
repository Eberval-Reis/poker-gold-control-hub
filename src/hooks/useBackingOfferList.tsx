
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase";

export interface BackingOffer {
  id: string;
  tournament_id: string;
  buy_in_amount: number;
  tournament_date: string;
  available_percentage: number;
  markup_percentage: number;
  player_name: string;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function fetchBackingOffers() {
  const { data, error } = await supabase
    .from('backing_offers')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as BackingOffer[];
}

export function useBackingOfferList() {
  return useQuery({
    queryKey: ['backing_offers'],
    queryFn: fetchBackingOffers,
  });
}
