import { supabase } from "@/integrations/supabase/client";
import { PokerPerformance } from '@/types';

// Individual functions for tournament performance operations
export const getPokerPerformances = async (): Promise<PokerPerformance[]> => {
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

  return (data || []) as unknown as PokerPerformance[];
};

export const getPokerPerformanceById = async (id: string): Promise<PokerPerformance | null> => {
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

  console.log('PokerPerformance data loaded:', data);
  return data as unknown as PokerPerformance;
};

// Define a type that ensures buyin_amount and tournament_date are present, matching Supabase's requirements
type PokerPerformanceInsert = Omit<Partial<PokerPerformance>, 'buyin_amount' | 'tournament_date'> & {
  buyin_amount: number;
  tournament_date: string;
};

export const createPokerPerformance = async (
  performanceData: Partial<PokerPerformance>
): Promise<PokerPerformance> => {
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
  const dataToInsert = { ...performanceData, user_id: user.id } as unknown as PokerPerformanceInsert & { user_id: string };

  const { data, error } = await supabase
    .from('tournament_performance')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    console.error('Error creating tournament performance:', error);
    throw error;
  }

  return data as PokerPerformance;
};

export const updatePokerPerformance = async (
  id: string,
  performanceData: Partial<PokerPerformance>
): Promise<PokerPerformance> => {
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

  return data as PokerPerformance;
};

export const deletePokerPerformance = async (id: string): Promise<{ success: boolean }> => {
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
  getPerformances: getPokerPerformances,
  getPerformanceById: getPokerPerformanceById,
  createPerformance: createPokerPerformance,
  updatePerformance: updatePokerPerformance,
  deletePerformance: deletePokerPerformance
};
