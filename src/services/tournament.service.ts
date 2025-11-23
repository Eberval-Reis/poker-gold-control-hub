
import { supabase } from "@/integrations/supabase/client";
import { Tournament } from '@/lib/supabase';

// Individual functions for tournament operations
export const getTournaments = async (): Promise<Tournament[]> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('user_id', user.id);
  
  if (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
  
  // Buscar clubes e eventos separadamente por enquanto
  const [clubsData, eventsData] = await Promise.all([
    supabase.from('Cadastro Clube').select('id, name').eq('user_id', user.id),
    supabase.from('schedule_events').select('id, name, date').eq('user_id', user.id)
  ]);

  const clubs = clubsData.data || [];
  const events = eventsData.data || [];

  return data.map((item: any) => {
    const club = clubs.find((c: any) => c.id === item.club_id);
    const event = events.find((e: any) => e.id === item.event_id);
    
    return {
      id: item.id,
      name: item.name,
      club_id: item.club_id,
      type: item.type,
      blind_structure: item.blind_structure,
      prizes: item.prizes,
      notes: item.notes,
      buyin_amount: item.buyin_amount,
      rebuy_amount: item.rebuy_amount,
      addon_amount: item.addon_amount,
      created_at: item.created_at,
      updated_at: item.updated_at,
      date: item.date,
      time: item.time,
      event_id: item.event_id,
      initial_stack: item.initial_stack,
      clubs: club ? { name: (club as any).name } : null,
      event: event ? { name: (event as any).name, date: (event as any).date } : null
    };
  }) as Tournament[];
};

export const getTournamentById = async (id: string): Promise<Tournament | null> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();
  
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching tournament:', error);
    throw error;
  }
  
  if (!data) return null;

  // Buscar clube e evento separadamente
  const [clubData, eventData] = await Promise.all([
    data.club_id ? supabase.from('Cadastro Clube').select('name').eq('id', data.club_id).eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    data.event_id ? supabase.from('schedule_events').select('name, date').eq('id', data.event_id).eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null })
  ]);

  return {
    id: data.id,
    name: data.name,
    club_id: data.club_id,
    type: data.type,
    blind_structure: data.blind_structure,
    prizes: data.prizes,
    notes: data.notes,
    buyin_amount: data.buyin_amount,
    rebuy_amount: data.rebuy_amount,
    addon_amount: data.addon_amount,
    created_at: data.created_at,
    updated_at: data.updated_at,
    date: data.date,
    time: data.time,
    event_id: data.event_id,
    initial_stack: data.initial_stack,
    clubs: clubData.data ? { name: clubData.data.name } : null,
    event: eventData.data ? { name: eventData.data.name, date: eventData.data.date } : null
  } as Tournament;
};

export const createTournament = async (tournamentData: Partial<Tournament>): Promise<Tournament> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

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
      addon_amount: tournamentData.addon_amount,
      date: tournamentData.date || '',
      time: tournamentData.time || '',
      user_id: user.id
    })
    .select('*')
    .maybeSingle();
  
  if (error) {
    console.error('Error creating tournament:', error);
    throw error;
  }
  
  return data as Tournament;
};

export const updateTournament = async (id: string, tournamentData: Partial<Tournament>): Promise<Tournament> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

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
    .eq('user_id', user.id)
    .select('*')
    .maybeSingle();
  
  if (error) {
    console.error('Error updating tournament:', error);
    throw error;
  }
  
  return data as Tournament;
};

export const deleteTournament = async (id: string): Promise<{ success: boolean }> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  
  if (error) {
    console.error('Error deleting tournament:', error);
    throw error;
  }
  
  return { success: true };
};

export interface UniqueTournament extends Tournament {
  occurrences: number;
  averageBuyin?: number;
}

export const getUniqueTournaments = async (): Promise<UniqueTournament[]> => {
  const allTournaments = await getTournaments();
  
  // Agrupar torneios por nome
  const tournamentsByName = allTournaments.reduce((acc, tournament) => {
    if (!acc[tournament.name]) {
      acc[tournament.name] = [];
    }
    acc[tournament.name].push(tournament);
    return acc;
  }, {} as Record<string, Tournament[]>);

  // Criar array de torneios únicos com dados agregados
  const uniqueTournaments: UniqueTournament[] = Object.entries(tournamentsByName).map(([name, tournaments]) => {
    // Pegar o torneio mais recente como representativo
    const representative = tournaments.sort((a, b) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    )[0];

    // Calcular buy-in médio
    const buyins = tournaments
      .map(t => t.buyin_amount)
      .filter((b): b is number => b !== null && b !== undefined);
    const averageBuyin = buyins.length > 0 
      ? buyins.reduce((sum, b) => sum + b, 0) / buyins.length 
      : undefined;

    return {
      ...representative,
      occurrences: tournaments.length,
      averageBuyin
    };
  });

  // Ordenar por nome
  return uniqueTournaments.sort((a, b) => a.name.localeCompare(b.name));
};

export const tournamentService = {
  getTournaments,
  getUniqueTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament
};

