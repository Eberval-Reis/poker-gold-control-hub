
import { useState, useMemo } from 'react';
import { Home, CalendarDays, DollarSign, TrendingUp, TrendingDown, Medal, Trophy, PieChart, BarChart } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricCard from '@/components/dashboard/MetricCard';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import TournamentBarChart from '@/components/dashboard/TournamentBarChart';
import MonthlyPerformanceChart from '@/components/dashboard/MonthlyPerformanceChart';
import ExpenseDistributionChart from '@/components/dashboard/ExpenseDistributionChart';
import RecentTournamentsTable from '@/components/dashboard/RecentTournamentsTable';
import { tournamentPerformanceService } from '@/services/tournament-performance.service';
import { tournamentService } from '@/services/tournament.service';
import { expenseService } from '@/services/expense.service';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Time period filter options
const timePeriods = [
  { value: 'all', label: 'Todos os tempos' },
  { value: 'year', label: 'Este ano' },
  { value: 'month', label: 'Este mês' },
  { value: '3months', label: 'Últimos 3 meses' }
];

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Filters state
  const [filters, setFilters] = useState({
    timePeriod: 'all',
    gameType: 'all',
    clubId: 'all'
  });
  
  // Fetch data
  const { data: performances = [], isLoading: isLoadingPerformances } = useQuery({
    queryKey: ['tournament-performances'],
    queryFn: tournamentPerformanceService.getTournamentPerformances
  });

  const { data: tournaments = [], isLoading: isLoadingTournaments } = useQuery({
    queryKey: ['tournaments'],
    queryFn: tournamentService.getTournaments
  });

  const { data: expenses = [], isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseService.getExpenses
  });

  // Memoized calculations for metrics
  const metrics = useMemo(() => {
    // Filter data based on filters if needed
    const filteredPerformances = performances;
    
    // Calculate metrics
    const totalTournaments = filteredPerformances.length;
    const totalBuyins = filteredPerformances.reduce((sum, perf) => sum + Number(perf.buyin_amount || 0), 0);
    
    const totalRebuys = filteredPerformances.reduce((sum, perf) => {
      const rebuyAmount = Number(perf.rebuy_amount || 0);
      const rebuyQuantity = Number(perf.rebuy_quantity || 0);
      return sum + (rebuyAmount * rebuyQuantity);
    }, 0);
    
    const totalRebuyCount = filteredPerformances.reduce((sum, perf) => sum + Number(perf.rebuy_quantity || 0), 0);
    
    const itmCount = filteredPerformances.filter(perf => perf.itm_achieved).length;
    const itmPercentage = totalTournaments > 0 ? (itmCount / totalTournaments) * 100 : 0;
    
    const finalTableCount = filteredPerformances.filter(perf => perf.final_table_achieved).length;
    
    const totalPrizes = filteredPerformances.reduce((sum, perf) => sum + Number(perf.prize_amount || 0), 0);
    
    const totalInvested = totalBuyins + totalRebuys;
    const roi = totalInvested > 0 ? ((totalPrizes - totalInvested) / totalInvested) * 100 : 0;
    
    const totalExpensesAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    
    const netProfit = totalPrizes - totalInvested - totalExpensesAmount;
    
    return {
      totalTournaments,
      totalBuyins,
      totalRebuys,
      totalRebuyCount,
      itmCount,
      itmPercentage,
      finalTableCount,
      totalPrizes,
      roi,
      totalExpensesAmount,
      netProfit,
      totalInvested
    };
  }, [performances, expenses, filters]);

  // Helper to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-6 w-6 text-[#d4af37]" />
            <h1 className="text-2xl font-bold text-poker-text-dark">Dashboard</h1>
          </div>
          <p className="text-[#5a5a5a]">Análise de desempenho em torneios e cash games</p>
        </div>
        
        {/* Filters */}
        <DashboardFilters 
          filters={filters} 
          setFilters={setFilters} 
          tournaments={tournaments} 
        />
        
        {/* Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              <MetricCard 
                title="Torneios Jogados"
                value={metrics.totalTournaments.toString()}
                icon={<Trophy size={24} className="text-[#d4af37]" />}
                loading={isLoadingPerformances}
              />
              
              <MetricCard 
                title="Total em Buy-ins"
                value={formatCurrency(metrics.totalBuyins)}
                icon={<DollarSign size={24} className="text-black" />}
                loading={isLoadingPerformances}
              />
              
              <MetricCard 
                title="Rebuys Realizados"
                value={`${metrics.totalRebuyCount} (${formatCurrency(metrics.totalRebuys)})`}
                icon={<CalendarDays size={24} className="text-[#5a5a5a]" />}
                loading={isLoadingPerformances}
              />
              
              <MetricCard 
                title="ITM (In The Money)"
                value={`${metrics.itmCount} (${metrics.itmPercentage.toFixed(0)}%)`}
                icon={<BarChart size={24} className="text-[#d4af37]" />}
                colorClass={metrics.itmPercentage >= 30 ? "text-[#006400]" : ""}
                loading={isLoadingPerformances}
              />
              
              <MetricCard 
                title="Final Tables"
                value={metrics.finalTableCount.toString()}
                icon={<Medal size={24} className="text-[#d4af37]" />}
                loading={isLoadingPerformances}
              />
              
              <MetricCard 
                title="Prêmios Ganhos"
                value={formatCurrency(metrics.totalPrizes)}
                icon={<DollarSign size={24} className="text-[#006400]" />}
                colorClass="text-[#006400]"
                loading={isLoadingPerformances}
              />
              
              <MetricCard 
                title="ROI"
                value={`${metrics.roi.toFixed(2)}%`}
                icon={metrics.roi >= 0 ? 
                  <TrendingUp size={24} className="text-[#006400]" /> : 
                  <TrendingDown size={24} className="text-[#8b0000]" />
                }
                colorClass={metrics.roi >= 0 ? "text-[#006400]" : "text-[#8b0000]"}
                loading={isLoadingPerformances}
              />
              
              <MetricCard 
                title="Despesas Totais"
                value={formatCurrency(metrics.totalExpensesAmount)}
                icon={<DollarSign size={24} className="text-[#8b0000]" />}
                colorClass="text-[#8b0000]"
                loading={isLoadingExpenses}
              />
              
              <MetricCard 
                title="Lucro Líquido"
                value={formatCurrency(metrics.netProfit)}
                icon={metrics.netProfit >= 0 ? 
                  <TrendingUp size={24} /> : 
                  <TrendingDown size={24} />
                }
                colorClass={metrics.netProfit >= 0 ? "text-[#006400]" : "text-[#8b0000]"}
                loading={isLoadingPerformances || isLoadingExpenses}
              />
            </div>
            
            {/* ROI Goal Progress */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Meta de ROI (30%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Atual: {metrics.roi.toFixed(2)}%</span>
                    <span>Meta: 30%</span>
                  </div>
                  <Progress value={Math.min(metrics.roi, 100)} 
                    className={metrics.roi >= 30 ? "bg-gray-200" : ""} 
                  />
                  {metrics.roi >= 30 ? (
                    <p className="text-sm text-[#006400] font-medium">Meta atingida! 🎉</p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Faltam {(30 - metrics.roi).toFixed(2)}% para atingir a meta
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Receita por Torneio</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingPerformances ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    <TournamentBarChart 
                      performances={performances} 
                      tournaments={tournaments}
                    />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evolução Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingPerformances ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    <MonthlyPerformanceChart 
                      performances={performances}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Distribuição de Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingExpenses ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="h-64 w-64 rounded-full" />
                    </div>
                  ) : (
                    <ExpenseDistributionChart 
                      expenses={expenses}
                    />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Últimos Torneios</CardTitle>
                  <Button variant="outline" size="sm">Ver todos</Button>
                </CardHeader>
                <CardContent>
                  {isLoadingPerformances ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <RecentTournamentsTable 
                      performances={performances}
                      tournaments={tournaments}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Análise Detalhada</h2>
                <p className="text-muted-foreground">
                  Página de detalhes em desenvolvimento. Em breve você terá acesso a análises mais aprofundadas de seu desempenho.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
