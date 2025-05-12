
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Edit, Trash2, Plus, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { toast } from '@/hooks/use-toast';
import { tournamentPerformanceService } from '@/services/tournament-performance.service';
import { TournamentPerformance } from '@/lib/supabase';
import { calculateTotalInvested, calculateProfitLoss, calculateROI } from '@/components/tournament-performance/TournamentPerformanceFormSchema';

const TournamentPerformanceList = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'profit' | 'loss'>('all');
  
  const { data: performances = [], isLoading, refetch } = useQuery({
    queryKey: ['tournament-performances'],
    queryFn: tournamentPerformanceService.getTournamentPerformances,
  });

  // Filtered performances based on selected tab
  const filteredPerformances = performances.filter((performance) => {
    if (filter === 'all') return true;
    
    const buyinAmount = performance.buyin_amount || 0;
    const rebuyAmount = performance.rebuy_amount || 0;
    const rebuyQuantity = performance.rebuy_quantity || 0;
    const addonAmount = performance.addon_enabled ? (performance.addon_amount || 0) : 0;
    const prizeAmount = performance.prize_amount || 0;
    
    const totalInvested = buyinAmount + (rebuyAmount * rebuyQuantity) + addonAmount;
    const profitLoss = prizeAmount - totalInvested;
    
    return filter === 'profit' ? profitLoss >= 0 : profitLoss < 0;
  });

  const handleDelete = async (id: string) => {
    try {
      await tournamentPerformanceService.deleteTournamentPerformance(id);
      toast({
        title: "Desempenho excluído com sucesso",
        description: "O registro foi removido permanentemente.",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir desempenho",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    }
    setDeleteId(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-poker-text-dark">Desempenho em Torneios</h1>
            <p className="text-gray-600">Gerencie seus registros de desempenho em torneios</p>
          </div>
          <Button
            onClick={() => navigate('/register-tournament-performance')}
            className="bg-[#d4af37] text-white hover:bg-[#d4af37]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        </div>

        <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="profit">Lucro</TabsTrigger>
            <TabsTrigger value="loss">Prejuízo</TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            {isLoading ? (
              <div className="text-center py-10">Carregando...</div>
            ) : filteredPerformances.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Nenhum registro de desempenho encontrado.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPerformances.map((performance) => {
                  // Calculate financial metrics
                  const totalInvested = calculateTotalInvested(
                    performance.buyin_amount || 0,
                    performance.rebuy_amount,
                    performance.rebuy_quantity,
                    performance.addon_enabled,
                    performance.addon_amount
                  );
                  
                  const prizeAmount = performance.prize_amount || 0;
                  const profitLoss = calculateProfitLoss(prizeAmount, totalInvested);
                  const roi = calculateROI(profitLoss, totalInvested);
                  
                  // Determine color based on profit/loss
                  const resultColor = profitLoss >= 0 ? 'text-[#006400]' : 'text-[#8b0000]';

                  return (
                    <Card key={performance.id} className="overflow-hidden">
                      <div className="bg-[#d4af37]/10 p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold truncate">
                              {performance.tournaments?.name || 'Torneio não especificado'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {performance.tournaments?.clubs?.name || 'Clube não especificado'}
                            </p>
                          </div>
                          {performance.itm_achieved && (
                            <div className="flex items-center text-[#d4af37]">
                              <Trophy className="h-5 w-5" />
                              <span className="ml-1 font-medium">
                                {performance.position}º
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-gray-500">Investimento</p>
                              <p className="font-medium">R$ {totalInvested.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Prêmio</p>
                              <p className="font-medium">
                                R$ {prizeAmount.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="border-t pt-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-xs text-gray-500">Resultado</p>
                                <p className={`font-medium ${resultColor}`}>
                                  R$ {profitLoss.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">ROI</p>
                                <p className={`font-medium ${resultColor}`}>
                                  {roi.toFixed(2)}%
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-2 pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/register-tournament-performance/${performance.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(performance.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro de desempenho? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TournamentPerformanceList;
