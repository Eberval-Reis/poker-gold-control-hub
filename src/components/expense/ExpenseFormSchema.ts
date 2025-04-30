
import * as z from 'zod';

export const expenseFormSchema = z.object({
  type: z.string().min(1, { message: 'Campo obrigatório' }),
  amount: z.string().min(1, { message: 'Campo obrigatório' }),
  date: z.date({
    required_error: 'Campo obrigatório',
  }),
  tournament_id: z.string().optional(),
  description: z.string().optional(),
  receipt: z.instanceof(File).optional().nullable(),
});

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;

// Expense types with their corresponding icons
export const expenseTypes = [
  { id: 'transport', name: 'Transporte', icon: 'car' },
  { id: 'food', name: 'Alimentação', icon: 'utensils' },
  { id: 'accommodation', name: 'Hospedagem', icon: 'hotel' },
  { id: 'material', name: 'Material', icon: 'clipboard' },
  { id: 'other', name: 'Outros', icon: 'file-text' },
];
