
import { useMemo } from "react";

interface Performance {
  buyin_amount: number;
  rebuy_amount?: number;
  rebuy_quantity?: number;
  addon_enabled?: boolean;
  addon_amount?: number;
  prize_amount?: number;
  created_at: string;
}

interface Expense {
  amount: number;
  type: string;
  date: string;
}

interface DashboardData {
  totalTournaments: number;
  totalProfit: number;
  roi: number;
  itmRate: number;
  monthlyData: { month: string; profit: number }[];
  expenseData: { category: string; amount: number }[];
  recentTournaments: any[];
  tournamentsTrend: number;
  profitTrend: number;
  roiTrend: number;
  itmTrend: number;
}

type UseDashboardDataParams = {
  performances: Performance[] | null | undefined;
  expenses: Expense[] | null | undefined;
  selectedYear: number;
  selectedMonth: number | null;
};

export function useDashboardData({
  performances,
  expenses,
  selectedYear,
  selectedMonth,
}: UseDashboardDataParams): DashboardData {
  return useMemo(() => {
    if (!performances || !expenses) {
      return {
        totalTournaments: 0,
        totalProfit: 0,
        roi: 0,
        itmRate: 0,
        monthlyData: [],
        expenseData: [],
        recentTournaments: [],
        tournamentsTrend: 0,
        profitTrend: 0,
        roiTrend: 0,
        itmTrend: 0,
      };
    }

    const totalTournaments = performances.length;
    const totalProfit = performances.reduce((sum, p) => {
      const buyin = Number(p.buyin_amount || 0);
      const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
      const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
      const invested = buyin + rebuy + addon;
      const prize = Number(p.prize_amount || 0);
      return sum + (prize - invested);
    }, 0);

    const totalInvested = performances.reduce((sum, p) => {
      const buyin = Number(p.buyin_amount || 0);
      const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
      const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
      return sum + buyin + rebuy + addon;
    }, 0);

    const roi = totalInvested === 0 ? 0 : (totalProfit / totalInvested) * 100;
    const itmRate = totalTournaments === 0
      ? 0
      : (performances.filter(p => p.prize_amount && Number(p.prize_amount) > 0).length / totalTournaments) * 100;

    // Dados para gráfico mensal de profit
    const monthlyData: { month: string; profit: number }[] = [];
    for (let i = 1; i <= 12; i++) {
      const month = String(i).padStart(2, "0");
      const monthlyPerformances = performances.filter((p) =>
        p.created_at.startsWith(`${selectedYear}-${month}`)
      );
      const monthlyProfit = monthlyPerformances.reduce((sum, p) => {
        const buyin = Number(p.buyin_amount || 0);
        const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
        const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
        const invested = buyin + rebuy + addon;
        const prize = Number(p.prize_amount || 0);
        return sum + (prize - invested);
      }, 0);
      monthlyData.push({ month: `${selectedYear}-${month}`, profit: monthlyProfit });
    }

    // Gráfico de despesas por type
    const expenseData = expenses.reduce((acc: { category: string; amount: number }[], expense) => {
      const type = expense.type || "Outro";
      const existing = acc.find((item) => item.category === type);
      if (existing) {
        existing.amount += Number(expense.amount);
      } else {
        acc.push({ category: type, amount: Number(expense.amount) });
      }
      return acc;
    }, []);

    // Recentes (últimos torneios/performance para tabela)
    const recentTournaments = performances.slice(0, 5);

    // Tendências: compara com mês anterior
    const prevMonth = selectedMonth ? (selectedMonth === 1 ? 12 : selectedMonth - 1) : 12;
    const prevYear = selectedMonth && selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    const prevMonthStr = String(prevMonth).padStart(2, '0');
    const prevMonthPerformances = performances.filter(p =>
      p.created_at.startsWith(`${prevYear}-${prevMonthStr}`)
    );

    // Tendências (comparações com mês anterior)
    const prevTotalTournaments = prevMonthPerformances.length;
    const prevProfit = prevMonthPerformances.reduce((sum, p) => {
      const buyin = Number(p.buyin_amount || 0);
      const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
      const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
      const invested = buyin + rebuy + addon;
      const prize = Number(p.prize_amount || 0);
      return sum + (prize - invested);
    }, 0);
    const prevInvested = prevMonthPerformances.reduce((sum, p) => {
      const buyin = Number(p.buyin_amount || 0);
      const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
      const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
      return sum + buyin + rebuy + addon;
    }, 0);
    const prevROI = prevInvested === 0 ? 0 : (prevProfit / prevInvested) * 100;
    const prevITMRate = prevTotalTournaments === 0
      ? 0
      : (prevMonthPerformances.filter(p => p.prize_amount && Number(p.prize_amount) > 0).length / prevTotalTournaments) * 100;

    return {
      totalTournaments,
      totalProfit,
      roi,
      itmRate,
      monthlyData,
      expenseData,
      recentTournaments,
      tournamentsTrend: totalTournaments - prevTotalTournaments,
      profitTrend: totalProfit - prevProfit,
      roiTrend: roi - prevROI,
      itmTrend: itmRate - prevITMRate,
    };
  }, [performances, expenses, selectedYear, selectedMonth]);
}
