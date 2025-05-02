
// Mock replacement for Supabase expense service
export const getExpenses = async () => {
  console.log('Mock getExpenses called');
  return [];
};

export const getExpenseById = async (id: string) => {
  console.log('Mock getExpenseById called with:', id);
  return null;
};

export const createExpense = async (expenseData: any) => {
  console.log('Mock createExpense called with:', expenseData);
  return { id: 'mock-id', ...expenseData };
};

export const updateExpense = async (id: string, expenseData: any) => {
  console.log('Mock updateExpense called with:', id, expenseData);
  return { id, ...expenseData };
};

export const deleteExpense = async (id: string) => {
  console.log('Mock deleteExpense called with:', id);
  return { success: true };
};
