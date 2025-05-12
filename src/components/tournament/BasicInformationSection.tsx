
import React from 'react';
import { Trophy, Building, BarChart } from 'lucide-react';
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
