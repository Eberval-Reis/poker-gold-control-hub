
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BasicInformationSection from '@/components/tournament/BasicInformationSection';
import TournamentStructureSection from '@/components/tournament/TournamentStructureSection';
import AdditionalDetailsSection from '@/components/tournament/AdditionalDetailsSection';
import { TournamentFormData, tournamentFormSchema } from '@/components/tournament/TournamentFormSchema';
import { tournamentService } from '@/services/tournament.service';

const RegisterTournament = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isEditing = Boolean(id);
  
  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: '',
      club_id: '',
      time: '',
      type: '',
      initial_stack: '',
      blind_structure: '',
      prizes: '',
      notes: '',
    },
  });

  // Get tournament data if editing
  const { isLoading: isLoadingTournament } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentService.getTournamentById(id as string),
    enabled: !!id,
    onSuccess: (data) => {
      if (data) {
        form.reset({
          name: data.name,
          club_id: data.club_id,
          date: new Date(data.date),
          time: data.time,
          type: data.type,
          initial_stack: data.initial_stack || '',
          blind_structure: data.blind_structure || '',
          prizes: data.prizes || '',
          notes: data.notes || '',
        });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados do torneio",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
      navigate('/tournaments');
    },
  });

  // Create or update tournament mutation
  const mutation = useMutation({
    mutationFn: (data: TournamentFormData) => {
      // Format date for database storage
      const formattedData = {
        ...data,
        date: data.date.toISOString().split('T')[0],
      };
      
      return isEditing
        ? tournamentService.updateTournament(id as string, formattedData)
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const useStandardStructure = () => {
    form.setValue('blind_structure', '1: 25/50, 2: 50/100, 3: 75/150, 4: 100/200, 5: 150/300...');
  };

  const onSubmit = (data: TournamentFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />

      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/tournaments')}
              className="text-poker-gold hover:text-poker-gold/80"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-poker-text-dark">
              {isEditing ? 'Editar Torneio' : 'Cadastrar Torneio'}
            </h1>
          </div>
          <p className="text-[#5a5a5a]">
            {isEditing 
              ? 'Atualize os detalhes do torneio'
              : 'Preencha os detalhes do torneio'}
          </p>
        </div>

        {isLoadingTournament ? (
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
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-poker-gold hover:bg-poker-gold/90 text-white"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending 
                    ? 'Salvando...' 
                    : isEditing ? 'Atualizar' : 'Salvar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/tournaments')}
                  className="flex-1 border-poker-gold text-poker-gold hover:bg-poker-gold/10"
                  disabled={mutation.isPending}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default RegisterTournament;
