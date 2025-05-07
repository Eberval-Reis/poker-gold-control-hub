
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
  // Make sure required fields are present
  if (!tournamentData.name || !tournamentData.club_id || !tournamentData.date || 
      !tournamentData.time || !tournamentData.type) {
    throw new Error('Missing required tournament fields');
  }
  
  const { data, error } = await supabase
    .from('tournaments')
    .insert({
      name: tournamentData.name,
      club_id: tournamentData.club_id,
      date: tournamentData.date,
      time: tournamentData.time,
      type: tournamentData.type,
      initial_stack: tournamentData.initial_stack,
      blind_structure: tournamentData.blind_structure,
      prizes: tournamentData.prizes,
      notes: tournamentData.notes
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating tournament:', error);
    throw error;
  }
  
  return data;
};

export const updateTournament = async (id: string, tournamentData: Partial<Tournament>): Promise<Tournament> => {
  // Create an object with only the properties that are present
  const updateData: Record<string, any> = {};
  if (tournamentData.name !== undefined) updateData.name = tournamentData.name;
  if (tournamentData.club_id !== undefined) updateData.club_id = tournamentData.club_id;
  if (tournamentData.date !== undefined) updateData.date = tournamentData.date;
  if (tournamentData.time !== undefined) updateData.time = tournamentData.time;
  if (tournamentData.type !== undefined) updateData.type = tournamentData.type;
  if (tournamentData.initial_stack !== undefined) updateData.initial_stack = tournamentData.initial_stack;
  if (tournamentData.blind_structure !== undefined) updateData.blind_structure = tournamentData.blind_structure;
  if (tournamentData.prizes !== undefined) updateData.prizes = tournamentData.prizes;
  if (tournamentData.notes !== undefined) updateData.notes = tournamentData.notes;
  
  const { data, error } = await supabase
    .from('tournaments')
    .update(updateData)
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
