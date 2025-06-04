
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { TournamentResultFormData, tournamentResultFormSchema } from './TournamentResultFormSchema';
import { ClubField } from './fields/ClubField';
import { TournamentField } from './fields/TournamentField';
import { DateField } from './fields/DateField';
import { ItmFields } from './fields/ItmFields';
import { FtFields } from './fields/FtFields';
import { NewsLinkField } from './fields/NewsLinkField';

export const TournamentResultForm = () => {
  const [showNewsLink, setShowNewsLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TournamentResultFormData>({
    resolver: zodResolver(tournamentResultFormSchema),
    defaultValues: {
      club_id: '',
      tournament_id: '',
      date: '',
      itm_achieved: false,
      ft_achieved: false,
      position: undefined,
      prize_amount: undefined,
      ft_photo_url: '',
      news_link: ''
    },
  });

  const onSubmit = async (data: TournamentResultFormData) => {
    try {
      setIsSubmitting(true);

      // Prepare data for insertion - convert to match database schema
      const insertData = {
        club_id: data.club_id,
        tournament_id: data.tournament_id,
        date: data.date,
        itm_achieved: data.itm_achieved || false,
        ft_achieved: data.ft_achieved || false,
        position: data.position || null,
        prize_amount: data.prize_amount || null,
        ft_photo_url: data.ft_photo_url || null,
        news_link: data.news_link || null,
      };

      const { error } = await supabase
        .from('tournament_results')
        .insert(insertData);

      if (error) {
        console.error('Error inserting tournament result:', error);
        throw error;
      }

      toast({
        title: "Sucesso!",
        description: "Resultado do torneio registrado com sucesso.",
      });

      form.reset();
      setShowNewsLink(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar resultado do torneio. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClubField control={form.control} />
          <TournamentField control={form.control} />
        </div>

        <DateField control={form.control} />

        <ItmFields control={form.control} watch={form.watch} />

        <FtFields control={form.control} watch={form.watch} />

        {!showNewsLink && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowNewsLink(true)}
            className="w-full"
          >
            Adicionar Link de Reportagem
          </Button>
        )}

        {showNewsLink && (
          <NewsLinkField 
            control={form.control} 
            onRemove={() => {
              setShowNewsLink(false);
              form.setValue('news_link', '');
            }} 
          />
        )}

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setShowNewsLink(false);
            }}
            className="flex-1"
          >
            Limpar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Resultado'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
