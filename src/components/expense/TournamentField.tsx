
import React from 'react';
import { format, isValid } from 'date-fns';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ExpenseFormData } from './ExpenseFormSchema';

interface TournamentFieldProps {
  form: UseFormReturn<ExpenseFormData>;
  tournaments: any[];
}

const TournamentField = ({ form, tournaments }: TournamentFieldProps) => {
  // Helper function to safely format dates
  const safeFormatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'dd/MM/yyyy') : 'Data inválida';
  };

  return (
    <FormField
      control={form.control}
      name="tournament_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Torneio Relacionado (opcional)</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Vincular a um torneio específico" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {tournaments.map((tournament: any) => (
                <SelectItem key={tournament.id} value={tournament.id}>
                  {tournament.name} - {safeFormatDate(tournament.date)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TournamentField;
