import { supabase } from "@/integrations/supabase/client";

export interface TournamentSchedule {
  id: string;
  event_id: string | null;
  event_name: string | null;
  tournament_id: string;
  tournament_name: string;
  date: string;
  time: string;
  buy_in: number;
  rebuys: number;
  status: "pending" | "done" | "not_done";
  reason?: string | null;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const scheduleService = {
  async getSchedules() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("tournament_schedules")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) throw error;
    return data as TournamentSchedule[];
  },

  async createSchedule(schedule: Omit<TournamentSchedule, "id" | "user_id" | "created_at" | "updated_at">) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("tournament_schedules")
      .insert({
        ...schedule,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as TournamentSchedule;
  },

  async updateSchedule(id: string, updates: Partial<TournamentSchedule>) {
    const { data, error } = await supabase
      .from("tournament_schedules")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as TournamentSchedule;
  },

  async deleteSchedule(id: string) {
    const { error } = await supabase
      .from("tournament_schedules")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
