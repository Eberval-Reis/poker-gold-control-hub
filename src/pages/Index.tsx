import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import TournamentBarChart from "@/components/dashboard/TournamentBarChart";
import MonthlyPerformanceChart from "@/components/dashboard/MonthlyPerformanceChart";
import ExpenseDistributionChart from "@/components/dashboard/ExpenseDistributionChart";
import RecentTournamentsTable from "@/components/dashboard/RecentTournamentsTable";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ["tournaments", selectedYear, selectedMonth],
    queryFn: async () => {
      let query = supabase
        .from("tournaments")
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

  const calculateDashboardData = () => {
    if (!tournaments || !expenses) {
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

    const totalTournaments = tournaments.length;
    const totalProfit = tournaments.reduce((sum, t) => sum + (t.prize || 0) - (t.buy_in || 0), 0);
    const totalBuyIn = tournaments.reduce((sum, t) => sum + (t.buy_in || 0), 0);
    const roi = totalBuyIn === 0 ? 0 : (totalProfit / totalBuyIn) * 100;
    const itmRate = totalTournaments === 0 ? 0 : (tournaments.filter(t => t.prize && t.prize > 0).length / totalTournaments) * 100;

    // Dados para o gráfico de barras de torneios mensais
    const monthlyData: { month: string; profit: number }[] = [];
    for (let i = 1; i <= 12; i++) {
      const month = String(i).padStart(2, '0');
      const monthlyTournaments = tournaments.filter(t => t.date.startsWith(`${selectedYear}-${month}`));
      const monthlyProfit = monthlyTournaments.reduce((sum, t) => sum + (t.prize || 0) - (t.buy_in || 0), 0);
      monthlyData.push({ month: `${selectedYear}-${month}`, profit: monthlyProfit });
    }

    // Dados para o gráfico de distribuição de despesas
    const expenseData = expenses.reduce((acc: { category: string; amount: number }[], expense) => {
      const category = expense.category || 'Outros';
      const existingCategory = acc.find(item => item.category === category);
      if (existingCategory) {
        existingCategory.amount += expense.amount;
      } else {
        acc.push({ category, amount: expense.amount });
      }
      return acc;
    }, []);

    // Dados para a tabela de torneios recentes
    const recentTournaments = tournaments.slice(0, 5);

    // Cálculo das tendências (simples, comparando com o mês anterior)
    const previousMonth = String(selectedMonth ? selectedMonth - 1 : 12).padStart(2, '0');
    const previousYear = selectedMonth ? selectedYear : selectedYear - 1;

    const previousMonthTournaments = tournaments.filter(t => t.date.startsWith(`${previousYear}-${previousMonth}`));
    const previousMonthProfit = previousMonthTournaments.reduce((sum, t) => sum + (t.prize || 0) - (t.buy_in || 0), 0);
    const previousMonthBuyIn = previousMonthTournaments.reduce((sum, t) => sum + (t.buy_in || 0), 0);
    const previousMonthRoi = previousMonthBuyIn === 0 ? 0 : (previousMonthProfit / previousMonthBuyIn) * 100;
    const previousMonthTotalTournaments = previousMonthTournaments.length;
    const previousMonthItmRate = previousMonthTotalTournaments === 0 ? 0 : (previousMonthTournaments.filter(t => t.prize && t.prize > 0).length / previousMonthTotalTournaments) * 100;

    const tournamentsTrend = totalTournaments - previousMonthTotalTournaments;
    const profitTrend = totalProfit - previousMonthProfit;
    const roiTrend = roi - previousMonthRoi;
    const itmTrend = itmRate - previousMonthItmRate;

    return {
      totalTournaments,
      totalProfit,
      roi,
      itmRate,
      monthlyData,
      expenseData,
      recentTournaments,
      tournamentsTrend,
      profitTrend,
      roiTrend,
      itmTrend,
    };
  };

  const dashboardData = calculateDashboardData();

  if (isLoading) {
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

      <DashboardFilters
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total de Torneios"
          value={dashboardData.totalTournaments}
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
