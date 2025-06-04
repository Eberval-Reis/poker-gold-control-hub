
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import TournamentPerformanceForm from '@/components/tournament-performance/TournamentPerformanceForm';

const RegisterTournamentPerformance = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar />
      <Header onMenuClick={toggleSidebar} />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/tournament-performances')}
              className="text-poker-gold hover:text-poker-gold/80"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-poker-text-dark">
              {id ? 'Editar Movimento do Torneio' : 'Registrar Movimento do Torneio'}
            </h1>
          </div>
          <p className="text-gray-600">Registre todos os gastos e ganhos do torneio</p>
        </div>

        <TournamentPerformanceForm />
      </div>
    </div>
  );
};

export default RegisterTournamentPerformance;
