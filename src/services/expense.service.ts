
import { Expense } from '@/lib/supabase';

// Individual functions for expense operations
export const getExpenses = async (): Promise<Expense[]> => {
  console.log('Mock getExpenses called');
  return [];
};

export const getExpenseById = async (id: string): Promise<Expense | null> => {
  console.log('Mock getExpenseById called with:', id);
  return null;
};

export const createExpense = async (expenseData: Partial<Expense>, receipt?: File): Promise<Expense> => {
  console.log('Mock createExpense called with:', expenseData);
  return { id: 'mock-id', type: '', amount: 0, date: '', ...expenseData };
};

export const updateExpense = async (id: string, expenseData: Partial<Expense>, receipt?: File): Promise<Expense> => {
  console.log('Mock updateExpense called with:', id, expenseData);
  return { id, type: '', amount: 0, date: '', ...expenseData };
};

export const deleteExpense = async (id: string): Promise<{ success: boolean }> => {
  console.log('Mock deleteExpense called with:', id);
  return { success: true };
};

// Export expenseService object for components that expect it
export const expenseService = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
