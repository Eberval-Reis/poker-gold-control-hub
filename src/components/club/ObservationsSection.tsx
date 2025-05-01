
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ClubFormData } from './ClubFormSchema';

interface ObservationsSectionProps {
  form: UseFormReturn<ClubFormData>;
}

const ObservationsSection = ({ form }: ObservationsSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="observations"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observações</FormLabel>
          <FormControl>
            <Textarea
              className="border-[#a0a0a0]"
              placeholder="Digite suas observações aqui..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ObservationsSection;
