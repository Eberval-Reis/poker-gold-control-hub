
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tournament } from '@/lib/supabase';
import { TournamentPerformanceFormData } from '../TournamentPerformanceFormSchema';

interface TournamentFieldProps {
  form: UseFormReturn<TournamentPerformanceFormData>;
  tournaments: Tournament[];
  onTournamentChange: (tournamentId: string) => void;
}

const TournamentField = ({ form, tournaments, onTournamentChange }: TournamentFieldProps) => {
  // Handle tournament selection changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'tournament_id' && value.tournament_id) {
        onTournamentChange(value.tournament_id as string);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, onTournamentChange]);

  return (
    <FormField
      control={form.control}
      name="tournament_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Torneio*</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onTournamentChange(value);
              }} 
              value={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o torneio" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((tournament) => (
                  <SelectItem key={tournament.id} value={tournament.id}>
                    {tournament.name}
                    {tournament.date && ` (${tournament.date})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TournamentField;
