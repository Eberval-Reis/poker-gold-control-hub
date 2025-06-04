import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { tournamentService } from '@/services/tournament.service';
import { Tournament } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TournamentList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: tournaments, isLoading, error } = useQuery({
    queryKey: ['tournaments'],
    queryFn: tournamentService.getTournaments,
  });

  const { mutate: deleteTournament, isLoading: isDeleting } = useMutation({
    mutationFn: tournamentService.deleteTournament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Torneio excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir torneio: ${error.message}`);
    },
  });

  const handleDelete = (id: string) => {
    deleteTournament(id);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-poker-background">
        <Header onMenuClick={toggleSidebar} />
        <Sidebar />
        <div className="max-w-7xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Carregando Torneios...</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Aguarde enquanto os torneios são carregados.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-poker-background">
        <Header onMenuClick={toggleSidebar} />
        <Sidebar />
        <div className="max-w-7xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Erro ao Carregar Torneios</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ocorreu um erro ao carregar os torneios: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-poker-background">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-poker-text-dark">Torneios</h1>
            <p className="text-gray-600">Gerencie seus torneios</p>
          </div>
          <Button
            onClick={() => navigate('/register-tournament')}
            className="bg-poker-gold hover:bg-poker-gold/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Torneio
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tournaments?.map((tournament) => (
            <Card key={tournament.id} className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {tournament.name}
                  <Badge variant="secondary">
                    {tournament.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>
                    <Calendar className="h-4 w-4 inline-block mr-1" />
                    {format(new Date(tournament.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                  <p>
                    <MapPin className="h-4 w-4 inline-block mr-1" />
                    {tournament.club_name}
                  </p>
                  <p>
                    <Users className="h-4 w-4 inline-block mr-1" />
                    {tournament.seats}
                  </p>
                  <p>
                    <DollarSign className="h-4 w-4 inline-block mr-1" />
                    {tournament.buy_in}
                  </p>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/register-tournament/${tournament.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={isDeleting}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação irá excluir o torneio permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(tournament.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentList;
