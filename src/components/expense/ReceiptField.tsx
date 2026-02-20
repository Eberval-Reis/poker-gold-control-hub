
import React from 'react';
import { PaperclipIcon, X } from 'lucide-react';
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

  const handleRemoveFile = (onChange: (file: null) => void) => {
    setReceiptFileName(null);
    onChange(null);
    // Reset the file input
    const fileInput = document.getElementById('receipt-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
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
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                className="bg-background"
                onClick={() => document.getElementById('receipt-upload')?.click()}
              >
                {isEditing && receiptFileName ? 'Trocar comprovante' : 'Anexar Foto/PDF'}
              </Button>
              
              {receiptFileName && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {receiptFileName}
                  </span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 w-5 p-0" 
                    onClick={() => handleRemoveFile(onChange)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
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
