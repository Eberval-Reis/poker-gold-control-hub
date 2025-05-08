
import { supabase } from "@/integrations/supabase/client";
import { Club } from '@/lib/supabase';

// Individual functions for club operations
export const getClubs = async (): Promise<Club[]> => {
  const { data, error } = await supabase.from('Cadastro Clube').select('*');
  
  if (error) {
    console.error('Error fetching clubs:', error);
    throw error;
  }
  
  return data as Club[] || [];
};

export const getClubById = async (id: string): Promise<Club | null> => {
  const { data, error } = await supabase
    .from('Cadastro Clube')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching club:', error);
    throw error;
  }
  
  return data as Club;
};

export const createClub = async (clubData: { 
  name: string;
  location: string;
  phone?: string;
  contact_person?: string;
  reference?: string;
  address_link?: string;
  observations?: string;
}): Promise<Club> => {
  const { data, error } = await supabase
    .from('Cadastro Clube')
    .insert(clubData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating club:', error);
    throw error;
  }
  
  return data as Club;
};

export const updateClub = async (id: string, clubData: {
  name?: string;
  location?: string;
  phone?: string;
  contact_person?: string;
  reference?: string;
  address_link?: string;
  observations?: string;
}): Promise<Club> => {
  const { data, error } = await supabase
    .from('Cadastro Clube')
    .update(clubData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating club:', error);
    throw error;
  }
  
  return data as Club;
};

export const deleteClub = async (id: string): Promise<{ success: boolean }> => {
  const { error } = await supabase
    .from('Cadastro Clube')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting club:', error);
    throw error;
  }
  
  return { success: true };
};

// Export clubService object for components that expect it
export const clubService = {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub
};
