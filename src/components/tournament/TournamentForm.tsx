import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import BasicInformationSection from '@/components/tournament/BasicInformationSection';
import TournamentStructureSection from '@/components/tournament/TournamentStructureSection';
import AdditionalDetailsSection from '@/components/tournament/AdditionalDetailsSection';
import FormActions from '@/components/tournament/FormActions';
import { TournamentFormData, tournamentFormSchema } from '@/components/tournament/TournamentFormSchema';
import { tournamentService } from '@/services/tournament.service';
import { clubService } from '@/services/club.service';
import { Tournament } from '@/lib/supabase';

interface TournamentFormProps {
  tournamentId?: string;
  tournamentData?: Tournament | null;
  isLoading?: boolean;
}

const TournamentForm: React.FC<TournamentFormProps> = ({
  tournamentId,
  tournamentData: propTournamentData,
  isLoading: propIsLoading = false
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!tournamentId;

  // Fetch tournament data if editing
  const { data: fetchedTournamentData, isLoading: isFetchingData } = useQuery({
    queryKey: ['tournament', tournamentId],
    queryFn: () => tournamentId ? tournamentService.getTournamentById(tournamentId) : Promise.resolve(null),
    enabled: !!tournamentId, // Only run if editing
  });

  // Adicione useQuery para os clubes
  const { data: clubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: clubService.getClubs,
  });

  // Helper to ensure only valid UUID strings for club_id and event_id
  function normalizeUuid(val: string | undefined | null): string | null {
    if (!val) return null;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(val) ? val : null;
  }

  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: '',
      club_id: '',
      event_id: '',
      type: '',
      initial_stack: '',
      blind_structure: '',
      buyin_amount: '',
      rebuy_amount: '',
      addon_amount: '',
    },
  });

  React.useEffect(() => {
    const data = isEditing ? fetchedTournamentData : propTournamentData;
    if (data && !clubsLoading) {
      // Defensive: ensure reset never provides "regular-clube" or a non-uuid to event_id
      let safeEventId = data.event_id;
      if (!safeEventId || safeEventId === "regular-clube") safeEventId = '';
      let safeClubId = data.club_id;
      // allow empty string for unselected, but never a non-uuid string
      const safeClubIdValue =
        normalizeUuid(safeClubId) || '';
      form.reset({
        name: data.name || '',
        club_id: safeClubIdValue,
        event_id: normalizeUuid(safeEventId) || '',
        type: data.type || '',
        initial_stack: data.initial_stack || '',
        blind_structure: data.blind_structure || '',
        buyin_amount: data.buyin_amount?.toString() || '',
        rebuy_amount: data.rebuy_amount?.toString() || '',
        addon_amount: data.addon_amount?.toString() || '',
      });
    }
  }, [fetchedTournamentData, propTournamentData, isEditing, form, clubsLoading]);

  const mutation = useMutation({
    mutationFn: (data: TournamentFormData) => {
      // Defensive: only send valid UUIDs, else null
      const formattedData = {
        ...data,
        club_id: normalizeUuid(data.club_id) || '', // still required field
        // event_id: send null if "regular-clube", "", or not a UUID
        event_id: (data.event_id && normalizeUuid(data.event_id))
          ? data.event_id
          : null,
        name: data.name,
        type: data.type,
        initial_stack: data.initial_stack,
        blind_structure: data.blind_structure,
        buyin_amount: data.buyin_amount ? parseFloat(data.buyin_amount) : undefined,
        rebuy_amount: data.rebuy_amount ? parseFloat(data.rebuy_amount) : undefined,
        addon_amount: data.addon_amount ? parseFloat(data.addon_amount) : undefined,
      };

      return isEditing
        ? tournamentService.updateTournament(tournamentId as string, formattedData)
        : tournamentService.createTournament(formattedData);
    },
    onSuccess: () => {
      toast({
        title: `Torneio ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
        description: "Os dados foram salvos.",
      });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      navigate('/tournaments');
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} torneio`,
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    },
  });

  const useStandardStructure = () => {
    form.setValue('blind_structure', '1: 25/50, 2: 50/100, 3: 75/150, 4: 100/200, 5: 150/300...');
  };

  const onSubmit = (data: TournamentFormData) => {
    // Defensive: Don't allow submit without a club_id UUID, for clarity for users
    if (!normalizeUuid(data.club_id || '')) {
      toast({
        variant: "destructive",
        title: "Clube inválido",
        description: "Selecione um clube válido.",
      });
      return;
    }
    mutation.mutate(data);
  };

  // Show loading until data is fetched
  if (propIsLoading || isFetchingData || clubsLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInformationSection form={form} clubsLoaded={!clubsLoading} />
        <TournamentStructureSection form={form} useStandardStructure={useStandardStructure} />
        <AdditionalDetailsSection form={form} />
        {/* Form Actions */}
        <FormActions isEditing={isEditing} isPending={mutation.isPending} onCancel={() => navigate('/tournaments')} />
      </form>
    </Form>
  );
};

export default TournamentForm;
