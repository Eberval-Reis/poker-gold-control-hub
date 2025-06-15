
import React from "react";
import { Button } from "@/components/ui/button";
import { useBackingInvestments } from "@/hooks/useBackingInvestments";
import { Loader2, Check, AlertTriangle, Edit, Trash2 } from "lucide-react";

const statusColor = {
  "Pago": "text-green-600",
  "pending": "text-yellow-600",
  "Pendente": "text-yellow-600",
  "pago": "text-green-600"
};

const statusLabel = (status: string | null) => {
  if (!status || status.toLowerCase() === "pending" || status === "Pendente")
    return (
      <span className="font-semibold text-yellow-600 flex items-center gap-1">
        <AlertTriangle size={16} /> Pendente
      </span>
    );
  return (
    <span className="font-semibold text-green-600 flex items-center gap-1">
      <Check size={16} /> Pago
    </span>
  );
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

  // Agrupar por oferta para visualização destacada (evento, torneio, jogador)
  // Exibiremos uma "seção" para cada backing_offer diferente
  const grouped = Object.values(
    data.reduce((acc: any, investment) => {
      const offerId = investment.backing_offer_id;
      if (!acc[offerId]) acc[offerId] = { offer: investment.offer, investments: [] };
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
            <div className="bg-gray-100 px-6 py-4 rounded-t-md border border-b-0 border-gray-200 flex flex-col gap-0">
              <span className="text-sm font-medium text-poker-gold tracking-wide">
                {eventName}
              </span>
              <span className="font-bold text-lg text-gray-900">{tournamentName}</span>
              <span className="text-base text-gray-700">
                Jogador: <span className="font-bold">{playerName}</span>
              </span>
            </div>
            <div className="overflow-x-auto border border-gray-200 rounded-b-md bg-white">
              <table className="min-w-full text-sm text-gray-900">
                <thead>
                  <tr className="bg-muted">
                    <th className="py-2 px-3 text-left">Nome</th>
                    <th className="py-2 px-3">% Ação</th>
                    <th className="py-2 px-3">Valor Pago</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((b: any) => (
                    <tr key={b.id} className="border-t last:border-b-0">
                      <td className="py-2 px-3">{b.backer_name}</td>
                      <td className="py-2 px-3">{b.percentage_bought}%</td>
                      <td className="py-2 px-3">
                        R$ {b.amount_paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-3">{statusLabel(b.payment_status)}</td>
                      <td className="py-2 px-3 flex gap-1">
                        <Button size="sm" variant="ghost" className="text-poker-gold hover:bg-gray-100 p-1">
                          <Edit size={15} />
                        </Button>
                        <Button size="sm" variant="destructive" className="p-1">
                          <Trash2 size={15} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end items-center gap-4 mt-2 ">
              <span className="font-bold text-base text-gray-900">
                Total Arrecadado: R$ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({buyin > 0 ? ((total / buyin) * 100).toFixed(0) : "0"}% do buy-in)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ControleBackersSection;
