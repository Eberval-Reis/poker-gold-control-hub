
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { expenseFormSchema, ExpenseFormData } from './ExpenseFormSchema';
import { expenseService } from '@/services/expense.service';
import { tournamentService } from '@/services/tournament.service';

// Import the component fields
import ExpenseTypeField from './ExpenseTypeField';
import AmountField from './AmountField';
import DateField from './DateField';
import TournamentField from './TournamentField';
import DescriptionField from './DescriptionField';
import ReceiptField from './ReceiptField';
import FormActions from './FormActions';

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
  const { data: expenseData, isLoading: isLoadingExpense, error: expenseError } = useQuery({
    queryKey: ['expense', id],
    queryFn: () => expenseService.getExpenseById(id as string),
    enabled: !!id,
  });

  // Map backend type values to frontend values
  const mapBackendTypeToFrontend = (backendType: string): string => {
    const typeMap: Record<string, string> = {
      'transporte': 'transport',
      'alimentacao': 'food',
      'hospedagem': 'accommodation',
      'material': 'material',
      'outros': 'other',
      // Also support English values in case they're already stored
      'transport': 'transport',
      'food': 'food',
      'accommodation': 'accommodation',
      'other': 'other',
    };
    return typeMap[backendType.toLowerCase()] || backendType;
  };

  // Handle expense data loading
  useEffect(() => {
    if (expenseData) {
      form.reset({
        type: mapBackendTypeToFrontend(expenseData.type),
        amount: String(expenseData.amount),
        date: new Date(expenseData.date),
        tournament_id: expenseData.tournament_id || '',
        description: expenseData.description || '',
        receipt: null, // Can't set File object from URL
      });
      
      if (expenseData.receipt_url) {
        const fileName = expenseData.receipt_url.split('/').pop() || 'comprovante';
        setReceiptFileName(fileName);
      }
    }
  }, [expenseData, form]);

  // Handle expense loading error
  useEffect(() => {
    if (expenseError) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados da despesa",
        description: expenseError instanceof Error ? expenseError.message : "Ocorreu um erro desconhecido.",
      });
      navigate('/expenses');
    }
  }, [expenseError, toast, navigate]);
  
  // Create or update expense mutation
  const mutation = useMutation({
    mutationFn: (data: ExpenseFormData) => {
      const { receipt, ...expenseData } = data;
      const numericAmount = parseFloat(expenseData.amount);
      
      const formattedData = {
        ...expenseData,
        type: expenseData.type,
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
        <ExpenseTypeField form={form} />
        <AmountField form={form} />
        <DateField form={form} />
        <TournamentField form={form} tournaments={tournaments} />
        <DescriptionField form={form} />
        <ReceiptField 
          form={form} 
          receiptFileName={receiptFileName} 
          setReceiptFileName={setReceiptFileName}
          isEditing={isEditing}
        />
        <FormActions 
          isSubmitting={mutation.isPending} 
          isEditing={isEditing} 
          onCancel={() => navigate('/expenses')} 
        />
      </form>
    </Form>
  );
};

export default ExpenseForm;
