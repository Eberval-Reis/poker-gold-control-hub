import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { clubService } from '@/services/club.service';
import { tournamentService } from '@/services/tournament.service';
import { expenseService } from '@/services/expense.service';
import { expenseTypes } from '@/components/expense/ExpenseFormSchema';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { tournamentPerformanceService } from '@/services/tournament-performance.service';

const Report = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('clubs');

  // Fetch clubs data
  const { data: clubs = [], isLoading: isLoadingClubs } = useQuery({
    queryKey: ['clubs'],
    queryFn: clubService.getClubs,
  });

  // Fetch tournaments data
  const { data: tournaments = [], isLoading: isLoadingTournaments } = useQuery({
    queryKey: ['tournaments'],
    queryFn: tournamentService.getTournaments,
  });

  // Fetch expenses data
  const { data: expenses = [], isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseService.getExpenses,
  });

  // Filter data based on search term
  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTournaments = tournaments.filter((tournament: any) =>
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExpenses = expenses.filter((expense: any) => {
    const searchLower = searchTerm.toLowerCase();
    const expenseType = expenseTypes.find(t => t.id === expense.type)?.name || '';
    
    return expenseType.toLowerCase().includes(searchLower) ||
           expense.description?.toLowerCase().includes(searchLower) ||
           expense.tournaments?.name?.toLowerCase().includes(searchLower) ||
           `${expense.amount}`.includes(searchLower);
  });

  // Format currency for expenses
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const handleEditClub = (id: string) => {
    navigate(`/register-club/${id}`);
  };

  const handleEditTournament = (id: string) => {
    navigate(`/register-tournament/${id}`);
  };

  const handleEditExpense = (id: string) => {
    navigate(`/register-expense/${id}`);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-poker-gold hover:text-poker-gold/80"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-poker-text-dark">Relatórios</h1>
          </div>
          <p className="text-[#5a5a5a]">
            Visualize e gerencie todos os seus registros
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Tabs and Table */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="clubs">Clubes</TabsTrigger>
            <TabsTrigger value="tournaments">Torneios</TabsTrigger>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
          </TabsList>
          
          {/* Clubs Tab */}
          <TabsContent value="clubs">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead className="w-[80px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingClubs ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">Carregando...</TableCell>
                    </TableRow>
                  ) : filteredClubs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">Nenhum clube encontrado</TableCell>
                    </TableRow>
                  ) : (
                    filteredClubs.map(club => (
                      <TableRow key={club.id}>
                        <TableCell className="font-medium">{club.name}</TableCell>
                        <TableCell>{club.location}</TableCell>
                        <TableCell>{club.contact_person || 'Não informado'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600"
                            onClick={() => handleEditClub(club.id)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Tournaments Tab */}
          <TabsContent value="tournaments">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Clube</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="w-[80px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingTournaments ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">Carregando...</TableCell>
                    </TableRow>
                  ) : filteredTournaments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">Nenhum torneio encontrado</TableCell>
                    </TableRow>
                  ) : (
                    filteredTournaments.map((tournament: any) => (
                      <TableRow key={tournament.id}>
                        <TableCell className="font-medium">{tournament.name}</TableCell>
                        <TableCell>{tournament.date ? format(new Date(tournament.date), 'dd/MM/yyyy') : '-'}</TableCell>
                        <TableCell>{tournament.clubs?.name || '-'}</TableCell>
                        <TableCell>{tournament.type}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600"
                            onClick={() => handleEditTournament(tournament.id)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Torneio</TableHead>
                    <TableHead className="w-[80px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingExpenses ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">Carregando...</TableCell>
                    </TableRow>
                  ) : filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">Nenhuma despesa encontrada</TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense: any) => {
                      const expenseType = expenseTypes.find(t => t.id === expense.type);
                      
                      return (
                        <TableRow key={expense.id}>
                          <TableCell>{expenseType?.name || 'Outro'}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(expense.amount)}</TableCell>
                          <TableCell>{expense.date ? format(new Date(expense.date), 'dd/MM/yyyy') : '-'}</TableCell>
                          <TableCell>{expense.tournaments?.name || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-blue-600"
                              onClick={() => handleEditExpense(expense.id)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Report;
