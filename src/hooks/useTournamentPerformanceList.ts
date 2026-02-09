
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { tournamentPerformanceService } from '@/services/tournament-performance.service';

export const useTournamentPerformanceList = () => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: performances = [], isLoading, refetch } = useQuery({
    queryKey: ['tournament-performances'],
    queryFn: tournamentPerformanceService.getPerformances,
  });

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await tournamentPerformanceService.deletePerformance(deleteId);
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

  return {
    performances,
    isLoading,
    deleteId,
    setDeleteId,
    handleDeleteClick,
    handleDelete,
    refetch,
  };
};
