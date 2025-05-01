
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trophy, House } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ClubFormData } from './ClubFormSchema';

interface BasicInformationSectionProps {
  form: UseFormReturn<ClubFormData>;
}

const BasicInformationSection = ({ form }: BasicInformationSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-poker-text-dark">Dados Básicos</h2>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-poker-gold" />
              Nome do Clube*
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
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <House className="h-4 w-4 text-poker-gold" />
              Localização*
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage className="text-[#8b0000]" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInformationSection;
