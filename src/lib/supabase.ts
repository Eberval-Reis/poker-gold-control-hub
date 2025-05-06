
// Type definitions
export interface Club {
  id: string;
  name: string;
  location: string;
  phone?: string;
  contact_person?: string;
  reference?: string;
  address_link?: string;
  observations?: string;
}

export interface Tournament {
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
  tournaments?: {
    name: string;
  };
}

// Mock replacement for Supabase client
export const supabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => null,
        data: [],
        error: null
      }),
      data: [],
      error: null
    }),
    insert: async () => ({ data: { id: 'mock-id' }, error: null }),
    update: async () => ({ data: {}, error: null }),
    delete: async () => ({ data: {}, error: null })
  }),
  storage: {
    from: (bucket: string) => ({
      upload: async () => ({ data: { path: 'mock-path' }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: path } })
    })
  }
};
