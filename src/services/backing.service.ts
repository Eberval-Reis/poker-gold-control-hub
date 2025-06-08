
import { supabase } from "@/integrations/supabase/client";
import { BackingOffer, BackingInvestment, BackingResult, BackerPayout } from '@/lib/backing-types';

// Backing Offers Service
export const getBackingOffers = async (): Promise<BackingOffer[]> => {
  const { data, error } = await supabase
    .from('backing_offers')
    .select(`
      *,
      tournaments!inner (
        id,
        name,
        clubs:club_id (
          name
        )
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching backing offers:', error);
    throw error;
  }
  
  return (data || []) as BackingOffer[];
};

export const getBackingOfferById = async (id: string): Promise<BackingOffer | null> => {
  const { data, error } = await supabase
    .from('backing_offers')
    .select(`
      *,
      tournaments!inner (
        id,
        name,
        clubs:club_id (
          name
        )
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching backing offer:', error);
    throw error;
  }
  
  return data as BackingOffer;
};

export const createBackingOffer = async (offerData: Omit<BackingOffer, 'id' | 'created_at' | 'updated_at'>): Promise<BackingOffer> => {
  const { data, error } = await supabase
    .from('backing_offers')
    .insert({
      tournament_id: offerData.tournament_id,
      player_name: offerData.player_name,
      buy_in_amount: offerData.buy_in_amount,
      tournament_date: offerData.tournament_date,
      collective_financing: offerData.collective_financing,
      available_percentage: offerData.available_percentage,
      markup_percentage: offerData.markup_percentage,
      status: offerData.status
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating backing offer:', error);
    throw error;
  }
  
  return data as BackingOffer;
};

export const updateBackingOffer = async (id: string, offerData: Partial<BackingOffer>): Promise<BackingOffer> => {
  const { data, error } = await supabase
    .from('backing_offers')
    .update(offerData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating backing offer:', error);
    throw error;
  }
  
  return data as BackingOffer;
};

// Backing Investments Service
export const getBackingInvestments = async (offerId?: string): Promise<BackingInvestment[]> => {
  let query = supabase.from('backing_investments').select('*');
  
  if (offerId) {
    query = query.eq('backing_offer_id', offerId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching backing investments:', error);
    throw error;
  }
  
  return (data || []) as BackingInvestment[];
};

export const createBackingInvestment = async (investmentData: Omit<BackingInvestment, 'id' | 'created_at' | 'updated_at'>): Promise<BackingInvestment> => {
  const { data, error } = await supabase
    .from('backing_investments')
    .insert({
      backing_offer_id: investmentData.backing_offer_id!,
      backer_name: investmentData.backer_name!,
      percentage_bought: investmentData.percentage_bought!,
      amount_paid: investmentData.amount_paid!,
      payment_status: investmentData.payment_status || 'pending'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating backing investment:', error);
    throw error;
  }
  
  return data as BackingInvestment;
};

// Backing Results Service
export const createBackingResult = async (resultData: Omit<BackingResult, 'id' | 'created_at' | 'updated_at'>): Promise<BackingResult> => {
  const { data, error } = await supabase
    .from('backing_results')
    .insert({
      backing_offer_id: resultData.backing_offer_id!,
      result_type: resultData.result_type!,
      prize_amount: resultData.prize_amount || 0,
      net_prize: resultData.net_prize || 0,
      player_profit: resultData.player_profit || 0
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating backing result:', error);
    throw error;
  }
  
  return data as BackingResult;
};

// Backer Payouts Service
export const createBackerPayouts = async (payouts: Omit<BackerPayout, 'id' | 'created_at' | 'updated_at'>[]): Promise<BackerPayout[]> => {
  const payoutInserts = payouts.map(payout => ({
    backing_investment_id: payout.backing_investment_id,
    backing_result_id: payout.backing_result_id,
    payout_amount: payout.payout_amount,
    roi_percentage: payout.roi_percentage,
    payment_status: payout.payment_status || 'pending'
  }));

  const { data, error } = await supabase
    .from('backer_payouts')
    .insert(payoutInserts)
    .select();
  
  if (error) {
    console.error('Error creating backer payouts:', error);
    throw error;
  }
  
  return (data || []) as BackerPayout[];
};

export const getBackerPayouts = async (backingResultId?: string): Promise<BackerPayout[]> => {
  let query = supabase.from('backer_payouts').select('*');
  
  if (backingResultId) {
    query = query.eq('backing_result_id', backingResultId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching backer payouts:', error);
    throw error;
  }
  
  return (data || []) as BackerPayout[];
};
