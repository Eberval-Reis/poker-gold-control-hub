import { supabase } from "@/integrations/supabase/client";
import { TournamentPerformance } from '@/lib/supabase';

// Individual functions for tournament performance operations
export const getTournamentPerformances = async (): Promise<TournamentPerformance[]> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('tournament_performance')
    .select(`
      *,
      tournaments!inner (
        id,
        name,
        date,
        clubs:club_id (
          id,
          name
        )
      ),
      clubs:club_id (
        id,
        name
      )
    `)
    .eq('user_id', user.id);
  
  if (error) {
    console.error('Error fetching tournament performances:', error);
    throw error;
  }
  
  return (data || []) as TournamentPerformance[];
};

export const getTournamentPerformanceById = async (id: string): Promise<TournamentPerformance | null> => {
  const { data, error } = await supabase
    .from('tournament_performance')
    .select(`
      *,
      tournaments!inner (
        id,
        name,
        date,
        clubs:club_id (
          id,
          name
        )
      ),
      clubs:club_id (
        id,
        name
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching tournament performance:', error);
    throw error;
  }
  
  console.log('Performance data loaded:', data);
  return data as TournamentPerformance;
};

// Define a type that ensures buyin_amount and tournament_date are present, matching Supabase's requirements
type TournamentPerformanceInsert = Omit<Partial<TournamentPerformance>, 'buyin_amount' | 'tournament_date'> & { 
  buyin_amount: number;
  tournament_date: string;
};

export const createTournamentPerformance = async (
  performanceData: Partial<TournamentPerformance>
): Promise<TournamentPerformance> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Ensure buyin_amount is present
  if (!performanceData.buyin_amount && performanceData.buyin_amount !== 0) {
    throw new Error('Buy-in amount is required');
  }
  
  // Ensure tournament_date is present
  if (!performanceData.tournament_date) {
    throw new Error('Tournament date is required');
  }
  
  // Cast to the correct type with required fields guaranteed to be present
  const dataToInsert = { ...performanceData, user_id: user.id } as TournamentPerformanceInsert & { user_id: string };
  
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
