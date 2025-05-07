
import { supabase } from "@/integrations/supabase/client";
import { Tournament } from '@/lib/supabase';

// Individual functions for tournament operations
export const getTournaments = async (): Promise<Tournament[]> => {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*, clubs(name)');
  
  if (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
  
  return data || [];
};

export const getTournamentById = async (id: string): Promise<Tournament | null> => {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*, clubs(name)')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching tournament:', error);
    throw error;
  }
  
  return data;
};

export const createTournament = async (tournamentData: Partial<Tournament>): Promise<Tournament> => {
  const { data, error } = await supabase
    .from('tournaments')
    .insert(tournamentData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating tournament:', error);
    throw error;
  }
  
  return data;
};

export const updateTournament = async (id: string, tournamentData: Partial<Tournament>): Promise<Tournament> => {
  const { data, error } = await supabase
    .from('tournaments')
    .update(tournamentData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating tournament:', error);
    throw error;
  }
  
  return data;
};

export const deleteTournament = async (id: string): Promise<{ success: boolean }> => {
  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting tournament:', error);
    throw error;
  }
  
  return { success: true };
};

// Export tournamentService object for components that expect it
export const tournamentService = {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament
};
