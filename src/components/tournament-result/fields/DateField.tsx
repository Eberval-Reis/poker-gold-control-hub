
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TournamentResultFormData } from '../TournamentResultFormSchema';

interface DateFieldProps {
  control: Control<TournamentResultFormData>;
}

export const DateField = ({ control }: DateFieldProps) => {
  return (
    <FormField
      control={control}
      name="date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Data *</FormLabel>
          <FormControl>
            <Input 
              type="date" 
              {...field}
              className="w-full md:w-auto"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
