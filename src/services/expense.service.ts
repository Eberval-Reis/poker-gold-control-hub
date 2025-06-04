
import { supabase } from "@/integrations/supabase/client";
import { Expense } from '@/lib/supabase';

// Individual functions for expense operations
export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*, tournaments(name)');
  
  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
  
  return data || [];
};

export const getExpenseById = async (id: string): Promise<Expense | null> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*, tournaments(name)')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching expense:', error);
    throw error;
  }
  
  return data;
};

export const createExpense = async (expenseData: Partial<Expense>, receipt?: File): Promise<Expense> => {
  // Make sure required fields are present
  if (!expenseData.type || !expenseData.amount || !expenseData.date) {
    throw new Error('Missing required expense fields');
  }
  
  // Upload receipt if provided
  if (receipt) {
    const fileName = `${Date.now()}-${receipt.name}`;
    const { data: fileData, error: uploadError } = await supabase
      .storage
      .from('receipts')
      .upload(fileName, receipt);
    
    if (uploadError) {
      console.error('Error uploading receipt:', uploadError);
      throw uploadError;
    }
    
    // Get public URL for the uploaded file
    const { data: urlData } = supabase
      .storage
      .from('receipts')
      .getPublicUrl(fileName);
    
    expenseData.receipt_url = urlData?.publicUrl;
  }
  
  // Insert expense record
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      type: expenseData.type,
      amount: expenseData.amount,
      date: expenseData.date,
      tournament_id: expenseData.tournament_id,
      description: expenseData.description,
      receipt_url: expenseData.receipt_url
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
  
  return data;
};

export const updateExpense = async (id: string, expenseData: Partial<Expense>, receipt?: File): Promise<Expense> => {
  // Upload new receipt if provided
  if (receipt) {
    const fileName = `${Date.now()}-${receipt.name}`;
    const { data: fileData, error: uploadError } = await supabase
      .storage
      .from('receipts')
      .upload(fileName, receipt);
    
    if (uploadError) {
      console.error('Error uploading receipt:', uploadError);
      throw uploadError;
    }
    
    // Get public URL for the uploaded file
    const { data: urlData } = supabase
      .storage
      .from('receipts')
      .getPublicUrl(fileName);
    
    expenseData.receipt_url = urlData?.publicUrl;
  }
  
  // Update expense record - only include properties that are present in expenseData
  const updateData: Record<string, any> = {};
  if (expenseData.type !== undefined) updateData.type = expenseData.type;
  if (expenseData.amount !== undefined) updateData.amount = expenseData.amount;
  if (expenseData.date !== undefined) updateData.date = expenseData.date;
  if (expenseData.tournament_id !== undefined) updateData.tournament_id = expenseData.tournament_id;
  if (expenseData.description !== undefined) updateData.description = expenseData.description;
  if (expenseData.receipt_url !== undefined) updateData.receipt_url = expenseData.receipt_url;
  
  const { data, error } = await supabase
    .from('expenses')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
  
  return data;
};

export const deleteExpense = async (id: string): Promise<{ success: boolean }> => {
  // First get the expense to check if it has a receipt
  const { data: expense } = await supabase
    .from('expenses')
    .select('receipt_url')
    .eq('id', id)
    .single();
  
  // Delete the expense record
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
  
  // If there was a receipt, try to delete it from storage
  // Note: This isn't critical, so we won't throw an error if it fails
  if (expense?.receipt_url) {
    try {
      const filePath = expense.receipt_url.split('/').pop() || '';
      if (filePath) {
        await supabase.storage.from('receipts').remove([filePath]);
      }
    } catch (storageError) {
      console.warn('Could not delete receipt file:', storageError);
    }
  }
  
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
