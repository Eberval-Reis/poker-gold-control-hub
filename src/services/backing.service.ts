
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

export const createBackingOffer = async (offerData: Partial<BackingOffer>): Promise<BackingOffer> => {
  const { data, error } = await supabase
    .from('backing_offers')
    .insert(offerData)
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

export const createBackingInvestment = async (investmentData: Partial<BackingInvestment>): Promise<BackingInvestment> => {
  const { data, error } = await supabase
    .from('backing_investments')
    .insert(investmentData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating backing investment:', error);
    throw error;
  }
  
  return data as BackingInvestment;
};

// Backing Results Service
export const createBackingResult = async (resultData: Partial<BackingResult>): Promise<BackingResult> => {
  const { data, error } = await supabase
    .from('backing_results')
    .insert(resultData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating backing result:', error);
    throw error;
  }
  
  return data as BackingResult;
};

// Backer Payouts Service
export const createBackerPayouts = async (payouts: Partial<BackerPayout>[]): Promise<BackerPayout[]> => {
  const { data, error } = await supabase
    .from('backer_payouts')
    .insert(payouts)
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
