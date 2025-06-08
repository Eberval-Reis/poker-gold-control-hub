import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

import { tournamentPerformanceFormSchema, TournamentPerformanceFormData, calculateTotalInvested, calculateProfitLoss, calculateROI } from '../TournamentPerformanceFormSchema';
import { tournamentPerformanceService } from '@/services/tournament-performance.service';
import { tournamentService } from '@/services/tournament.service';
import { TournamentPerformance, Tournament } from '@/lib/supabase';

export function useTournamentPerformanceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [financialSummary, setFinancialSummary] = useState({
    totalInvested: 0,
    profitLoss: 0,
    roi: 0
  });
  
  const form = useForm<TournamentPerformanceFormData>({
    resolver: zodResolver(tournamentPerformanceFormSchema),
    defaultValues: {
      tournament_id: '',
      buyin_amount: '',
      rebuy_amount: '',
      rebuy_quantity: '',
      addon_enabled: false,
      addon_amount: '',
      itm_achieved: false,
      final_table_achieved: false,
      position: '',
      prize_amount: '',
      ft_photo_url: '',
      news_link: '',
    },
  });

  // Watch form values for calculations
  const buyinAmount = form.watch('buyin_amount');
  const rebuyAmount = form.watch('rebuy_amount');
  const rebuyQuantity = form.watch('rebuy_quantity');
  const addonEnabled = form.watch('addon_enabled');
  const addonAmount = form.watch('addon_amount');
  const prizeAmount = form.watch('prize_amount');
  const itmAchieved = form.watch('itm_achieved');
  
  // Recalculate financial summary when relevant values change
  useEffect(() => {
    const buyinNum = parseFloat(buyinAmount || '0');
    const rebuyAmountNum = parseFloat(rebuyAmount || '0');
    const rebuyQtyNum = parseInt(rebuyQuantity || '0');
    const addonAmountNum = parseFloat(addonAmount || '0');
    const prizeAmountNum = parseFloat(prizeAmount || '0');
    
    const totalInvested = calculateTotalInvested(
      buyinNum,
      rebuyAmountNum || undefined,
      rebuyQtyNum || undefined,
      addonEnabled,
      addonAmountNum || undefined
    );
    
    const profitLoss = calculateProfitLoss(prizeAmountNum || 0, totalInvested);
    const roi = calculateROI(profitLoss, totalInvested);
    
    setFinancialSummary({
      totalInvested,
      profitLoss,
      roi
    });
  }, [buyinAmount, rebuyAmount, rebuyQuantity, addonEnabled, addonAmount, prizeAmount]);
  
  // Fetch tournaments for dropdown with club information
  const { data: tournaments = [] } = useQuery({
    queryKey: ['tournaments'],
    queryFn: tournamentService.getTournaments,
  });
  
  // Get performance data if editing
  const { data: performanceData, isLoading: isLoadingPerformance, error: performanceError } = useQuery({
    queryKey: ['tournament-performance', id],
    queryFn: () => tournamentPerformanceService.getTournamentPerformanceById(id as string),
    enabled: !!id,
  });

  // Effect to handle performance data loading
  useEffect(() => {
    if (performanceData && tournaments.length > 0) {
      console.log('Loading performance data:', performanceData);
      console.log('Available tournaments:', tournaments);
      
      // Find the tournament in the tournaments list using the tournament_id
      const tournament = tournaments.find(t => t.id === performanceData.tournament_id);
      console.log('Found tournament:', tournament);
      
      if (tournament) {
        setSelectedTournament(tournament);
      } else {
        // If tournament not found in the list, create a temporary one from the performance data
        if (performanceData.tournaments) {
          const tempTournament: Tournament = {
            id: performanceData.tournament_id,
            name: performanceData.tournaments.name || 'Torneio não especificado',
            club_id: '', // We don't have this from the performance data
            type: '', // We don't have this either
            clubs: performanceData.tournaments.clubs,
            // ... other tournament fields with defaults
          };
          setSelectedTournament(tempTournament);
        }
      }
      
      form.reset({
        tournament_id: performanceData.tournament_id,
        buyin_amount: performanceData.buyin_amount?.toString() || '',
        rebuy_amount: performanceData.rebuy_amount?.toString() || '',
        rebuy_quantity: performanceData.rebuy_quantity?.toString() || '',
        addon_enabled: performanceData.addon_enabled || false,
        addon_amount: performanceData.addon_amount?.toString() || '',
        itm_achieved: performanceData.itm_achieved || false,
        final_table_achieved: performanceData.final_table_achieved || false,
        position: performanceData.position?.toString() || '',
        prize_amount: performanceData.prize_amount?.toString() || '',
        ft_photo_url: performanceData.ft_photo_url || '',
        news_link: performanceData.news_link || '',
      });
    }
  }, [performanceData, tournaments, form]);

  // Effect to handle performance loading errors
  useEffect(() => {
    if (performanceError) {
      console.error('Error loading performance data:', performanceError);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados do desempenho",
        description: performanceError instanceof Error ? performanceError.message : "Ocorreu um erro desconhecido.",
      });
      navigate('/tournament-performances');
    }
  }, [performanceError, navigate]);

  // Create or update performance mutation
  const mutation = useMutation({
    mutationFn: (data: TournamentPerformanceFormData) => {
      console.log('Submitting performance data:', data);
      
      // Convert form data to database format
      const performanceData: Partial<TournamentPerformance> = {
        tournament_id: data.tournament_id,
        buyin_amount: parseFloat(data.buyin_amount),
        rebuy_amount: data.rebuy_amount ? parseFloat(data.rebuy_amount) : null,
        rebuy_quantity: data.rebuy_quantity ? parseInt(data.rebuy_quantity) : 0,
        addon_enabled: data.addon_enabled,
        addon_amount: data.addon_amount ? parseFloat(data.addon_amount) : null,
        itm_achieved: data.itm_achieved,
        final_table_achieved: data.final_table_achieved,
        position: data.position ? parseInt(data.position) : null,
        prize_amount: data.prize_amount ? parseFloat(data.prize_amount) : 0,
        ft_photo_url: data.ft_photo_url || null,
        news_link: data.news_link || null,
      };
      
      return isEditing
        ? tournamentPerformanceService.updateTournamentPerformance(id as string, performanceData)
        : tournamentPerformanceService.createTournamentPerformance(performanceData);
    },
    onSuccess: () => {
      console.log('Performance saved successfully');
      toast({
        title: `Desempenho ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
        description: "Os dados foram salvos.",
      });
      queryClient.invalidateQueries({ queryKey: ['tournament-performances'] });
      queryClient.invalidateQueries({ queryKey: ['final-table-performances'] });
      navigate('/tournament-performances');
    },
    onError: (error) => {
      console.error('Error saving performance:', error);
      toast({
        variant: "destructive",
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} desempenho`,
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    },
  });

  const onSubmit = (data: TournamentPerformanceFormData) => {
    // Validation for ITM and position
    if (data.itm_achieved && !data.position) {
      form.setError('position', {
        type: 'manual',
        message: 'A colocação é obrigatória quando ITM foi alcançado'
      });
      return;
    }
    
    console.log('Submitting data:', data);
    mutation.mutate(data);
  };

  // Handle tournament selection
  const handleTournamentChange = (tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    setSelectedTournament(tournament || null);
  };
  
  return {
    form,
    financialSummary,
    isEditing,
    onSubmit,
    handleTournamentChange,
    tournaments,
    isLoadingPerformance,
    isPending: mutation.isPending
  };
}
