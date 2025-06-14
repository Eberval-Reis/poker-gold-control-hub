import React from 'react';
import { Trophy, Building, BarChart, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TournamentFormData, tournamentTypes } from './TournamentFormSchema';
import { clubService } from '@/services/club.service';
import { useAgendaEventList } from '@/hooks/useAgendaEventList';
import { QuickEventModal } from '@/components/schedule/QuickEventModal';

interface BasicInformationSectionProps {
  form: UseFormReturn<TournamentFormData>;
}

const BASIC_EVENT_DEFAULT = { id: 'regular-clube', name: 'Regular Clube' };

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({ form }) => {
  // Fetch clubs from Supabase
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: clubService.getClubs,
  });

  // Eventos da agenda
  const { events: agendaEvents, loading: loadingAgenda } = useAgendaEventList();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [localEvents, setLocalEvents] = React.useState([
    BASIC_EVENT_DEFAULT,
    ...agendaEvents,
  ]);

  // Atualiza a lista local de eventos quando vêm do hook
  React.useEffect(() => {
    setLocalEvents([
      BASIC_EVENT_DEFAULT,
      ...agendaEvents.filter(ev => ev.id !== BASIC_EVENT_DEFAULT.id),
    ]);
  }, [agendaEvents]);

  // Lógica para adicionar novo evento localmente
  const handleAddEvent = (novoEvento: { nome: string; data: string; cidade: string }) => {
    const newEvent = {
      id: `${Date.now()}`, // Pode substituir por ID real quando retornar do banco
      name: novoEvento.nome,
    };
    setLocalEvents((prev) => [...prev, newEvent]);
    // Define o evento recém-criado como selecionado
    form.setValue('event_id', newEvent.id);
  };

  // Por padrão, seleciona o "Regular Clube" no primeiro render
  React.useEffect(() => {
    // Só atribui se ainda não houver valor explicitamente
    if (!form.getValues('event_id')) {
      form.setValue('event_id', BASIC_EVENT_DEFAULT.id);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-poker-text-dark">Informações Básicas</h2>

      {/* Evento da agenda + botão novo */}
      <div className="flex items-end gap-2">
        <FormField
          control={form.control}
          name="event_id"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="flex items-center gap-2">
                Evento
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={loadingAgenda}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingAgenda ? "Carregando..." : "Selecione um evento"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {localEvents.map((ev) => (
                    <SelectItem key={ev.id} value={ev.id}>
                      {ev.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="outline"
          type="button"
          size="icon"
          className="mt-8 mb-2 border-poker-gold text-poker-gold"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <QuickEventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAddEvent={handleAddEvent}
      />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-poker-gold" />
              Nome do Torneio*
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage className="text-[#8b0000]" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="club_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Building className="h-4 w-4 text-poker-gold" />
              Clube/Sede*
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um clube"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clubs.map((club) => (
                  <SelectItem key={club.id} value={club.id}>
                    {club.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-[#8b0000]" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-poker-gold" />
              Tipo de Torneio*
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tournamentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-[#8b0000]" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInformationSection;
