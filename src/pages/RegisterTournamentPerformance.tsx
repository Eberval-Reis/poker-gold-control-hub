
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TournamentPerformanceForm from '@/components/tournament-performance/TournamentPerformanceForm';

const RegisterTournamentPerformance = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-2xl font-bold text-foreground">
              {id ? 'Editar Movimento do Torneio' : 'Registrar Movimento do Torneio'}
            </h1>
          </div>
          <p className="text-muted-foreground">Registre todos os gastos e ganhos do torneio</p>
        </div>

        <TournamentPerformanceForm />
      </div>
    </div>
  );
};

export default RegisterTournamentPerformance;
