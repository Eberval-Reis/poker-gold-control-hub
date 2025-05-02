
// Mock replacement for Supabase tournament service
export const getTournaments = async () => {
  console.log('Mock getTournaments called');
  return [];
};

export const getTournamentById = async (id: string) => {
  console.log('Mock getTournamentById called with:', id);
  return null;
};

export const createTournament = async (tournamentData: any) => {
  console.log('Mock createTournament called with:', tournamentData);
  return { id: 'mock-id', ...tournamentData };
};

export const updateTournament = async (id: string, tournamentData: any) => {
  console.log('Mock updateTournament called with:', id, tournamentData);
  return { id, ...tournamentData };
};

export const deleteTournament = async (id: string) => {
  console.log('Mock deleteTournament called with:', id);
  return { success: true };
};
