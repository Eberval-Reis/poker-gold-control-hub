
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
  tournament_name: string;
  event_name?: string | null;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
  // New fields for bankroll model
  offer_type: 'tournament' | 'bankroll';
  total_bankroll?: number | null;
  period_description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
}

export async function fetchBackingOffers() {
  const { data, error } = await supabase
    .from('backing_offers')
    .select(`
      *,
      tournaments (
        name,
        event_id,
        schedule_events (
          name
        )
      )
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const offers: BackingOffer[] = (data ?? []).map((offer) => ({
    id: offer.id,
    tournament_id: offer.tournament_id,
    buy_in_amount: offer.buy_in_amount,
    tournament_date: offer.tournament_date,
    available_percentage: offer.available_percentage,
    markup_percentage: offer.markup_percentage,
    player_name: offer.player_name,
    tournament_name: offer.tournaments?.name ?? '',
    event_name: offer.tournaments?.schedule_events?.name ?? null,
    status: offer.status,
    created_at: offer.created_at,
    updated_at: offer.updated_at,
    // New fields
    offer_type: (offer.offer_type || 'tournament') as 'tournament' | 'bankroll',
    total_bankroll: offer.total_bankroll,
    period_description: offer.period_description,
    start_date: offer.start_date,
    end_date: offer.end_date,
  }));

  return offers;
}

export function useBackingOfferList() {
  return useQuery({
    queryKey: ['backing_offers'],
    queryFn: fetchBackingOffers,
  });
}

