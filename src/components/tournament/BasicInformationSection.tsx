
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
  clubsLoaded?: boolean;
  isEditing?: boolean; // Indica se está em modo de edição
}

const BASIC_EVENT_DEFAULT = { id: 'regular-clube', name: 'Regular Clube' };

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({ form, clubsLoaded = true, isEditing = false }) => {
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
  const handleAddEvent = (eventoSalvo: { id: string; name: string; date?: string | null }) => {
    const newEvent = {
      id: eventoSalvo.id ?? `${Date.now()}`, // Use ID vindo do banco
      name: eventoSalvo.name,
      date: eventoSalvo.date,
    };
    setLocalEvents((prev) => [...prev, newEvent]);
    form.setValue('event_id', newEvent.id);
  };

  // Só define valor padrão se não estiver em modo de edição e campo estiver vazio
  React.useEffect(() => {
    if (!isEditing && !form.getValues('event_id')) {
      form.setValue('event_id', BASIC_EVENT_DEFAULT.id);
    }
    // eslint-disable-next-line
  }, [isEditing]);

  // Validação de club_id apenas em modo criação
  React.useEffect(() => {
    if (!isEditing && !isLoading && form.getValues('club_id')) {
      const clubExists = clubs.some(c => c.id === form.getValues('club_id'));
      if (!clubExists) {
        form.setValue('club_id', '');
      }
    }
  }, [isEditing, isLoading, clubs, form]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Informações Básicas</h2>

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

