import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, TrendingUp, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Tournament } from '@/lib/supabase';
import { tournamentService } from '@/services/tournament.service';

const TournamentList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tournaments, type as Tournament[]
  const { data: tournaments = [], isLoading, error } = useQuery<Tournament[]>({
    queryKey: ['tournaments'],
    queryFn: tournamentService.getTournaments,
  });

  // Delete tournament mutation
  const deleteTournament = useMutation({
    mutationFn: (id: string) => tournamentService.deleteTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast({
        title: "Torneio removido com sucesso!",
        description: "Os dados foram excluídos.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao remover torneio",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    },
  });

  // Filter tournaments based on search term
  const filteredTournaments = tournaments.filter((tournament) => 
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tournament.clubs?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteTournament.mutate(id);
  };

  return (
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
          <h1 className="text-2xl font-bold text-poker-text-dark">Torneios de Poker</h1>
        </div>
        <p className="text-[#5a5a5a]">
          Gerencie seus torneios e competições
        </p>
      </div>
      
      {/* Actions Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por nome ou tipo..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Add New Button */}
        <Button
          className="bg-poker-gold hover:bg-poker-gold/90 text-poker-text-light gap-2 w-full md:w-auto"
          onClick={() => navigate('/register-tournament')}
        >
          <Plus size={18} />
          Novo Torneio
        </Button>
      </div>
      
      {/* Tournament List */}
      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Carregando torneios...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center p-8">
          <p className="text-red-500">Erro ao carregar torneios</p>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <TrendingUp className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Nenhum torneio encontrado</h3>
          <p className="mt-2 text-gray-500">
            {searchTerm 
              ? "Nenhum torneio corresponde à sua busca. Tente outros termos." 
              : "Você ainda não tem nenhum torneio cadastrado."}
          </p>
          {!searchTerm && (
            <Button 
              className="mt-4 bg-poker-gold hover:bg-poker-gold/90"
              onClick={() => navigate('/register-tournament')}
            >
              Cadastrar Torneio
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Clube</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTournaments.map((tournament) => (
                <TableRow key={tournament.id}>
                  <TableCell className="font-medium">{tournament.name}</TableCell>
                  <TableCell>{tournament.clubs?.name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-poker-gold/10 text-poker-gold border-poker-gold/30">
                      {tournament.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-blue-600"
                        onClick={() => navigate(`/register-tournament/${tournament.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o torneio <strong>{tournament.name}</strong>?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600"
                              onClick={() => handleDelete(tournament.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TournamentList;
