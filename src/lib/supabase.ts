
// Type definitions based on our Supabase database schema
export interface Club {
  id: string;
  name: string;
  location: string;
  phone?: string;
  contact_person?: string;
  reference?: string;
  address_link?: string;
  observations?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Tournament {
  id: string;
  name: string;
  club_id: string;
  date?: string;
  time?: string;
  type: string;
  initial_stack?: string;
  blind_structure?: string;
  prizes?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // Join fields
  clubs?: {
    name: string;
  };
}

export interface Expense {
  id: string;
  type: string;
  amount: number;
  date: string;
  tournament_id?: string;
  description?: string;
  receipt_url?: string;
  created_at?: string;
  updated_at?: string;
  // Join fields
  tournaments?: {
    name: string;
  };
}

// Export the Supabase client from the integrations directory
export { supabase } from '@/integrations/supabase/client';
