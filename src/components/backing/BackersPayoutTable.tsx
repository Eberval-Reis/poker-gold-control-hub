
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface PayoutRow {
  id: string;
  tournament: string;
  event?: string | null;
  player: string;
  backer: string;
  percentage: number;
  invested: number;
  payout: number | null;
  roi: number | null;
}

// Corrigir a relação: backer_payouts!backing_investment_id(*)
async function fetchBackersPayoutTable(): Promise<PayoutRow[]> {
  const { data, error } = await supabase
    .from("backing_investments")
    .select(`
      *,
      backing_offers (
        tournaments (
          name,
          schedule_events (name)
        ),
        player_name
      ),
      backer_payouts:backer_payouts!backing_investment_id(*)
    `);

  if (error) throw error;

  return (data ?? []).map((item) => ({
    id: item.id,
    tournament:
      item.backing_offers?.tournaments?.name ??
      `Torneio ${item.backing_offer_id?.slice(-4)}`,
    event: item.backing_offers?.tournaments?.schedule_events?.name ?? null,
    player: item.backing_offers?.player_name ?? "-",
    backer: item.backer_name,
    percentage: item.percentage_bought,
    invested: Number(item.amount_paid ?? 0),
    payout:
      (item.backer_payouts?.length ?? 0) > 0
        ? Number(item.backer_payouts[0]?.payout_amount ?? 0)
        : null,
    roi:
      (item.backer_payouts?.length ?? 0) > 0
        ? Number(item.backer_payouts[0]?.roi_percentage ?? 0)
        : null,
  }));
}

const BackersPayoutTable: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["backers_payout_table"],
    queryFn: fetchBackersPayoutTable,
  });

  if (isLoading) {
    return (
      <div className="py-10 flex justify-center text-poker-gold">
        <Loader2 className="animate-spin mr-2" />
        Carregando dados dos payouts...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Erro ao buscar dados dos payouts.
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="text-center my-10 text-muted-foreground">
        Nenhum payout registrado ainda.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="bg-muted border-b">
            <th className="py-2 px-2 sm:px-3 text-left align-middle font-medium whitespace-nowrap">Torneio</th>
            <th className="py-2 px-2 sm:px-3 text-left align-middle font-medium whitespace-nowrap">Backer</th>
            <th className="py-2 px-2 sm:px-3 text-center align-middle font-medium whitespace-nowrap">% Ações</th>
            <th className="py-2 px-2 sm:px-3 text-right align-middle font-medium whitespace-nowrap">Investido</th>
            <th className="py-2 px-2 sm:px-3 text-right align-middle font-medium whitespace-nowrap">Retorno</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b last:border-0 hover:bg-muted/50">
              <td className="py-2 px-2 sm:px-3 text-left align-middle max-w-[120px] truncate">
                {row.tournament}
              </td>
              <td className="py-2 px-2 sm:px-3 text-left align-middle whitespace-nowrap">
                {row.backer}
              </td>
              <td className="py-2 px-2 sm:px-3 text-center align-middle whitespace-nowrap">
                {row.percentage}%
              </td>
              <td className="py-2 px-2 sm:px-3 text-right align-middle whitespace-nowrap">
                R$ {row.invested.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </td>
              <td className="py-2 px-2 sm:px-3 text-right align-middle whitespace-nowrap">
                {row.payout !== null
                  ? <span className={row.payout - row.invested >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    R$ {row.payout.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  : <span className="text-muted-foreground">-</span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackersPayoutTable;
