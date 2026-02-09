
import React from "react";
import RoiLineChart from "./RoiLineChart";
import { PokerPerformance, Expense } from "@/types";

interface RoiReportPreviewProps {
  performances: PokerPerformance[];
  expenses: Expense[];
  periodRange: { start: Date; end: Date };
}

const RoiReportPreview: React.FC<RoiReportPreviewProps> = ({
  performances,
  expenses,
  periodRange
}) => {
  // Soma dos buy-ins + rebuys + addon + despesas diversas
  const totalInvestido = performances.reduce(
    (acc, perf) =>
      acc +
      Number(perf.buyin_amount || 0) +
      Number(perf.rebuy_amount || 0) * Number(perf.rebuy_quantity || 0) +
      Number(perf.addon_amount || 0),
    0
  ) + expenses.reduce((acc, exp) => acc + Number(exp.amount || 0), 0);
  const totalPremios = performances.reduce((acc, perf) => acc + (Number(perf.prize_amount || 0)), 0);
  const roi =
    totalInvestido > 0 ? ((totalPremios - totalInvestido) / totalInvestido) * 100 : 0;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-poker-text-dark">
        Análise de ROI
      </h3>
      <div className="flex flex-col gap-2 mb-3">
        <span>Total Investido: <strong>{totalInvestido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></span>
        <span>Total em Prêmios Recebidos: <strong>{totalPremios.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></span>
        <span>ROI do Período: <strong>{roi.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%</strong></span>
      </div>

      {/* Gráfico de evolução do ROI */}
      <div className="mb-4">
        <RoiLineChart performances={performances} />
      </div>

      <div className="bg-muted p-4 rounded text-muted-foreground text-center">
        (Evolução do ROI e mais detalhes em breve!)
      </div>
      <div className="text-xs text-muted-foreground mt-3 text-right">
        Período: {periodRange.start.toLocaleDateString()} a {periodRange.end.toLocaleDateString()}
      </div>
    </div>
  );
};

export default RoiReportPreview;
