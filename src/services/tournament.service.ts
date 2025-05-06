
import { Tournament } from '@/lib/supabase';

// Individual functions for tournament operations
export const getTournaments = async (): Promise<Tournament[]> => {
  console.log('Mock getTournaments called');
  return [];
};

export const getTournamentById = async (id: string): Promise<Tournament | null> => {
  console.log('Mock getTournamentById called with:', id);
  return null;
};

export const createTournament = async (tournamentData: Partial<Tournament>): Promise<Tournament> => {
  console.log('Mock createTournament called with:', tournamentData);
  return { id: 'mock-id', name: '', club_id: '', date: '', time: '', type: '', ...tournamentData };
};

export const updateTournament = async (id: string, tournamentData: Partial<Tournament>): Promise<Tournament> => {
  console.log('Mock updateTournament called with:', id, tournamentData);
  return { id, name: '', club_id: '', date: '', time: '', type: '', ...tournamentData };
};

export const deleteTournament = async (id: string): Promise<{ success: boolean }> => {
  console.log('Mock deleteTournament called with:', id);
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
