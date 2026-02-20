
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TournamentFormData } from './TournamentFormSchema';

interface TournamentStructureSectionProps {
  form: UseFormReturn<TournamentFormData>;
  useStandardStructure: () => void;
}

const TournamentStructureSection: React.FC<TournamentStructureSectionProps> = ({ 
  form, 
  useStandardStructure 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Estrutura do Torneio</h2>
      
      <FormField
        control={form.control}
        name="initial_stack"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stack Inicial</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Ex: 20000"
                {...field}
                className="border-border"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="blind_structure"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Níveis de Blinds</FormLabel>
              <Button 
                type="button" 
                variant="outline" 
                onClick={useStandardStructure}
                className="h-8 text-xs border-poker-gold text-poker-gold hover:bg-poker-gold/10"
              >
                Usar Estrutura Padrão
              </Button>
            </div>
            <FormControl>
              <Textarea
                placeholder="Descreva os níveis de blinds"
                {...field}
                className="border-border"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default TournamentStructureSection;
