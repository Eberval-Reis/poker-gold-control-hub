
import { useMemo } from "react";
import { useReportData, UseReportDataOptions } from "@/hooks/useReportData";

// Hook que recebe dois períodos e retorna os principais KPIs para comparação
export function useReportComparisonData(optionsA: UseReportDataOptions, optionsB: UseReportDataOptions) {
  const reportA = useReportData(optionsA);
  const reportB = useReportData(optionsB);

  // Calcular KPIs agregados para ambos os períodos
  const kpisA = useMemo(() => ({
    name: `Período A (${reportA.start.toLocaleDateString()} a ${reportA.end.toLocaleDateString()})`,
    totalTournaments: reportA.performances.length,
    totalProfit: reportA.performances.reduce((acc, p) => {
      const buyin = Number(p.buyin_amount || 0);
      const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
      const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
      const invested = buyin + rebuy + addon;
      const prize = Number(p.prize_amount || 0);
      return acc + (prize - invested);
    }, 0),
    roi: (() => {
      const invested = reportA.performances.reduce((acc, p) => {
        const buyin = Number(p.buyin_amount || 0);
        const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
        const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
        return acc + buyin + rebuy + addon;
      }, 0);
      const profit = reportA.performances.reduce((acc, p) => {
        const buyin = Number(p.buyin_amount || 0);
        const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
        const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
        const invested = buyin + rebuy + addon;
        const prize = Number(p.prize_amount || 0);
        return acc + (prize - invested);
      }, 0);
      return invested > 0 ? (profit / invested) * 100 : 0;
    })(),
    expenses: reportA.expenses.reduce((acc, e) => acc + Number(e.amount), 0),
  }), [reportA]);

  const kpisB = useMemo(() => ({
    name: `Período B (${reportB.start.toLocaleDateString()} a ${reportB.end.toLocaleDateString()})`,
    totalTournaments: reportB.performances.length,
    totalProfit: reportB.performances.reduce((acc, p) => {
      const buyin = Number(p.buyin_amount || 0);
      const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
      const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
      const invested = buyin + rebuy + addon;
      const prize = Number(p.prize_amount || 0);
      return acc + (prize - invested);
    }, 0),
    roi: (() => {
      const invested = reportB.performances.reduce((acc, p) => {
        const buyin = Number(p.buyin_amount || 0);
        const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
        const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
        return acc + buyin + rebuy + addon;
      }, 0);
      const profit = reportB.performances.reduce((acc, p) => {
        const buyin = Number(p.buyin_amount || 0);
        const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
        const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
        const invested = buyin + rebuy + addon;
        const prize = Number(p.prize_amount || 0);
        return acc + (prize - invested);
      }, 0);
      return invested > 0 ? (profit / invested) * 100 : 0;
    })(),
    expenses: reportB.expenses.reduce((acc, e) => acc + Number(e.amount), 0),
  }), [reportB]);

  return { kpisA, kpisB, loading: reportA.loading || reportB.loading, error: reportA.error || reportB.error };
}
