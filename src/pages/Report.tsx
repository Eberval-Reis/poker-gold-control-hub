
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { tournamentPerformanceService } from '@/services/tournament-performance.service';
import { expenseService } from '@/services/expense.service';

const Report = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const formattedDate = useMemo(() => {
    if (!date?.from || !date?.to) {
      return 'Selecione um período';
    }

    const from = format(date.from, 'dd MMM yyyy', { locale: ptBR });
    const to = format(date.to, 'dd MMM yyyy', { locale: ptBR });

    return `${from} - ${to}`;
  }, [date?.from, date?.to]);

  const { data: tournamentPerformances, isLoading: isLoadingTournamentPerformances } = useQuery({
    queryKey: ['tournamentPerformances', date?.from, date?.to],
    queryFn: () => tournamentPerformanceService.getTournamentPerformances(),
  });

  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses', date?.from, date?.to],
    queryFn: () => expenseService.getExpenses(),
  });

  const totalInvested = useMemo(() => {
    if (!tournamentPerformances) return 0;
    return tournamentPerformances.reduce((acc, item) => {
      const buyin = Number(item.buyin_amount || 0);
      const rebuy = Number(item.rebuy_amount || 0) * Number(item.rebuy_quantity || 0);
      const addon = item.addon_enabled ? Number(item.addon_amount || 0) : 0;
      return acc + buyin + rebuy + addon;
    }, 0);
  }, [tournamentPerformances]);

  const totalCashout = useMemo(() => {
    if (!tournamentPerformances) return 0;
    return tournamentPerformances.reduce((acc, item) => acc + Number(item.prize_amount || 0), 0);
  }, [tournamentPerformances]);

  const totalExpenses = useMemo(() => {
    if (!expenses) return 0;
    return expenses.reduce((acc, item) => acc + Number(item.amount), 0);
  }, [expenses]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const expenseDistributionData = useMemo(() => {
    if (!expenses) return [];

    const categoryTotals: { [key: string]: number } = {};

    expenses.forEach(expense => {
      const categoryName = expense.type || 'Outros';
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Number(expense.amount);
    });

    const data = Object.keys(categoryTotals).map(key => ({
      name: key,
      value: categoryTotals[key]
    }));

    return data;
  }, [expenses]);

  const monthlyPerformanceData = useMemo(() => {
    if (!tournamentPerformances) return [];

    const monthlyTotals: { [key: string]: number } = {};

    tournamentPerformances.forEach(performance => {
      const monthYear = format(new Date(performance.created_at), 'MMM yyyy', { locale: ptBR });
      const buyin = Number(performance.buyin_amount || 0);
      const rebuy = Number(performance.rebuy_amount || 0) * Number(performance.rebuy_quantity || 0);
      const addon = performance.addon_enabled ? Number(performance.addon_amount || 0) : 0;
      const prize = Number(performance.prize_amount || 0);
      const profit = prize - buyin - rebuy - addon;
      
      monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + profit;
    });

    const data = Object.keys(monthlyTotals).map(key => ({
      name: key,
      value: monthlyTotals[key]
    }));

    return data;
  }, [tournamentPerformances]);

  const tournamentPerformanceData = useMemo(() => {
    if (!tournamentPerformances) return [];

    return tournamentPerformances.map(performance => {
      const buyin = Number(performance.buyin_amount || 0);
      const rebuy = Number(performance.rebuy_amount || 0) * Number(performance.rebuy_quantity || 0);
      const addon = performance.addon_enabled ? Number(performance.addon_amount || 0) : 0;
      const prize = Number(performance.prize_amount || 0);
      const profit = prize - buyin - rebuy - addon;

      return {
        name: performance.tournament_id?.name || 'Torneio Desconhecido',
        profit
      };
    });
  }, [tournamentPerformances]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar />
      <Header onMenuClick={toggleSidebar} />

      <div className="container mx-auto py-6 px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-poker-text-dark">Relatórios</h1>
            <p className="text-gray-600">Acompanhe suas estatísticas e resultados</p>
          </div>
          <DatePickerWithRange date={date} onDateChange={setDate} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Investido
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingTournamentPerformances ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  `R$ ${totalInvested.toFixed(2)}`
                )}
              </div>
              <p className="text-xs text-gray-500">
                Em buy-ins, rebuys, add-ons e taxas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Cashout
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingTournamentPerformances ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  `R$ ${totalCashout.toFixed(2)}`
                )}
              </div>
              <p className="text-xs text-gray-500">
                Total ganho em torneios
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Despesas
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingExpenses ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  `R$ ${totalExpenses.toFixed(2)}`
                )}
              </div>
              <p className="text-xs text-gray-500">
                Gastos diversos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lucro/Prejuízo Total
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingTournamentPerformances || isLoadingExpenses ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  `R$ ${(totalCashout - totalInvested - totalExpenses).toFixed(2)}`
                )}
              </div>
              <p className="text-xs text-gray-500">
                Resultado geral
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Lucro/Prejuízo" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={expenseDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {
                      expenseDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))
                    }
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lucro/Prejuízo por Torneio</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={tournamentPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="profit" fill="#82ca9d" name="Lucro/Prejuízo" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Report;
