
import { supabase } from "@/integrations/supabase/client";
import { Tournament } from '@/lib/supabase';

// Individual functions for tournament operations
export const getTournaments = async (): Promise<Tournament[]> => {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*, club_id (name), event_id (name, date)');
  
  if (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
  
  // Map event and club join fields
  return (data as any[] || []).map(item => ({
    id: item.id,
    name: item.name,
    club_id: item.club_id,
    event_id: item.event_id,
    type: item.type,
    initial_stack: item.initial_stack || '',
    blind_structure: item.blind_structure,
    prizes: item.prizes,
    notes: item.notes,
    buyin_amount: item.buyin_amount,
    rebuy_amount: item.rebuy_amount,
    addon_amount: item.addon_amount,
    created_at: item.created_at,
    updated_at: item.updated_at,
    clubs: item.club_id,
    event: item.event_id // event_id join: { name, date }
  })) as Tournament[];
};

export const getTournamentById = async (id: string): Promise<Tournament | null> => {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*, club_id (name), event_id (name, date)')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching tournament:', error);
    throw error;
  }
  
  // Map event and club join fields
  return data ? {
    id: data.id,
    name: data.name,
    club_id: data.club_id,
    event_id: data.event_id,
    type: data.type,
    initial_stack: data.initial_stack || '',
    blind_structure: data.blind_structure,
    prizes: data.prizes,
    notes: data.notes,
    buyin_amount: data.buyin_amount,
    rebuy_amount: data.rebuy_amount,
    addon_amount: data.addon_amount,
    created_at: data.created_at,
    updated_at: data.updated_at,
    clubs: data.club_id,
    event: data.event_id // { name, date }
  } as Tournament : null;
};

export const createTournament = async (tournamentData: Partial<Tournament>): Promise<Tournament> => {
  if (!tournamentData.name || !tournamentData.club_id || !tournamentData.type) {
    throw new Error('Missing required tournament fields');
  }
  
  const { data, error } = await supabase
    .from('tournaments')
    .insert({
      name: tournamentData.name,
      club_id: tournamentData.club_id,
      event_id: tournamentData.event_id || null,
      type: tournamentData.type,
      initial_stack: tournamentData.initial_stack,
      blind_structure: tournamentData.blind_structure,
      prizes: tournamentData.prizes,
      notes: tournamentData.notes,
      buyin_amount: tournamentData.buyin_amount,
      rebuy_amount: tournamentData.rebuy_amount,
      addon_amount: tournamentData.addon_amount
    })
    .select('*, club_id (name), event_id (name, date)')
    .maybeSingle();
  
  if (error) {
    console.error('Error creating tournament:', error);
    throw error;
  }
  
  return data as Tournament;
};

export const updateTournament = async (id: string, tournamentData: Partial<Tournament>): Promise<Tournament> => {
  const updateData: Record<string, any> = {};
  if (tournamentData.name !== undefined) updateData.name = tournamentData.name;
  if (tournamentData.club_id !== undefined) updateData.club_id = tournamentData.club_id;
  if (tournamentData.event_id !== undefined) updateData.event_id = tournamentData.event_id;
  if (tournamentData.type !== undefined) updateData.type = tournamentData.type;
  if (tournamentData.initial_stack !== undefined) updateData.initial_stack = tournamentData.initial_stack;
  if (tournamentData.blind_structure !== undefined) updateData.blind_structure = tournamentData.blind_structure;
  if (tournamentData.prizes !== undefined) updateData.prizes = tournamentData.prizes;
  if (tournamentData.notes !== undefined) updateData.notes = tournamentData.notes;
  if (tournamentData.buyin_amount !== undefined) updateData.buyin_amount = tournamentData.buyin_amount;
  if (tournamentData.rebuy_amount !== undefined) updateData.rebuy_amount = tournamentData.rebuy_amount;
  if (tournamentData.addon_amount !== undefined) updateData.addon_amount = tournamentData.addon_amount;
  
  const { data, error } = await supabase
    .from('tournaments')
    .update(updateData)
    .eq('id', id)
    .select('*, club_id (name), event_id (name, date)')
    .maybeSingle();
  
  if (error) {
    console.error('Error updating tournament:', error);
    throw error;
  }
  
  return data as Tournament;
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

export const tournamentService = {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament
};

