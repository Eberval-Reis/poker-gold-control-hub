
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

interface AddonFieldsProps {
  form: UseFormReturn<TournamentPerformanceFormData>;
}

const AddonFields = ({ form }: AddonFieldsProps) => {
  const addonEnabled = form.watch('addon_enabled');

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="addon_enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0">
              <FormLabel>Add-on?</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {addonEnabled && (
        <FormField
          control={form.control}
          name="addon_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor do Add-on (R$)</FormLabel>
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
      )}
    </div>
  );
};

export default AddonFields;
