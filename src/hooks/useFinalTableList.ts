
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { finalTableService, FinalTablePerformance } from '@/services/final-table.service';

export const useFinalTableList = () => {
  const [filters, setFilters] = useState({
    tournament: '',
    buyin: '',
    position: ''
  });

  const { data: performances = [], isLoading, error } = useQuery({
    queryKey: ['final-table-performances'],
    queryFn: finalTableService.getFinalTablePerformances,
  });

  const filteredPerformances = useMemo(() => {
    return performances.filter((performance) => {
      // Filtro por torneio
      if (filters.tournament && !performance.tournaments?.name?.toLowerCase().includes(filters.tournament.toLowerCase())) {
        return false;
      }

      // Filtro por buy-in
      if (filters.buyin && performance.buyin_amount !== parseFloat(filters.buyin)) {
        return false;
      }

      // Filtro por colocação
      if (filters.position && performance.position !== parseInt(filters.position)) {
        return false;
      }

      return true;
    });
  }, [performances, filters]);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      tournament: '',
      buyin: '',
      position: ''
    });
  };

  return {
    performances: filteredPerformances,
    allPerformances: performances,
    isLoading,
    error,
    filters,
    updateFilter,
    clearFilters
  };
};
