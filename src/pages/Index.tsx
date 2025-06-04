import { useMemo } from 'react';
import { useState, useMemo } from 'react';
import { Home, CalendarDays, DollarSign, TrendingUp, TrendingDown, Medal, Trophy, PieChart, BarChart } from 'lucide-react';
import Header from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RecentTournamentsTable } from '@/components/dashboard/RecentTournamentsTable';
import { MonthlyPerformanceChart } from '@/components/dashboard/MonthlyPerformanceChart';
import { ExpenseDistributionChart } from '@/components/dashboard/ExpenseDistributionChart';
import { TournamentBarChart } from '@/components/dashboard/TournamentBarChart';
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
    queryFn: () => tournamentPerformanceService.getTournamentPerformances(dateRange?.from, dateRange?.to),
  });

  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses', dateRange?.from, dateRange?.to],
    queryFn: () => expenseService.getExpenses(dateRange?.from, dateRange?.to),
  });

  const totalInvested = useMemo(() => {
    if (!tournamentPerformances) return 0;
    return tournamentPerformances.reduce((acc, performance) => acc + (performance.buy_in || 0) + (performance.re_buy || 0) + (performance.add_on || 0) + (performance.others || 0), 0);
  }, [tournamentPerformances]);

  const totalCashout = useMemo(() => {
    if (!tournamentPerformances) return 0;
    return tournamentPerformances.reduce((acc, performance) => acc + (performance.cash_out || 0), 0);
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
    return expenses.reduce((acc, expense) => acc + expense.value, 0);
  }, [expenses]);

  const bestResult = useMemo(() => {
    if (!tournamentPerformances || tournamentPerformances.length === 0) return null;
    return tournamentPerformances.reduce((prev, current) => (prev.cash_out! - (prev.buy_in! + prev.re_buy! + prev.add_on! + prev.others!) > current.cash_out! - (current.buy_in! + current.re_buy! + current.add_on! + current.others!) ? prev : current));
  }, [tournamentPerformances]);

  const worstResult = useMemo(() => {
    if (!tournamentPerformances || tournamentPerformances.length === 0) return null;
    return tournamentPerformances.reduce((prev, current) => (prev.cash_out! - (prev.buy_in! + prev.re_buy! + prev.add_on! + prev.others!) < current.cash_out! - (current.buy_in! + current.re_buy! + current.add_on! + current.others!) ? prev : current));
  }, [tournamentPerformances]);

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar />
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-poker-text-dark">Dashboard</h1>
          <p className="text-gray-600">Acompanhe seus resultados e estatísticas no poker</p>
        </div>

        <DashboardFilters dateRange={dateRange} setDateRange={setDateRange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Investido"
            value={totalInvested}
            isLoading={isLoadingTournamentPerformances}
            icon={DollarSign}
          />
          <MetricCard
            title="Total Cashout"
            value={totalCashout}
            isLoading={isLoadingTournamentPerformances}
            icon={TrendingUp}
          />
          <MetricCard
            title="Lucro Total"
            value={totalProfit}
            isLoading={isLoadingTournamentPerformances}
            icon={totalProfit >= 0 ? TrendingUp : TrendingDown}
            isPositive={totalProfit >= 0}
          />
          <MetricCard
            title="ROI"
            value={profitPercentage}
            isLoading={isLoadingTournamentPerformances}
            icon={BarChart}
            isPercentage
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyPerformanceChart dateRange={dateRange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseDistributionChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Resultados por Torneio</CardTitle>
            </CardHeader>
            <CardContent>
              <TournamentBarChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Torneios Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentTournamentsTable dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
