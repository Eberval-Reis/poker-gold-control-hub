import { supabase } from "@/integrations/supabase/client";

export interface ImportResult {
  processed: number;
  imported: number;
  errors: string[];
  clubsCreated: string[];
  tournamentsCreated: string[];
}

export const importCSVPerformance = async (csvFile: File): Promise<ImportResult> => {
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session) {
    throw new Error('User not authenticated');
  }

  const csvText = await csvFile.text();
  
  const { data, error } = await supabase.functions.invoke('import-csv-performance', {
    body: { csvData: csvText },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    console.error('Import error:', error);
    throw new Error(error.message || 'Failed to import CSV');
  }

  return data as ImportResult;
};

export const csvImportService = {
  importCSVPerformance
};