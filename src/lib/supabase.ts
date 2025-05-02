
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
