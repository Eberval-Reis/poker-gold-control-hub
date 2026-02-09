
import React from "react";
import FinancialReportTable from "./FinancialReportTable";
import { PokerPerformance, Expense } from "@/types";

interface FinancialReportPreviewProps {
  performances: PokerPerformance[];
  expenses: Expense[];
  periodRange: { start: Date; end: Date };
}

const FinancialReportPreview: React.FC<FinancialReportPreviewProps> = ({
  performances,
  expenses,
  periodRange
}) => {
  // Apenas para prévia, mostrar totais básicos
  const totalPremios = performances.reduce((acc, perf) => acc + (Number(perf.prize_amount || 0)), 0);
  const totalDespesas = expenses.reduce((acc, exp) => acc + (Number(exp.amount || 0)), 0);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-poker-text-dark">
        Análise Financeira
      </h3>
      <div className="flex flex-col gap-2 mb-3">
        <span>Total em Prêmios Recebidos: <strong>{totalPremios.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></span>
        <span>Total em Despesas: <strong>{totalDespesas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></span>
        <span>Balanço Final: <strong>{(totalPremios - totalDespesas).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></span>
      </div>
      <FinancialReportTable performances={performances} expenses={expenses} />
      <div className="bg-muted p-4 rounded text-muted-foreground text-center">
        (Relatório visual e detalhamento em breve!)
      </div>
      <div className="text-xs text-muted-foreground mt-3 text-right">
        Período: {periodRange.start.toLocaleDateString()} a {periodRange.end.toLocaleDateString()}
      </div>
    </div>
  );
};

export default FinancialReportPreview;

