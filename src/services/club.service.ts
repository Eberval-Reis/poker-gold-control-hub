
import { Club } from '@/lib/supabase';

// Individual functions for club operations
export const getClubs = async (): Promise<Club[]> => {
  console.log('Mock getClubs called');
  return [];
};

export const getClubById = async (id: string): Promise<Club | null> => {
  console.log('Mock getClubById called with:', id);
  return null;
};

export const createClub = async (clubData: Partial<Club>): Promise<Club> => {
  console.log('Mock createClub called with:', clubData);
  return { id: 'mock-id', name: '', location: '', ...clubData };
};

export const updateClub = async (id: string, clubData: Partial<Club>): Promise<Club> => {
  console.log('Mock updateClub called with:', id, clubData);
  return { id, name: '', location: '', ...clubData };
};

export const deleteClub = async (id: string): Promise<{ success: boolean }> => {
  console.log('Mock deleteClub called with:', id);
  return { success: true };
};

// Export clubService object for components that expect it
export const clubService = {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub
};
