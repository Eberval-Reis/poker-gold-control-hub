
import { Control, UseFormWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { TournamentResultFormData } from '../TournamentResultFormSchema';

interface FtFieldsProps {
  control: Control<TournamentResultFormData>;
  watch: UseFormWatch<TournamentResultFormData>;
}

export const FtFields = ({ control, watch }: FtFieldsProps) => {
  const ftAchieved = watch('ft_achieved');

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="ft_achieved"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>FT (Final Table)</FormLabel>
            </div>
          </FormItem>
        )}
      />

      {ftAchieved && (
        <div className="ml-6">
          <FormField
            control={control}
            name="ft_photo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Foto da FT</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://exemplo.com/foto.jpg"
                    {...field}
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
