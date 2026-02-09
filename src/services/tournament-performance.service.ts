import { supabase } from "@/integrations/supabase/client";
import { Performance } from '@/types';

// Individual functions for tournament performance operations
export const getPerformances = async (): Promise<Performance[]> => {
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

  return (data || []) as unknown as Performance[];
};

export const getPerformanceById = async (id: string): Promise<Performance | null> => {
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
  return data as unknown as Performance;
};

// Define a type that ensures buyin_amount and tournament_date are present, matching Supabase's requirements
type PerformanceInsert = Omit<Partial<Performance>, 'buyin_amount' | 'tournament_date'> & {
  buyin_amount: number;
  tournament_date: string;
};

export const createPerformance = async (
  performanceData: Partial<Performance>
): Promise<Performance> => {
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
  const dataToInsert = { ...performanceData, user_id: user.id } as unknown as PerformanceInsert & { user_id: string };

  const { data, error } = await supabase
    .from('tournament_performance')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    console.error('Error creating tournament performance:', error);
    throw error;
  }

  return data as Performance;
};

export const updatePerformance = async (
  id: string,
  performanceData: Partial<Performance>
): Promise<Performance> => {
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

  return data as Performance;
};

export const deletePerformance = async (id: string): Promise<{ success: boolean }> => {
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
  getPerformances,
  getPerformanceById,
  createPerformance,
  updatePerformance,
  deletePerformance
};
