
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface DashboardMetric {
  roi: number;
  playerProfit: number;
  numBackers: number;
  revenueByTournament: { name: string; value: number }[];
  profitDistribution: { name: string; value: number }[]; // [Backers, Cavaleiro]
  isLoading: boolean;
}

async function fetchDashboardData(): Promise<Omit<DashboardMetric, "isLoading">> {
  // Fetch offers + investments + results
  const { data, error } = await supabase
    .from("backing_offers")
    .select(`
      id,
      player_name,
      buy_in_amount,
      markup_percentage,
      tournaments(name),
      backing_investments (
        id,
        amount_paid,
        backer_name
      ),
      backing_results (
        id,
        prize_amount,
        net_prize,
        player_profit
      )
    `);

  if (error) {
    throw error;
  }

  // aggregate data
  let totalInvested = 0;
  let totalPrize = 0;
  let totalPlayerProfit = 0;
  const revenueByTournament: { name: string; value: number }[] = [];
  const backersSet = new Set<string>();
  let backersProfit = 0;

  (data || []).forEach((offer: any) => {
    const buyin = Number(offer.buy_in_amount) || 0;
    const prize = offer.backing_results?.[0]?.prize_amount || 0;
    const net_prize = offer.backing_results?.[0]?.net_prize || 0;
    const player_profit = offer.backing_results?.[0]?.player_profit || 0;
    // Somar apostas/investimentos desse offer
    let offerInvested = 0;
    if (offer.backing_investments) {
      offer.backing_investments.forEach((inv: any) => {
        offerInvested += Number(inv.amount_paid) || 0;
        if (inv.backer_name) backersSet.add(inv.backer_name);
      });
    }
    totalInvested += offerInvested;
    totalPrize += prize;
    totalPlayerProfit += player_profit;

    // Revenue by tournament
    revenueByTournament.push({
      name: offer.tournaments?.name
        ? offer.tournaments.name
        : "Torneio " + offer.id.slice(-4),
      value: Number(prize) || 0,
    });

    // Lucro dos backers = net_prize - player_profit
    if (net_prize > 0 && player_profit >= 0) {
      backersProfit += net_prize - player_profit;
    }
  });

  const roi = totalInvested > 0 ? (totalPrize - totalInvested) / totalInvested : 0;
  // Distribuição de lucros
  const profitDistribution = [
    { name: "Backers", value: backersProfit },
    { name: "Cavaleiro", value: totalPlayerProfit },
  ];

  return {
    roi,
    playerProfit: totalPlayerProfit,
    numBackers: backersSet.size,
    revenueByTournament,
    profitDistribution,
  };
}

export function useBackingDashboardData() {
  const res = useQuery({
    queryKey: ["backing_dashboard_data"],
    queryFn: fetchDashboardData,
  });
  return {
    roi: res.data?.roi ?? 0,
    playerProfit: res.data?.playerProfit ?? 0,
    numBackers: res.data?.numBackers ?? 0,
    revenueByTournament: res.data?.revenueByTournament ?? [],
    profitDistribution: res.data?.profitDistribution ?? [],
    isLoading: res.isLoading,
    isError: res.isError,
  };
}
