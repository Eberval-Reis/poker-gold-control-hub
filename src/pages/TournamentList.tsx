
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, TrendingUp, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { usePagination } from '@/hooks/usePagination';
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
import { tournamentService, UniqueTournament } from '@/services/tournament.service';

const TournamentList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch unique tournaments
  const { data: tournaments = [], isLoading, error } = useQuery<UniqueTournament[]>({
    queryKey: ['unique-tournaments'],
    queryFn: tournamentService.getUniqueTournaments,
  });

  // Delete tournament mutation
  const deleteTournament = useMutation({
    mutationFn: (id: string) => tournamentService.deleteTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unique-tournaments'] });
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

  const pagination = usePagination(filteredTournaments, 10);

  const handleDelete = (id: string) => {
    deleteTournament.mutate(id);
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full flex flex-col p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 md:mb-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-poker-gold hover:text-poker-gold/80 flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Torneios de Poker</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Gerencie seus torneios e competições
          </p>
        </div>
        
        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4 md:mb-6 flex-shrink-0">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou tipo..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Add New Button */}
          <Button
            className="bg-poker-gold hover:bg-poker-gold/90 text-poker-text-light gap-2 flex-shrink-0"
            onClick={() => navigate('/register-tournament')}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Novo Torneio</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
        
        {/* Tournament List */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Carregando torneios...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center p-8">
              <p className="text-red-500">Erro ao carregar torneios</p>
            </div>
          ) : filteredTournaments.length === 0 ? (
            <div className="text-center p-6 md:p-8 bg-card rounded-lg shadow">
              <TrendingUp className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-base md:text-lg font-medium text-foreground">Nenhum torneio encontrado</h3>
              <p className="mt-2 text-muted-foreground text-sm md:text-base">
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
            <div className="bg-card rounded-lg shadow h-full flex flex-col overflow-hidden">
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead className="w-[30%] min-w-[120px]">Nome</TableHead>
                      <TableHead className="w-[20%] min-w-[100px] hidden md:table-cell">Clube</TableHead>
                      <TableHead className="w-[15%] min-w-[80px]">Tipo</TableHead>
                      <TableHead className="w-[15%] min-w-[80px] hidden sm:table-cell">Jogos</TableHead>
                      <TableHead className="w-[20%] min-w-[90px] text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagination.paginatedData.map((tournament) => (
                      <TableRow key={tournament.id}>
                        <TableCell className="font-medium">
                          <div className="truncate pr-2">{tournament.name}</div>
                          <div className="md:hidden text-xs text-muted-foreground mt-1 truncate">
                            {tournament.clubs?.name || 'Clube não especificado'}
                          </div>
                          {tournament.occurrences > 1 && (
                            <div className="sm:hidden">
                              <Badge variant="secondary" className="text-xs mt-1">
                                {tournament.occurrences} jogos
                              </Badge>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="truncate pr-2">{tournament.clubs?.name || 'Clube não especificado'}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-poker-gold/10 text-poker-gold border-poker-gold/30 text-xs whitespace-nowrap">
                            {tournament.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {tournament.occurrences}
                            </Badge>
                            {tournament.averageBuyin && (
                              <span className="text-xs text-muted-foreground">
                                R$ {tournament.averageBuyin.toFixed(0)} médio
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                              onClick={() => navigate(`/register-tournament/${tournament.id}`)}
                            >
                              <Pencil className="h-3 w-3" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span className="sr-only">Excluir</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o torneio <strong>{tournament.name}</strong>?
                                    {tournament.occurrences > 1 && (
                                      <span className="block mt-2 text-amber-600">
                                        ⚠️ Este torneio possui {tournament.occurrences} ocorrências cadastradas. Apenas esta será excluída.
                                      </span>
                                    )}
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
              
              {filteredTournaments.length > 0 && (
                <div className="border-t p-4 flex-shrink-0">
                  <PaginationControls pagination={pagination} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentList;
