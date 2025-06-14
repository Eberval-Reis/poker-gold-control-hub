
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import TournamentBarChart from "@/components/dashboard/TournamentBarChart";
import MonthlyPerformanceChart from "@/components/dashboard/MonthlyPerformanceChart";
import ExpenseDistributionChart from "@/components/dashboard/ExpenseDistributionChart";
import RecentTournamentsTable from "@/components/dashboard/RecentTournamentsTable";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Carrega as performances dos torneios
  const { data: performances, isLoading: isLoadingPerformances } = useQuery({
    queryKey: ["tournament_performance", selectedYear, selectedMonth],
    queryFn: async () => {
      let query = supabase
        .from("tournament_performance")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedYear) {
        query = query.gte("created_at", `${selectedYear}-01-01`).lte("created_at", `${selectedYear}-12-31`);
      }

      if (selectedMonth) {
        const month = String(selectedMonth).padStart(2, '0');
        query = query.gte("created_at", `${selectedYear}-${month}-01`).lte("created_at", `${selectedYear}-${month}-31`);
      }

      const { data } = await query;
      return data || [];
    },
  });

  // Carrega as despesas
  const { data: expenses } = useQuery({
    queryKey: ["expenses", selectedYear, selectedMonth],
    queryFn: async () => {
      let query = supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (selectedYear) {
        query = query.gte("date", `${selectedYear}-01-01`).lte("date", `${selectedYear}-12-31`);
      }

      if (selectedMonth) {
        const month = String(selectedMonth).padStart(2, '0');
        query = query.gte("date", `${selectedYear}-${month}-01`).lte("date", `${selectedYear}-${month}-31`);
      }

      const { data } = await query;
      return data || [];
    },
  });

  // Calcula métricas para o dashboard
  const calculateDashboardData = () => {
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
  };

  const dashboardData = calculateDashboardData();

  if (isLoadingPerformances) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral das suas performances no poker</p>
      </div>

      {/* Filtros de ano/mês podem ser implementados aqui se desejar futuramente */}
      {/* 
      <DashboardFilters
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />
      */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total de Torneios"
          value={dashboardData.totalTournaments.toString()}
          icon="trophy"
          trend={dashboardData.tournamentsTrend}
        />
        <MetricCard
          title="ROI"
          value={`${dashboardData.roi.toFixed(1)}%`}
          icon="trending-up"
          trend={dashboardData.roiTrend}
          color={dashboardData.roi >= 0 ? "green" : "red"}
        />
        <MetricCard
          title="Lucro Total"
          value={`R$ ${dashboardData.totalProfit.toFixed(2)}`}
          icon="dollar-sign"
          trend={dashboardData.profitTrend}
          color={dashboardData.totalProfit >= 0 ? "green" : "red"}
        />
        <MetricCard
          title="ITM Rate"
          value={`${dashboardData.itmRate.toFixed(1)}%`}
          icon="target"
          trend={dashboardData.itmTrend}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TournamentBarChart data={dashboardData.monthlyData} />
        <MonthlyPerformanceChart data={dashboardData.monthlyData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseDistributionChart data={dashboardData.expenseData} />
        <RecentTournamentsTable data={dashboardData.recentTournaments} />
      </div>
    </div>
  );
};

export default Index;
