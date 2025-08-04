
import React from 'react';
import { DollarSign } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TournamentFormData } from './TournamentFormSchema';

interface AdditionalDetailsSectionProps {
  form: UseFormReturn<TournamentFormData>;
}

const AdditionalDetailsSection: React.FC<AdditionalDetailsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-poker-text-dark">Detalhes Adicionais</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="buyin_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-poker-gold" />
                Valor do Buy-in (R$)
              </FormLabel>
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rebuy_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-poker-gold" />
                Valor do Rebuy (R$)
              </FormLabel>
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addon_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-poker-gold" />
                Valor do Add-on (R$)
              </FormLabel>
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
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AdditionalDetailsSection;
