
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import TournamentBarChart from "@/components/dashboard/TournamentBarChart";
import MonthlyPerformanceChart from "@/components/dashboard/MonthlyPerformanceChart";
import ExpenseDistributionChart from "@/components/dashboard/ExpenseDistributionChart";
import RecentTournamentsTable from "@/components/dashboard/RecentTournamentsTable";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardData } from "@/hooks/useDashboardData";

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

  const dashboardData = useDashboardData({
    performances,
    expenses,
    selectedYear,
    selectedMonth,
  });

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
