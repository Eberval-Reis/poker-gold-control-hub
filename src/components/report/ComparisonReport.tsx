
import React from "react";

interface ComparisonReportProps {
  dataA: {
    name: string;
    totalTournaments: number;
    totalProfit: number;
    roi: number;
    expenses: number;
  };
  dataB: {
    name: string;
    totalTournaments: number;
    totalProfit: number;
    roi: number;
    expenses: number;
  };
}

function getVariation(a: number, b: number) {
  if (b === 0) return a === 0 ? 0 : 100;
  return ((a - b) / Math.abs(b)) * 100;
}

const ComparisonReport: React.FC<ComparisonReportProps> = ({ dataA, dataB }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Relatório Comparativo</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <div className="font-medium text-center">{dataA.name}</div>
          <ul className="text-center">
            <li>Torneios: <strong>{dataA.totalTournaments}</strong></li>
            <li>Lucro: <strong>{dataA.totalProfit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></li>
            <li>ROI: <strong>{dataA.roi.toLocaleString("pt-BR", {maximumFractionDigits:2})}%</strong></li>
            <li>Despesas: <strong>{dataA.expenses.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></li>
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="mb-2 text-sm text-muted-foreground">Variação</div>
          <ul>
            <li>
              Torneios: 
              <span className={
                getVariation(dataA.totalTournaments, dataB.totalTournaments) >= 0
                  ? "text-green-700"
                  : "text-red-700"
              }>
                {getVariation(dataA.totalTournaments, dataB.totalTournaments).toFixed(1)}%
              </span>
            </li>
            <li>
              Lucro: 
              <span className={
                getVariation(dataA.totalProfit, dataB.totalProfit) >= 0
                  ? "text-green-700"
                  : "text-red-700"
              }>
                {getVariation(dataA.totalProfit, dataB.totalProfit).toFixed(1)}%
              </span>
            </li>
            <li>
              ROI: 
              <span className={
                getVariation(dataA.roi, dataB.roi) >= 0
                  ? "text-green-700"
                  : "text-red-700"
              }>
                {getVariation(dataA.roi, dataB.roi).toFixed(1)}%
              </span>
            </li>
            <li>
              Despesas: 
              <span className={
                getVariation(dataA.expenses, dataB.expenses) >= 0
                  ? "text-green-700"
                  : "text-red-700"
              }>
                {getVariation(dataA.expenses, dataB.expenses).toFixed(1)}%
              </span>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-medium text-center">{dataB.name}</div>
          <ul className="text-center">
            <li>Torneios: <strong>{dataB.totalTournaments}</strong></li>
            <li>Lucro: <strong>{dataB.totalProfit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></li>
            <li>ROI: <strong>{dataB.roi.toLocaleString("pt-BR", {maximumFractionDigits:2})}%</strong></li>
            <li>Despesas: <strong>{dataB.expenses.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></li>
          </ul>
        </div>
      </div>
      <div className="text-xs text-muted-foreground text-center">
        Comparação baseada em indicadores principais dos períodos selecionados.
      </div>
    </div>
  );
};

export default ComparisonReport;

