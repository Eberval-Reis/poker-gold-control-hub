
import React from "react";
import { useBackingInvestments } from "@/hooks/useBackingInvestments";
import { Loader2 } from "lucide-react";
import BackersOfferHeader from "./BackersOfferHeader";
import BackersInvestmentsTable from "./BackersInvestmentsTable";
// Removido: import BackersPayoutTable from "./BackersPayoutTable";

type InvestmentGroup = {
  offer: any;
  investments: any[];
};

const ControleBackersSection = () => {
  const { data, isLoading, error } = useBackingInvestments();

  if (isLoading) {
    return (
      <div className="text-center py-12 text-poker-gold flex justify-center">
        <Loader2 className="animate-spin mr-2" /> Carregando investimentos...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Erro ao carregar investimentos
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="text-center my-10 text-poker-gold">
        Nenhum investimento cadastrado ainda.
      </div>
    );
  }

  const grouped: InvestmentGroup[] = Object.values(
    data.reduce<Record<string, InvestmentGroup>>((acc, investment) => {
      const offerId = investment.backing_offer_id;
      if (!acc[offerId])
        acc[offerId] = { offer: investment.offer, investments: [] };
      acc[offerId].investments.push(investment);
      return acc;
    }, {})
  );

  return (
    <div className="space-y-8 max-w-3xl mx-auto w-full">
      <h2 className="text-xl font-semibold">Controle de Backers</h2>
      {grouped.map((group, idx) => {
        const { offer, investments } = group;
        const buyin = offer?.buy_in_amount ?? 0;
        const total = investments.reduce(
          (sum: number, b: any) => sum + b.amount_paid,
          0
        );
        const eventName = offer?.tournaments?.schedule_events?.name || null;
        const tournamentName = offer?.tournaments?.name || "-";
        const playerName = offer?.player_name || "-";

        return (
          <div key={idx} className="mb-10">
            <BackersOfferHeader
              eventName={eventName}
              tournamentName={tournamentName}
              playerName={playerName}
            />
            <BackersInvestmentsTable investments={investments} />
            <div className="flex justify-end items-center gap-4 mt-2 ">
              <span className="font-bold text-base text-gray-900">
                Total Arrecadado: R$ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({buyin > 0 ? ((total / buyin) * 100).toFixed(0) : "0"}% do buy-in)
              </span>
            </div>
          </div>
        );
      })}
      {/* Removido o bloco geral dos payouts */}
    </div>
  );
};

export default ControleBackersSection;
