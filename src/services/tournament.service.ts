
import { supabase, Tournament } from '@/lib/supabase';

export const tournamentService = {
  // Get all tournaments
  async getTournaments(): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*, clubs(name)')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Get a specific tournament by ID
  async getTournamentById(id: string): Promise<Tournament | null> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*, clubs(name)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching tournament ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Create a new tournament
  async createTournament(tournament: Omit<Tournament, 'id' | 'created_at' | 'updated_at'>): Promise<Tournament> {
    const { data, error } = await supabase
      .from('tournaments')
      .insert([{ ...tournament }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
    
    return data;
  },
  
  // Update an existing tournament
  async updateTournament(id: string, tournament: Partial<Omit<Tournament, 'id' | 'created_at' | 'updated_at'>>): Promise<Tournament> {
    const { data, error } = await supabase
      .from('tournaments')
      .update({ ...tournament, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating tournament ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Delete a tournament
  async deleteTournament(id: string): Promise<void> {
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting tournament ${id}:`, error);
      throw error;
    }
  }
};
