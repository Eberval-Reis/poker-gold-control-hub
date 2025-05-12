
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Tournament } from '@/lib/supabase';

interface TournamentFormProps {
  tournamentId?: string;
  tournamentData?: Tournament | null;
  isLoading?: boolean;
}

const TournamentForm: React.FC<TournamentFormProps> = ({ 
  tournamentId, 
  tournamentData, 
  isLoading = false 
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!tournamentId;
  
  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: '',
      club_id: '',
      type: '',
      initial_stack: '',
      blind_structure: '',
      prizes: '',
      notes: '',
    },
  });

  // Set form values if tournament data is available
  React.useEffect(() => {
    if (tournamentData) {
      form.reset({
        name: tournamentData.name,
        club_id: tournamentData.club_id,
        type: tournamentData.type,
        initial_stack: tournamentData.initial_stack || '',
        blind_structure: tournamentData.blind_structure || '',
        prizes: tournamentData.prizes || '',
        notes: tournamentData.notes || '',
      });
    }
  }, [tournamentData, form]);

  // Create or update tournament mutation
  const mutation = useMutation({
    mutationFn: (data: TournamentFormData) => {
      // Format data for database storage
      const formattedData = {
        ...data,
        name: data.name,
        club_id: data.club_id,
        type: data.type,
        initial_stack: data.initial_stack,
        blind_structure: data.blind_structure,
        prizes: data.prizes,
        notes: data.notes,
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
    mutation.mutate(data);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <p>Carregando...</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicInformationSection form={form} />
            <TournamentStructureSection form={form} useStandardStructure={useStandardStructure} />
            <AdditionalDetailsSection form={form} />

            {/* Form Actions */}
            <FormActions isEditing={isEditing} isPending={mutation.isPending} onCancel={() => navigate('/tournaments')} />
          </form>
        </Form>
      )}
    </>
  );
};

export default TournamentForm;
