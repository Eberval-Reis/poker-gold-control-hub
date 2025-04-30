
import { supabase, Club } from '@/lib/supabase';

export const clubService = {
  // Get all clubs
  async getClubs(): Promise<Club[]> {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching clubs:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Get a specific club by ID
  async getClubById(id: string): Promise<Club | null> {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching club ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Create a new club
  async createClub(club: Omit<Club, 'id' | 'created_at' | 'updated_at'>): Promise<Club> {
    const { data, error } = await supabase
      .from('clubs')
      .insert([{ ...club }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating club:', error);
      throw error;
    }
    
    return data;
  },
  
  // Update an existing club
  async updateClub(id: string, club: Partial<Omit<Club, 'id' | 'created_at' | 'updated_at'>>): Promise<Club> {
    const { data, error } = await supabase
      .from('clubs')
      .update({ ...club, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating club ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Delete a club
  async deleteClub(id: string): Promise<void> {
    const { error } = await supabase
      .from('clubs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting club ${id}:`, error);
      throw error;
    }
  }
};
