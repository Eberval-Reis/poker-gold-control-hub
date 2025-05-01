
import React from 'react';
import { PaperclipIcon } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ExpenseFormData } from './ExpenseFormSchema';

interface ReceiptFieldProps {
  form: UseFormReturn<ExpenseFormData>;
  receiptFileName: string | null;
  setReceiptFileName: (name: string | null) => void;
  isEditing: boolean;
}

const ReceiptField = ({ form, receiptFileName, setReceiptFileName, isEditing }: ReceiptFieldProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File | null) => void) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setReceiptFileName(file.name);
      onChange(file);
    }
  };

  return (
    <FormField
      control={form.control}
      name="receipt"
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <PaperclipIcon className="h-4 w-4 text-poker-gold" />
            Comprovante (opcional)
          </FormLabel>
          <FormControl>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="bg-white"
                onClick={() => document.getElementById('receipt-upload')?.click()}
              >
                {isEditing && receiptFileName ? 'Trocar comprovante' : 'Anexar Foto/PDF'}
              </Button>
              {receiptFileName && (
                <span className="text-sm text-muted-foreground">
                  {receiptFileName}
                </span>
              )}
              <Input
                id="receipt-upload"
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e, onChange)}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ReceiptField;
