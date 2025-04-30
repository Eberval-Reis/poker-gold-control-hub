
import { supabase, Expense } from '@/lib/supabase';

export const expenseService = {
  // Get all expenses
  async getExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*, tournaments(name)')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Get a specific expense by ID
  async getExpenseById(id: string): Promise<Expense | null> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*, tournaments(name)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching expense ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Create a new expense
  async createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'receipt_url'>, file?: File): Promise<Expense> {
    let receiptUrl = null;

    // Upload receipt file if provided
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `receipts/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('expense-receipts')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading receipt:', uploadError);
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase
        .storage
        .from('expense-receipts')
        .getPublicUrl(filePath);
      
      receiptUrl = publicUrl;
    }
    
    // Create expense record with receipt URL if available
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expense, receipt_url: receiptUrl }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
    
    return data;
  },
  
  // Update an existing expense
  async updateExpense(id: string, expense: Partial<Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'receipt_url'>>, file?: File): Promise<Expense> {
    let updates: Partial<Expense> = {
      ...expense,
      updated_at: new Date().toISOString()
    };
    
    // Upload new receipt file if provided
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `receipts/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('expense-receipts')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading receipt:', uploadError);
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase
        .storage
        .from('expense-receipts')
        .getPublicUrl(filePath);
      
      updates.receipt_url = publicUrl;
    }
    
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating expense ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Delete an expense
  async deleteExpense(id: string): Promise<void> {
    // Get the expense to check for receipt file
    const { data: expense } = await supabase
      .from('expenses')
      .select('receipt_url')
      .eq('id', id)
      .single();
    
    // Delete the record
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting expense ${id}:`, error);
      throw error;
    }
    
    // Delete the associated receipt file if exists
    if (expense?.receipt_url) {
      const filePath = expense.receipt_url.split('/').pop();
      if (filePath) {
        const { error: deleteFileError } = await supabase
          .storage
          .from('expense-receipts')
          .remove([`receipts/${filePath}`]);
        
        if (deleteFileError) {
          console.error('Error deleting receipt file:', deleteFileError);
        }
      }
    }
  }
};
