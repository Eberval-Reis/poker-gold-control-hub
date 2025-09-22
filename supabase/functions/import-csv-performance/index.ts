import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface CSVRow {
  clube_id: string;
  clube_nome_manual: string;
  data_torneio: string;
  nome_torneio: string;
  valor_buy_in: string;
  fez_rebuy: string;
  qtd_rebuys: string;
  valor_unitario_rebuy: string;
  fez_addon: string;
  valor_addon: string;
  total_investido: string;
  itm: string;
  ft: string;
  colocacao: string;
  valor_premiacao: string;
  lucro_prejuizo: string;
}

function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row as CSVRow;
    });
}

async function findOrCreateClub(clubName: string, userId: string): Promise<string> {
  if (!clubName.trim()) {
    // Create a default club if no name provided
    const { data, error } = await supabase
      .from('Cadastro Clube')
      .insert({
        name: 'Clube não especificado',
        location: 'Não informado',
        user_id: userId
      })
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  }

  // First try to find existing club
  const { data: existingClub } = await supabase
    .from('Cadastro Clube')
    .select('id')
    .eq('name', clubName.trim())
    .eq('user_id', userId)
    .maybeSingle();

  if (existingClub) {
    return existingClub.id;
  }

  // Create new club
  const { data: newClub, error } = await supabase
    .from('Cadastro Clube')
    .insert({
      name: clubName.trim(),
      location: 'Importado do CSV',
      user_id: userId
    })
    .select('id')
    .single();

  if (error) throw error;
  return newClub.id;
}

async function findOrCreateTournament(tournamentName: string, clubId: string, tournamentDate: string, buyinAmount: number, userId: string): Promise<string> {
  // Try to find existing tournament
  const { data: existingTournament } = await supabase
    .from('tournaments')
    .select('id')
    .eq('name', tournamentName.trim())
    .eq('club_id', clubId)
    .eq('date', tournamentDate)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingTournament) {
    return existingTournament.id;
  }

  // Create new tournament
  const { data: newTournament, error } = await supabase
    .from('tournaments')
    .insert({
      name: tournamentName.trim(),
      club_id: clubId,
      type: 'NLH', // Default type
      date: tournamentDate,
      time: '',
      buyin_amount: buyinAmount,
      user_id: userId
    })
    .select('id')
    .single();

  if (error) throw error;
  return newTournament.id;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { csvData } = await req.json();
    
    if (!csvData) {
      throw new Error('CSV data is required');
    }

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const csvRows = parseCSV(csvData);
    const results = {
      processed: 0,
      imported: 0,
      errors: [] as string[],
      clubsCreated: [] as string[],
      tournamentsCreated: [] as string[]
    };

    console.log(`Processing ${csvRows.length} rows for user ${user.id}`);

    for (const row of csvRows) {
      results.processed++;
      
      try {
        // Skip rows without essential data
        if (!row.data_torneio || !row.nome_torneio || !row.valor_buy_in) {
          results.errors.push(`Row ${results.processed}: Missing required data (date, tournament name, or buyin amount)`);
          continue;
        }

        // Parse date (format: YYYY-MM-DD)
        const tournamentDate = row.data_torneio;
        const buyinAmount = parseFloat(row.valor_buy_in);

        if (isNaN(buyinAmount) || buyinAmount <= 0) {
          results.errors.push(`Row ${results.processed}: Invalid buyin amount: ${row.valor_buy_in}`);
          continue;
        }

        // Find or create club
        const clubName = row.clube_nome_manual || 'Clube não especificado';
        const clubId = await findOrCreateClub(clubName, user.id);
        
        if (clubName && clubName !== 'Clube não especificado' && !results.clubsCreated.includes(clubName)) {
          results.clubsCreated.push(clubName);
        }

        // Find or create tournament
        const tournamentId = await findOrCreateTournament(
          row.nome_torneio, 
          clubId, 
          tournamentDate, 
          buyinAmount, 
          user.id
        );
        
        if (!results.tournamentsCreated.includes(row.nome_torneio)) {
          results.tournamentsCreated.push(row.nome_torneio);
        }

        // Parse performance data
        const rebuyQuantity = row.qtd_rebuys ? parseInt(row.qtd_rebuys) : 0;
        const rebuyAmount = row.valor_unitario_rebuy ? parseFloat(row.valor_unitario_rebuy) : null;
        const addonEnabled = row.fez_addon === 'true' || (row.valor_addon && parseFloat(row.valor_addon) > 0);
        const addonAmount = row.valor_addon ? parseFloat(row.valor_addon) : null;
        const itmAchieved = row.itm === 'true';
        const finalTableAchieved = row.ft === 'true';
        const position = row.colocacao ? parseInt(row.colocacao) : null;
        const prizeAmount = row.valor_premiacao ? parseFloat(row.valor_premiacao) : null;

        // Check if performance already exists to avoid duplicates
        const { data: existingPerformance } = await supabase
          .from('tournament_performance')
          .select('id')
          .eq('tournament_id', tournamentId)
          .eq('tournament_date', tournamentDate)
          .eq('buyin_amount', buyinAmount)
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingPerformance) {
          results.errors.push(`Row ${results.processed}: Performance already exists for ${row.nome_torneio} on ${tournamentDate}`);
          continue;
        }

        // Insert tournament performance
        const { error: insertError } = await supabase
          .from('tournament_performance')
          .insert({
            tournament_id: tournamentId,
            tournament_date: tournamentDate,
            buyin_amount: buyinAmount,
            rebuy_amount: rebuyAmount,
            rebuy_quantity: rebuyQuantity,
            addon_enabled: addonEnabled,
            addon_amount: addonAmount,
            itm_achieved: itmAchieved,
            final_table_achieved: finalTableAchieved,
            position: position,
            prize_amount: prizeAmount || 0,
            user_id: user.id
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          results.errors.push(`Row ${results.processed}: Error inserting performance: ${insertError.message}`);
          continue;
        }

        results.imported++;
        console.log(`Successfully imported row ${results.processed}: ${row.nome_torneio}`);

      } catch (error) {
        console.error(`Error processing row ${results.processed}:`, error);
        results.errors.push(`Row ${results.processed}: ${error.message}`);
      }
    }

    console.log('Import completed:', results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('CSV import error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});