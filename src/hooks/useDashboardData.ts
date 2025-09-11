import { useMemo } from "react";

// Tabela de tradução de categorias
const EXPENSE_CATEGORY_MAP: Record<string, string> = {
  food: "Alimentação",
  transport: "Transporte",
  hospedagem: "Hospedagem",
  lazer: "Lazer",
  bebida: "Bebida",
  taxi: "Táxi",
  estacionamento: "Estacionamento",
  outro: "Outro",
};

const CATEGORY_KEYS = [
  "food",
  "transport",
  "hospedagem",
  "lazer",
  "bebida",
  "taxi",
  "estacionamento",
  "outro",
];

interface Performance {
  buyin_amount: number;
  rebuy_amount?: number;
  rebuy_quantity?: number;
  addon_enabled?: boolean;
  addon_amount?: number;
  prize_amount?: number;
  created_at: string;
  tournaments?: {
    name: string;
  };
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
  totalBuyin: number;
  totalRebuy: number;
  totalPrizes: number;
  totalExpenses: number;
  finalResult: number;
  monthlyData: { month: string; profit: number }[];
  tournamentPrizeData: { month: string; profit: number }[];
  tournamentsTimelineData: { name: string; date: string; buyin: number; prize: number; profit: number }[];
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
        totalBuyin: 0,
        totalRebuy: 0,
        totalPrizes: 0,
        totalExpenses: 0,
        finalResult: 0,
        monthlyData: [],
        tournamentPrizeData: [],
        tournamentsTimelineData: [],
        expenseData: [],
        recentTournaments: [],
        tournamentsTrend: 0,
        profitTrend: 0,
        roiTrend: 0,
        itmTrend: 0,
      };
    }

    console.log("Processando performances no hook:", performances);

    // LOG: Mostra todas as despesas recebidas
    console.log("Despesas recebidas para processamento:", expenses);

    const totalTournaments = performances.length;
    
    // Calcular novos totais solicitados
    const totalBuyin = performances.reduce((sum, p) => sum + Number(p.buyin_amount || 0), 0);
    const totalRebuy = performances.reduce((sum, p) => sum + (Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0)), 0);
    const totalPrizes = performances.reduce((sum, p) => sum + Number(p.prize_amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    
    const totalProfit = performances.reduce((sum, p) => {
      const buyin = Number(p.buyin_amount || 0);
      const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
      const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
      const invested = buyin + rebuy + addon;
      const prize = Number(p.prize_amount || 0);
      return sum + (prize - invested);
    }, 0);

    const finalResult = (totalProfit - totalExpenses) - (totalBuyin + totalRebuy);

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

    // Nova lógica: Premiação acumulada por nome de torneio
    const tournamentPrizeMap = new Map<string, number>();
    
    performances.forEach((p) => {
      const tournamentName = p.tournaments?.name || "Torneio não especificado";
      const prize = Number(p.prize_amount || 0);
      
      console.log(`Processando: ${tournamentName} - Premiação: R$ ${prize}`);
      
      if (tournamentPrizeMap.has(tournamentName)) {
        tournamentPrizeMap.set(tournamentName, tournamentPrizeMap.get(tournamentName)! + prize);
      } else {
        tournamentPrizeMap.set(tournamentName, prize);
      }
    });

    // Converter o Map para array e ordenar por premiação (maior para menor)
    const tournamentPrizeData: { month: string; profit: number }[] = Array.from(tournamentPrizeMap.entries())
      .filter(([name, totalPrize]) => totalPrize > 0)
      .map(([name, totalPrize]) => ({ month: name, profit: totalPrize }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10); // Limitar aos top 10 torneios

    console.log("Dados finais do gráfico:", tournamentPrizeData);

    // Dados para gráfico de torneios individuais ao longo do tempo
    const tournamentsTimelineData: { name: string; date: string; buyin: number; prize: number; profit: number }[] = performances
      .map((p) => {
        const buyin = Number(p.buyin_amount || 0);
        const rebuy = Number(p.rebuy_amount || 0) * Number(p.rebuy_quantity || 0);
        const addon = p.addon_enabled ? Number(p.addon_amount || 0) : 0;
        const totalInvested = buyin + rebuy + addon;
        const prize = Number(p.prize_amount || 0);
        const profit = prize - totalInvested;
        
        return {
          name: p.tournaments?.name || "Torneio não especificado",
          date: p.created_at,
          buyin: totalInvested,
          prize: prize,
          profit: profit
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date)); // Ordenação cronológica

    console.log("Dados de timeline de torneios individuais:", tournamentsTimelineData);

    // Gráfico de despesas: garantir todas categorias traduzidas, mas exibir apenas com movimentação
    const expenseSum: Record<string, number> = {};
    expenses.forEach((exp) => {
      const key = (exp.type || "outro").toLowerCase();
      expenseSum[key] = (expenseSum[key] || 0) + Number(exp.amount);
    });

    // Gera lista traduzida SÓ com movimentação (>0)
    const expenseData = CATEGORY_KEYS
      .map((key) => ({
        category: EXPENSE_CATEGORY_MAP[key],
        amount: expenseSum[key] ?? 0,
      }))
      .filter(e => e.amount > 0);

    // Inclui qualquer categoria extra (custom) encontrada nos dados mas não no padrão
    Object.keys(expenseSum).forEach((key) => {
      if (!CATEGORY_KEYS.includes(key) && expenseSum[key] > 0) {
        expenseData.push({
          category: key.charAt(0).toUpperCase() + key.slice(1),
          amount: expenseSum[key],
        });
      }
    });

    // LOG: Dados finais para o gráfico de despesas (deve conter todas categorias)
    console.log("Dados finais do gráfico de despesas:", expenseData);

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
      totalBuyin,
      totalRebuy,
      totalPrizes,
      totalExpenses,
      finalResult,
      monthlyData,
      tournamentPrizeData,
      tournamentsTimelineData,
      expenseData,
      recentTournaments,
      tournamentsTrend: totalTournaments - prevTotalTournaments,
      profitTrend: totalProfit - prevProfit,
      roiTrend: roi - prevROI,
      itmTrend: itmRate - prevITMRate,
    };
  }, [performances, expenses, selectedYear, selectedMonth]);
}
