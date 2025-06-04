
import { Control, UseFormWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { TournamentResultFormData } from '../TournamentResultFormSchema';

interface ItmFieldsProps {
  control: Control<TournamentResultFormData>;
  watch: UseFormWatch<TournamentResultFormData>;
}

export const ItmFields = ({ control, watch }: ItmFieldsProps) => {
  const itmAchieved = watch('itm_achieved');

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="itm_achieved"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>ITM (In The Money)</FormLabel>
            </div>
          </FormItem>
        )}
      />

      {itmAchieved && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
          <FormField
            control={control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colocação</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Ex: 3"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="prize_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da Premiação (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ex: 1500.00"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
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
