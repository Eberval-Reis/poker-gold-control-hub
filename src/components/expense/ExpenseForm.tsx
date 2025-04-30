
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Tag, Droplet, PaperclipIcon } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';
import { expenseFormSchema, ExpenseFormData, expenseTypes } from './ExpenseFormSchema';
import { expenseService } from '@/services/expense.service';
import { tournamentService } from '@/services/tournament.service';

const ExpenseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const isEditing = Boolean(id);
  
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      type: '',
      amount: '',
      date: new Date(),
      tournament_id: '',
      description: '',
      receipt: null,
    },
  });

  // Fetch tournaments for dropdown
  const { data: tournaments = [] } = useQuery({
    queryKey: ['tournaments'],
    queryFn: tournamentService.getTournaments,
  });
  
  // Get expense data if editing
  const { isLoading: isLoadingExpense } = useQuery({
    queryKey: ['expense', id],
    queryFn: () => expenseService.getExpenseById(id as string),
    enabled: !!id,
    onSuccess: (data) => {
      if (data) {
        form.reset({
          type: data.type,
          amount: String(data.amount),
          date: new Date(data.date),
          tournament_id: data.tournament_id || '',
          description: data.description || '',
          receipt: null, // Can't set File object from URL
        });
        
        if (data.receipt_url) {
          const fileName = data.receipt_url.split('/').pop() || 'comprovante';
          setReceiptFileName(fileName);
        }
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados da despesa",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
      navigate('/expenses');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File | null) => void) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setReceiptFileName(file.name);
      onChange(file);
    }
  };
  
  // Create or update expense mutation
  const mutation = useMutation({
    mutationFn: (data: ExpenseFormData) => {
      const { receipt, ...expenseData } = data;
      const numericAmount = parseFloat(expenseData.amount);
      
      const formattedData = {
        ...expenseData,
        amount: numericAmount,
        date: data.date.toISOString().split('T')[0],
      };
      
      return isEditing
        ? expenseService.updateExpense(id as string, formattedData, receipt || undefined)
        : expenseService.createExpense(formattedData, receipt || undefined);
    },
    onSuccess: () => {
      toast({
        title: `Despesa ${isEditing ? 'atualizada' : 'cadastrada'} com sucesso!`,
        description: "Os dados foram salvos.",
      });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      navigate('/expenses');
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} despesa`,
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    mutation.mutate(data);
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
              <Select onValueChange={field.onChange} value={field.value}>
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
          name="tournament_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Torneio Relacionado (opcional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Vincular a um torneio específico" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tournaments.map((tournament: any) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.name} - {format(new Date(tournament.date), 'dd/MM/yyyy')}
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

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            className="bg-poker-gold hover:bg-poker-gold/90"
            disabled={mutation.isPending}
          >
            {mutation.isPending 
              ? 'Salvando...' 
              : isEditing ? 'Atualizar' : 'Salvar'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-poker-gold text-poker-gold hover:bg-poker-gold/10"
            onClick={() => navigate('/expenses')}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExpenseForm;
