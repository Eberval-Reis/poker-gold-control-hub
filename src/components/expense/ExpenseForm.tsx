
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Tag, Droplet, ArrowLeft, PaperclipIcon } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { expenseFormSchema, ExpenseFormData, expenseTypes, tournaments } from './ExpenseFormSchema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const ExpenseForm = () => {
  const navigate = useNavigate();
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      type: '',
      amount: '',
      date: new Date(),
      tournament: '',
      description: '',
      receipt: null,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File | null) => void) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setReceiptFileName(file.name);
      onChange(file);
    }
  };

  const onSubmit = (data: ExpenseFormData) => {
    console.log("Form submitted:", data);
    
    // Show success toast
    toast({
      title: "Despesa cadastrada com sucesso!",
      description: `${data.type} - R$ ${data.amount}`,
      duration: 3000,
    });
    
    // Clear form
    form.reset();
    setReceiptFileName(null);
    
    // Navigate back after short delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Type of Expense */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-poker-gold" />
                Tipo de Despesa*
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Selecione o tipo de despesa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-poker-gold" />
                Valor (R$)*
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="0,00"
                  type="number"
                  step="0.01"
                  min="0"
                  className="bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-poker-gold" />
                Data*
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-white",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tournament (optional) */}
        <FormField
          control={form.control}
          name="tournament"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Torneio Relacionado (opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Vincular a um torneio específico" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tournaments.map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description (optional) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Detalhes da despesa (ex: 'Gasolina para torneio em SP')"
                  className="bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Receipt (optional) */}
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
                    Anexar Foto/PDF
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

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" className="bg-poker-gold hover:bg-poker-gold/90">
            Salvar
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-poker-gold text-poker-gold hover:bg-poker-gold/10"
            onClick={() => navigate('/')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExpenseForm;
