
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { TournamentPerformanceFormData } from '../TournamentPerformanceFormSchema';
import ImageUploadField from './ImageUploadField';
import { confettiBurst } from '@/components/magicui/confetti';

interface ResultsFieldsProps {
  form: UseFormReturn<TournamentPerformanceFormData>;
}

const ResultsFields = ({ form }: ResultsFieldsProps) => {
  const finalTableAchieved = form.watch('final_table_achieved');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="itm_achieved"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-3">
              <div className="space-y-0">
                <FormLabel>ITM (In The Money)?</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (checked) confettiBurst();
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="final_table_achieved"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-3">
              <div className="space-y-0">
                <FormLabel>Foi FT (Final Table)?</FormLabel>
              </div>
              <FormControl>
                 <Switch
                   checked={field.value}
                   onCheckedChange={(checked) => {
                     field.onChange(checked);
                     if (checked) confettiBurst();
                   }}
                 />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colocação</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="1"
                  placeholder="Posição final"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prize_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prêmio Ganho (R$)</FormLabel>
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
      </div>

      {finalTableAchieved && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700">Informações da Final Table</h3>
          
          <ImageUploadField form={form} />

          <FormField
            control={form.control}
            name="news_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Reportagem</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://exemplo.com/reportagem"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default ResultsFields;
