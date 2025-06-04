
import { useState, useMemo } from 'react';
import { Home, CalendarDays, DollarSign, TrendingUp, TrendingDown, Medal, Trophy, PieChart, BarChart } from 'lucide-react';
import Header from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import MetricCard from '@/components/dashboard/MetricCard';
import RecentTournamentsTable from '@/components/dashboard/RecentTournamentsTable';
import MonthlyPerformanceChart from '@/components/dashboard/MonthlyPerformanceChart';
import ExpenseDistributionChart from '@/components/dashboard/ExpenseDistributionChart';
import TournamentBarChart from '@/components/dashboard/TournamentBarChart';
import { tournamentPerformanceService } from '@/services/tournament-performance.service';
import { expenseService } from '@/services/expense.service';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const { data: tournamentPerformances, isLoading: isLoadingTournamentPerformances } = useQuery({
    queryKey: ['tournamentPerformances', dateRange?.from, dateRange?.to],
    queryFn: () => tournamentPerformanceService.getTournamentPerformances(),
  });

  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses', dateRange?.from, dateRange?.to],
    queryFn: () => expenseService.getExpenses(),
  });

  const totalInvested = useMemo(() => {
    if (!tournamentPerformances) return 0;
    return tournamentPerformances.reduce((acc, performance) => {
      const buyin = Number(performance.buyin_amount || 0);
      const rebuy = Number(performance.rebuy_amount || 0) * Number(performance.rebuy_quantity || 0);
      const addon = performance.addon_enabled ? Number(performance.addon_amount || 0) : 0;
      return acc + buyin + rebuy + addon;
    }, 0);
  }, [tournamentPerformances]);

  const totalCashout = useMemo(() => {
    if (!tournamentPerformances) return 0;
    return tournamentPerformances.reduce((acc, performance) => acc + Number(performance.prize_amount || 0), 0);
  }, [tournamentPerformances]);

  const totalProfit = useMemo(() => {
    return totalCashout - totalInvested;
  }, [totalCashout, totalInvested]);

  const profitPercentage = useMemo(() => {
    if (totalInvested === 0) return 0;
    return (totalProfit / totalInvested) * 100;
  }, [totalProfit, totalInvested]);

  const totalExpenses = useMemo(() => {
    if (!expenses) return 0;
    return expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
  }, [expenses]);

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar />
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-poker-text-dark">Dashboard</h1>
          <p className="text-gray-600">Acompanhe seus resultados e estatísticas no poker</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Investido"
            value={`R$ ${totalInvested.toFixed(2)}`}
            icon={<DollarSign className="h-4 w-4" />}
            loading={isLoadingTournamentPerformances}
          />
          <MetricCard
            title="Total Cashout"
            value={`R$ ${totalCashout.toFixed(2)}`}
            icon={<TrendingUp className="h-4 w-4" />}
            loading={isLoadingTournamentPerformances}
          />
          <MetricCard
            title="Lucro Total"
            value={`R$ ${totalProfit.toFixed(2)}`}
            icon={totalProfit >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            colorClass={totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}
            loading={isLoadingTournamentPerformances}
          />
          <MetricCard
            title="ROI"
            value={`${profitPercentage.toFixed(1)}%`}
            icon={<BarChart className="h-4 w-4" />}
            loading={isLoadingTournamentPerformances}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyPerformanceChart performances={tournamentPerformances || []} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseDistributionChart expenses={expenses || []} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Resultados por Torneio</CardTitle>
            </CardHeader>
            <CardContent>
              <TournamentBarChart performances={tournamentPerformances || []} tournaments={[]} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Torneios Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentTournamentsTable performances={tournamentPerformances || []} tournaments={[]} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
