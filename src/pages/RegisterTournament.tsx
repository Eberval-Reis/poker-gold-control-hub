
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BasicInformationSection from '@/components/tournament/BasicInformationSection';
import TournamentStructureSection from '@/components/tournament/TournamentStructureSection';
import AdditionalDetailsSection from '@/components/tournament/AdditionalDetailsSection';
import { TournamentFormData, tournamentFormSchema } from '@/components/tournament/TournamentFormSchema';

const RegisterTournament = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: '',
      club: '',
      time: '',
      type: '',
      initialStack: '',
      blindStructure: '',
      prizes: '',
      notes: '',
    },
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const useStandardStructure = () => {
    form.setValue('blindStructure', '1: 25/50, 2: 50/100, 3: 75/150, 4: 100/200, 5: 150/300...');
  };

  const onSubmit = (data: TournamentFormData) => {
    console.log(data);
    toast({
      title: "Torneio cadastrado com sucesso!",
      description: "Os dados foram salvos.",
    });
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
              onClick={() => navigate('/')}
              className="text-poker-gold hover:text-poker-gold/80"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-poker-text-dark">Cadastrar Torneio</h1>
          </div>
          <p className="text-[#5a5a5a]">
            Preencha os detalhes do torneio
          </p>
        </div>

        {/* Form */}
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
              >
                Salvar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1 border-poker-gold text-poker-gold hover:bg-poker-gold/10"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterTournament;
