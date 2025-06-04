
import { supabase } from "@/integrations/supabase/client";
import { TournamentPerformance } from '@/lib/supabase';

// Individual functions for tournament performance operations
export const getTournamentPerformances = async (startDate?: Date, endDate?: Date): Promise<TournamentPerformance[]> => {
  let query = supabase
    .from('tournament_performance')
    .select('*, tournament_id (name, club_id (name))');
  
  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching tournament performances:', error);
    throw error;
  }
  
  return (data || []) as TournamentPerformance[];
};

export const getTournamentPerformanceById = async (id: string): Promise<TournamentPerformance | null> => {
  const { data, error } = await supabase
    .from('tournament_performance')
    .select('*, tournament_id (name, club_id (name))')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching tournament performance:', error);
    throw error;
  }
  
  return data as TournamentPerformance;
};

// Define a type that ensures buyin_amount is present, matching Supabase's requirements
type TournamentPerformanceInsert = Omit<Partial<TournamentPerformance>, 'buyin_amount'> & { buyin_amount: number };

export const createTournamentPerformance = async (
  performanceData: Partial<TournamentPerformance>
): Promise<TournamentPerformance> => {
  // Ensure buyin_amount is present
  if (!performanceData.buyin_amount && performanceData.buyin_amount !== 0) {
    throw new Error('Buy-in amount is required');
  }
  
  // Cast to the correct type with buyin_amount guaranteed to be present
  const dataToInsert = performanceData as TournamentPerformanceInsert;
  
  const { data, error } = await supabase
    .from('tournament_performance')
    .insert(dataToInsert)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating tournament performance:', error);
    throw error;
  }
  
  return data as TournamentPerformance;
};

export const updateTournamentPerformance = async (
  id: string, 
  performanceData: Partial<TournamentPerformance>
): Promise<TournamentPerformance> => {
  const { data, error } = await supabase
    .from('tournament_performance')
    .update(performanceData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating tournament performance:', error);
    throw error;
  }
  
  return data as TournamentPerformance;
};

export const deleteTournamentPerformance = async (id: string): Promise<{ success: boolean }> => {
  const { error } = await supabase
    .from('tournament_performance')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting tournament performance:', error);
    throw error;
  }
  
  return { success: true };
};

// Export tournamentPerformanceService object
export const tournamentPerformanceService = {
  getTournamentPerformances,
  getTournamentPerformanceById,
  createTournamentPerformance,
  updateTournamentPerformance,
  deleteTournamentPerformance
};
