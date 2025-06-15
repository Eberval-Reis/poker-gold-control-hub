
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
  tournament_name: string; // <-- Novo campo
  status?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function fetchBackingOffers() {
  // Faz JOIN com tournaments para obter o nome do torneio
  const { data, error } = await supabase
    .from('backing_offers')
    .select(`
      *,
      tournaments (
        name
      )
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Ajusta o formato dos dados retornados para incluir tournament_name diretamente
  const offers: BackingOffer[] = (data ?? []).map((offer: any) => ({
    id: offer.id,
    tournament_id: offer.tournament_id,
    buy_in_amount: offer.buy_in_amount,
    tournament_date: offer.tournament_date,
    available_percentage: offer.available_percentage,
    markup_percentage: offer.markup_percentage,
    player_name: offer.player_name,
    tournament_name: offer.tournaments?.name ?? '',
    status: offer.status,
    created_at: offer.created_at,
    updated_at: offer.updated_at,
  }));

  return offers;
}

export function useBackingOfferList() {
  return useQuery({
    queryKey: ['backing_offers'],
    queryFn: fetchBackingOffers,
  });
}
