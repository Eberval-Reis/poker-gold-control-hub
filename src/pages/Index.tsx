
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import TournamentBarChart from "@/components/dashboard/TournamentBarChart";
import TournamentsTimelineChart from "@/components/dashboard/TournamentsTimelineChart";
import MonthlyPerformanceChart from "@/components/dashboard/MonthlyPerformanceChart";
import ExpenseDistributionChart from "@/components/dashboard/ExpenseDistributionChart";
import RecentTournamentsTable from "@/components/dashboard/RecentTournamentsTable";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Trophy, TrendingUp, DollarSign, Target, CreditCard, Repeat2, Receipt, Calculator } from "lucide-react";

const Index = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Carrega as performances dos torneios com informações do torneio
  const { data: performances, isLoading: isLoadingPerformances } = useQuery({
    queryKey: ["tournament_performance", selectedYear, selectedMonth],
    queryFn: async () => {
      let query = supabase
        .from("tournament_performance")
        .select(`
          *,
          tournaments!inner (
            id,
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (selectedYear) {
        query = query.gte("created_at", `${selectedYear}-01-01`).lte("created_at", `${selectedYear}-12-31`);
      }

      if (selectedMonth) {
        const month = String(selectedMonth).padStart(2, '0');
        query = query.gte("created_at", `${selectedYear}-${month}-01`).lte("created_at", `${selectedYear}-${month}-31`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Erro ao buscar performances:", error);
        return [];
      }
      
      console.log("Performances carregadas:", data);
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
        // Busca todas despesas entre 1 de janeiro até 31 de dezembro do ano selecionado
        query = query.gte("date", `${selectedYear}-01-01`).lte("date", `${selectedYear}-12-31`);
      }

      // Não filtra por mês aqui! O hook já computa/agrega corretamente com base na lista completa do ano
      // Se quiser filtrar apenas despesas de um mês do ano, descomente as linhas abaixo:
      /*
      if (selectedMonth) {
        const month = String(selectedMonth).padStart(2, '0');
        query = query.gte("date", `${selectedYear}-${month}-01`).lte("date", `${selectedYear}-${month}-31`);
      }
      */

      const { data } = await query;
      // LOG: Despesas retornadas da query
      console.log("Despesas carregadas do banco:", data);
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
          icon={<Trophy className="h-5 w-5 text-[#d4af37]" />}
          trend={dashboardData.tournamentsTrend}
        />
        <MetricCard
          title="ROI"
          value={`${dashboardData.roi.toFixed(1)}%`}
          icon={<TrendingUp className="h-5 w-5 text-[#d4af37]" />}
          trend={dashboardData.roiTrend}
          color={dashboardData.roi >= 0 ? "green" : "red"}
        />
        <MetricCard
          title="Lucro Total"
          value={`R$ ${dashboardData.totalProfit.toFixed(2)}`}
          icon={<DollarSign className="h-5 w-5 text-[#d4af37]" />}
          trend={dashboardData.profitTrend}
          color={dashboardData.totalProfit >= 0 ? "green" : "red"}
        />
        <MetricCard
          title="Total Buy-in"
          value={`R$ ${dashboardData.totalBuyin.toFixed(2)}`}
          icon={<CreditCard className="h-5 w-5 text-[#d4af37]" />}
        />
        <MetricCard
          title="Total de Rebuys"
          value={`R$ ${dashboardData.totalRebuy.toFixed(2)}`}
          icon={<Repeat2 className="h-5 w-5 text-[#d4af37]" />}
        />
        <MetricCard
          title="Despesa Total"
          value={`R$ ${dashboardData.totalExpenses.toFixed(2)}`}
          icon={<Receipt className="h-5 w-5 text-[#d4af37]" />}
        />
        <MetricCard
          title="Resultado"
          value={`R$ ${dashboardData.finalResult.toFixed(2)}`}
          icon={<Calculator className="h-5 w-5 text-[#d4af37]" />}
          color={dashboardData.finalResult >= 0 ? "green" : "red"}
        />
        <MetricCard
          title="ITM Rate"
          value={`${dashboardData.itmRate.toFixed(1)}%`}
          icon={<Target className="h-5 w-5 text-[#d4af37]" />}
          trend={dashboardData.itmTrend}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <TournamentBarChart data={dashboardData.tournamentPrizeData} />
        <TournamentsTimelineChart data={dashboardData.tournamentsTimelineData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MonthlyPerformanceChart data={dashboardData.monthlyData} />
        <ExpenseDistributionChart data={dashboardData.expenseData} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RecentTournamentsTable data={dashboardData.recentTournaments} />
      </div>
    </div>
  );
};

export default Index;
