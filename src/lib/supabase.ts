
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export type Club = {
  id: string;
  name: string;
  location: string;
  phone?: string;
  contact_person?: string;
  reference?: string;
  address_link?: string;
  observations?: string;
  created_at: string;
  updated_at?: string;
};

export type Tournament = {
  id: string;
  name: string;
  club_id: string;
  date: string;
  time: string;
  type: string;
  initial_stack?: string;
  blind_structure?: string;
  prizes?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
};

export type Expense = {
  id: string;
  type: string;
  amount: number;
  date: string;
  tournament_id?: string;
  description?: string;
  receipt_url?: string;
  created_at: string;
  updated_at?: string;
};
