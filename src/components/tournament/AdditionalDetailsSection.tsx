
import React from 'react';
import { Award, FileText } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { TournamentFormData } from './TournamentFormSchema';

interface AdditionalDetailsSectionProps {
  form: UseFormReturn<TournamentFormData>;
}

const AdditionalDetailsSection: React.FC<AdditionalDetailsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-poker-text-dark">Detalhes Adicionais</h2>
      
      <FormField
        control={form.control}
        name="prizes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Award className="h-4 w-4 text-poker-gold" />
              Prêmios
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descrição dos prêmios"
                {...field}
                className="border-[#a0a0a0]"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-poker-gold" />
              Observações
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Informações extras sobre o torneio"
                {...field}
                className="border-[#a0a0a0]"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdditionalDetailsSection;
