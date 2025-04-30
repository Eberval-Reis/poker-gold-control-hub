
import React from 'react';
import { Trophy, Building, Calendar, Clock, BarChart } from 'lucide-react';
import { format } from 'date-fns';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { TournamentFormData, tournamentTypes } from './TournamentFormSchema';
import { clubService } from '@/services/club.service';

interface BasicInformationSectionProps {
  form: UseFormReturn<TournamentFormData>;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({ form }) => {
  // Fetch clubs from Supabase
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: clubService.getClubs,
  });
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-poker-text-dark">Informações Básicas</h2>
      
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-poker-gold" />
                Data*
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-[#8b0000]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-poker-gold" />
                Hora*
              </FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  placeholder="HH:mm"
                />
              </FormControl>
              <FormMessage className="text-[#8b0000]" />
            </FormItem>
          )}
        />
      </div>

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
