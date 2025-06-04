
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TournamentResultFormData } from '../TournamentResultFormSchema';

interface NewsLinkFieldProps {
  control: Control<TournamentResultFormData>;
  onRemove: () => void;
}

export const NewsLinkField = ({ control, onRemove }: NewsLinkFieldProps) => {
  return (
    <FormField
      control={control}
      name="news_link"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Link de Reportagem</FormLabel>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <FormControl>
            <Input
              type="url"
              placeholder="https://exemplo.com/reportagem"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
