
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, List, Building2, Trophy, Wallet, BarChart3 } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SummaryCard from '@/components/SummaryCard';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { clubService } from '@/services/club.service';
import { tournamentService } from '@/services/tournament.service';
import { expenseService } from '@/services/expense.service';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get counts for summary cards
  const { data: clubs = [] } = useQuery({
    queryKey: ['clubs'],
    queryFn: clubService.getClubs,
  });

  const { data: tournaments = [] } = useQuery({
    queryKey: ['tournaments'],
    queryFn: tournamentService.getTournaments,
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseService.getExpenses,
  });

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + Number(expense.amount), 0);
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(totalExpenses);

  const menuItems = [
    {
      title: "Lista de Clubes",
      icon: <List className="h-6 w-6" />,
      description: "Gerencie seus clubes",
      link: "/clubs",
      color: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Lista de Torneios",
      icon: <List className="h-6 w-6" />,
      description: "Gerencie seus torneios",
      link: "/tournaments",
      color: "bg-amber-100",
      textColor: "text-amber-600"
    },
    {
      title: "Lista de Despesas",
      icon: <List className="h-6 w-6" />,
      description: "Gerencie suas despesas",
      link: "/expenses",
      color: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "Cadastrar Clube",
      icon: <Building2 className="h-6 w-6" />,
      description: "Adicione um novo clube",
      link: "/register-club",
      color: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Cadastrar Torneio",
      icon: <Trophy className="h-6 w-6" />,
      description: "Adicione um novo torneio",
      link: "/register-tournament",
      color: "bg-amber-100",
      textColor: "text-amber-600"
    },
    {
      title: "Cadastrar Despesa",
      icon: <Wallet className="h-6 w-6" />,
      description: "Adicione uma nova despesa",
      link: "/register-expense",
      color: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "Relatórios",
      icon: <BarChart3 className="h-6 w-6" />,
      description: "Visualize relatórios",
      link: "/report",
      color: "bg-purple-100",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-6 w-6 text-poker-gold" />
            <h1 className="text-2xl font-bold text-poker-text-dark">Dashboard</h1>
          </div>
          <p className="text-[#5a5a5a]">Bem-vindo ao seu sistema de gestão de poker</p>
        </div>
        
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard 
            title="Clubes"
            value={clubs.length.toString()}
            icon={<Building2 size={24} />}
          />
          <SummaryCard 
            title="Torneios"
            value={tournaments.length.toString()}
            icon={<Trophy size={24} />}
          />
          <SummaryCard 
            title="Total de Despesas"
            value={formattedTotal}
            icon={<Wallet size={24} />}
          />
        </div>
        
        {/* Menu Cards */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Menu Rápido</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {menuItems.map((item, index) => (
                <Link to={item.link} key={index}>
                  <div className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-poker-gold transition-all cursor-pointer">
                    <div className={`${item.color} ${item.textColor} p-3 rounded-full mr-4`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
