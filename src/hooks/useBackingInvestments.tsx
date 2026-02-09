
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface BackingInvestment {
  id: string;
  percentage_bought: number;
  amount_paid: number;
  backer_name: string;
  payment_status: string | null;
  backing_offer_id: string;
  offer: {
    buy_in_amount: number;
    player_name: string;
    tournament_date: string;
    available_percentage: number;
    markup_percentage: number;
    tournaments: {
      name: string;
      schedule_events?: { name: string | null } | null;
    };
  } | null;
}

export async function fetchBackingInvestments() {
  // Busca todos os investimentos e faz join para trazer info dos torneios e eventos
  const { data, error } = await supabase
    .from("backing_investments")
    .select(`
      *,
      backing_offers (
        buy_in_amount,
        player_name,
        tournament_date,
        available_percentage,
        markup_percentage,
        tournaments (
          name,
          schedule_events (
            name
          )
        )
      )
    `);
  if (error) throw error;

  return (data ?? []).map((inv) => ({
    id: inv.id,
    percentage_bought: Number(inv.percentage_bought),
    amount_paid: Number(inv.amount_paid),
    backer_name: inv.backer_name,
    payment_status: inv.payment_status ?? "pending",
    backing_offer_id: inv.backing_offer_id,
    offer: inv.backing_offers
      ? {
        buy_in_amount: Number(inv.backing_offers.buy_in_amount),
        player_name: inv.backing_offers.player_name,
        tournament_date: inv.backing_offers.tournament_date,
        available_percentage: Number(inv.backing_offers.available_percentage),
        markup_percentage: Number(inv.backing_offers.markup_percentage),
        tournaments: {
          name: inv.backing_offers.tournaments?.name ?? "-",
          schedule_events: inv.backing_offers.tournaments?.schedule_events
            ? { name: inv.backing_offers.tournaments.schedule_events.name }
            : null,
        },
      }
      : null,
  }));
}

export function useBackingInvestments() {
  return useQuery({
    queryKey: ["backing_investments"],
    queryFn: fetchBackingInvestments,
  });
}
