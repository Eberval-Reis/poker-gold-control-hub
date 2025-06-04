import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
import { clubService } from '@/services/club.service';
import { Club } from '@/integrations/supabase/types';

const ClubList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { data: clubs, isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: clubService.getClubs,
  });

  const { mutate: deleteClub, isLoading: isDeleting } = useMutation({
    mutationFn: clubService.deleteClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast.success('Clube excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir clube: ${error.message}`);
    },
  });

  const handleDelete = (id: string) => {
    deleteClub(id);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar />
      <Header onMenuClick={toggleSidebar} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-poker-text-dark">Clubes</h1>
            <p className="text-gray-600">Gerencie os clubes de poker</p>
          </div>
          <Button
            onClick={() => navigate('/register-club')}
            className="bg-poker-gold hover:bg-poker-gold/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Clube
          </Button>
        </div>

        {isLoading ? (
          <p>Carregando clubes...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs?.map((club) => (
              <Card key={club.id} className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {club.name}
                    {club.is_active && (
                      <Badge variant="secondary">Ativo</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    <span className="font-semibold">Endereço:</span> {club.address}
                  </p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/register-club/${club.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={isDeleting}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação irá excluir o clube permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(club.id)}>
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
        )}
      </div>
    </div>
  );
};

export default ClubList;
