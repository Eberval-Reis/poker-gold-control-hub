-- Add user_id column to backer_payouts table (only missing one)
ALTER TABLE public.backer_payouts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;