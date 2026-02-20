
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TournamentForm from '@/components/tournament/TournamentForm';

const RegisterTournament = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/tournaments')}
            className="text-poker-gold hover:text-poker-gold/80"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {id ? 'Editar Torneio' : 'Cadastrar Torneio'}
          </h1>
        </div>
        <p className="text-muted-foreground">Cadastre um novo torneio no sistema</p>
      </div>
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <TournamentForm tournamentId={id} />
      </div>
    </div>
  );
};

export default RegisterTournament;
