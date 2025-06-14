import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Building, Plus, Pencil, Trash2, Search } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';
import { clubService } from '@/services/club.service';
import { Club } from '@/lib/supabase';

const ClubList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch clubs
  const { data: clubs = [], isLoading, error } = useQuery({
    queryKey: ['clubs'],
    queryFn: clubService.getClubs,
  });
  
  // Delete club mutation
  const deleteClub = useMutation({
    mutationFn: (id: string) => clubService.deleteClub(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast({
        title: "Clube removido com sucesso!",
        description: "Os dados foram excluídos.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao remover clube",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    },
  });
  
  // Filter clubs based on search term
  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    club.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDelete = (id: string) => {
    deleteClub.mutate(id);
  };
  
  return (
    // Removido tudo relacionado ao Sidebar e Header antigos - mantém apenas o conteúdo principal
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
          <h1 className="text-2xl font-bold text-poker-text-dark">Clubes de Poker</h1>
        </div>
        <p className="text-[#5a5a5a]">
          Gerencie seus clubes e sedes de poker
        </p>
      </div>
      
      {/* Actions Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por nome ou local..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Add New Button */}
        <Button
          className="bg-poker-gold hover:bg-poker-gold/90 text-poker-text-light gap-2 w-full md:w-auto"
          onClick={() => navigate('/register-club')}
        >
          <Plus size={18} />
          Novo Clube
        </Button>
      </div>
      
      {/* Club List */}
      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Carregando clubes...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center p-8">
          <p className="text-red-500">Erro ao carregar clubes</p>
        </div>
      ) : filteredClubs.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <Building className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Nenhum clube encontrado</h3>
          <p className="mt-2 text-gray-500">
            {searchTerm 
              ? "Nenhum clube corresponde à sua busca. Tente outros termos." 
              : "Você ainda não tem nenhum clube cadastrado."}
          </p>
          {!searchTerm && (
            <Button 
              className="mt-4 bg-poker-gold hover:bg-poker-gold/90"
              onClick={() => navigate('/register-club')}
            >
              Cadastrar Clube
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClubs.map((club) => (
                <TableRow key={club.id}>
                  <TableCell className="font-medium">{club.name}</TableCell>
                  <TableCell>{club.location}</TableCell>
                  <TableCell>{club.contact_person || 'Não informado'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-blue-600"
                        onClick={() => navigate(`/register-club/${club.id}`)}
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
                              Tem certeza que deseja excluir o clube <strong>{club.name}</strong>?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600"
                              onClick={() => handleDelete(club.id)}
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

export default ClubList;
