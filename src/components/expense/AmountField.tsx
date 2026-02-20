
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Droplet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ExpenseFormData } from './ExpenseFormSchema';

interface AmountFieldProps {
  form: UseFormReturn<ExpenseFormData>;
}

const AmountField = ({ form }: AmountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-poker-gold" />
            Valor (R$)*
          </FormLabel>
          <FormControl>
            <Input
              placeholder="0,00"
              type="number"
              step="0.01"
              min="0"
              className="bg-background"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AmountField;
