
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TournamentPerformanceFormData } from '../TournamentPerformanceFormSchema';

interface BuyinFieldProps {
  form: UseFormReturn<TournamentPerformanceFormData>;
}

const BuyinField = ({ form }: BuyinFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="buyin_amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">Valor do Buy-in* (R$)</FormLabel>
          <FormControl>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                R$
              </div>
              <Input
                {...field}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-9"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BuyinField;
