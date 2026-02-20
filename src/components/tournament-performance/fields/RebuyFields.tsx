
import { useEffect } from 'react';
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

interface RebuyFieldsProps {
  form: UseFormReturn<TournamentPerformanceFormData>;
}

const RebuyFields = ({ form }: RebuyFieldsProps) => {
  // Calculate total rebuy value
  const rebuyAmount = form.watch('rebuy_amount');
  const rebuyQuantity = form.watch('rebuy_quantity');
  
  const rebuyAmountValue = parseFloat(rebuyAmount || '0');
  const rebuyQuantityValue = parseInt(rebuyQuantity || '0');
  const totalRebuy = rebuyAmountValue * rebuyQuantityValue;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="rebuy_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor do Rebuy (R$)</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
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

        <FormField
          control={form.control}
          name="rebuy_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Rebuys</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="0"
                  placeholder="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Total rebuys calculated field */}
      <div className="mt-2">
        <div className="text-sm font-medium">Total em Rebuys:</div>
        <div className="p-2 bg-muted rounded flex items-center">
          <span className="text-foreground font-medium">R$ {totalRebuy.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default RebuyFields;
