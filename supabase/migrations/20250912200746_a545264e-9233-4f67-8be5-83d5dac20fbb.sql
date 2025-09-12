-- Add user_id column to backer_payouts table
ALTER TABLE public.backer_payouts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Now update all RLS policies correctly

-- Update RLS policies for tournaments
DROP POLICY IF EXISTS "Authenticated users can view tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Authenticated users can create tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Authenticated users can update tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Authenticated users can delete tournaments" ON public.tournaments;

CREATE POLICY "Users can view their own tournaments" ON public.tournaments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tournaments" ON public.tournaments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tournaments" ON public.tournaments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tournaments" ON public.tournaments
FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for tournament_performance
DROP POLICY IF EXISTS "Authenticated users can view tournament performance" ON public.tournament_performance;
DROP POLICY IF EXISTS "Authenticated users can create tournament performance" ON public.tournament_performance;
DROP POLICY IF EXISTS "Authenticated users can update tournament performance" ON public.tournament_performance;
DROP POLICY IF EXISTS "Authenticated users can delete tournament performance" ON public.tournament_performance;

CREATE POLICY "Users can view their own tournament performance" ON public.tournament_performance
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tournament performance" ON public.tournament_performance
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tournament performance" ON public.tournament_performance
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tournament performance" ON public.tournament_performance
FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for expenses
DROP POLICY IF EXISTS "Authenticated users can view expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can create expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can update expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can delete expenses" ON public.expenses;

CREATE POLICY "Users can view their own expenses" ON public.expenses
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses" ON public.expenses
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON public.expenses
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON public.expenses
FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for backing_offers
DROP POLICY IF EXISTS "Authenticated users can view backing offers" ON public.backing_offers;
DROP POLICY IF EXISTS "Authenticated users can create backing offers" ON public.backing_offers;
DROP POLICY IF EXISTS "Authenticated users can update backing offers" ON public.backing_offers;
DROP POLICY IF EXISTS "Authenticated users can delete backing offers" ON public.backing_offers;

CREATE POLICY "Users can view their own backing offers" ON public.backing_offers
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own backing offers" ON public.backing_offers
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own backing offers" ON public.backing_offers
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own backing offers" ON public.backing_offers
FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for backing_investments
DROP POLICY IF EXISTS "Authenticated users can view backing investments" ON public.backing_investments;
DROP POLICY IF EXISTS "Authenticated users can create backing investments" ON public.backing_investments;
DROP POLICY IF EXISTS "Authenticated users can update backing investments" ON public.backing_investments;
DROP POLICY IF EXISTS "Authenticated users can delete backing investments" ON public.backing_investments;

CREATE POLICY "Users can view their own backing investments" ON public.backing_investments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own backing investments" ON public.backing_investments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own backing investments" ON public.backing_investments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own backing investments" ON public.backing_investments
FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for backing_results
DROP POLICY IF EXISTS "Authenticated users can view backing results" ON public.backing_results;
DROP POLICY IF EXISTS "Authenticated users can create backing results" ON public.backing_results;
DROP POLICY IF EXISTS "Authenticated users can update backing results" ON public.backing_results;
DROP POLICY IF EXISTS "Authenticated users can delete backing results" ON public.backing_results;

CREATE POLICY "Users can view their own backing results" ON public.backing_results
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own backing results" ON public.backing_results
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own backing results" ON public.backing_results
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own backing results" ON public.backing_results
FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for backer_payouts
DROP POLICY IF EXISTS "Authenticated users can view backer payouts" ON public.backer_payouts;
DROP POLICY IF EXISTS "Authenticated users can create backer payouts" ON public.backer_payouts;
DROP POLICY IF EXISTS "Authenticated users can update backer payouts" ON public.backer_payouts;
DROP POLICY IF EXISTS "Authenticated users can delete backer payouts" ON public.backer_payouts;

CREATE POLICY "Users can view their own backer payouts" ON public.backer_payouts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own backer payouts" ON public.backer_payouts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own backer payouts" ON public.backer_payouts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own backer payouts" ON public.backer_payouts
FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for Cadastro Clube
DROP POLICY IF EXISTS "Authenticated users can view clubs" ON public."Cadastro Clube";
DROP POLICY IF EXISTS "Authenticated users can create clubs" ON public."Cadastro Clube";
DROP POLICY IF EXISTS "Authenticated users can update clubs" ON public."Cadastro Clube";
DROP POLICY IF EXISTS "Authenticated users can delete clubs" ON public."Cadastro Clube";

CREATE POLICY "Users can view their own clubs" ON public."Cadastro Clube"
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clubs" ON public."Cadastro Clube"
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clubs" ON public."Cadastro Clube"
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clubs" ON public."Cadastro Clube"
FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for schedule_events
DROP POLICY IF EXISTS "Authenticated users can view schedule events" ON public.schedule_events;
DROP POLICY IF EXISTS "Authenticated users can create schedule events" ON public.schedule_events;
DROP POLICY IF EXISTS "Authenticated users can update schedule events" ON public.schedule_events;
DROP POLICY IF EXISTS "Authenticated users can delete schedule events" ON public.schedule_events;

CREATE POLICY "Users can view their own schedule events" ON public.schedule_events
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedule events" ON public.schedule_events
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedule events" ON public.schedule_events
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedule events" ON public.schedule_events
FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for financiadores
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar financiadores" ON public.financiadores;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir financiadores" ON public.financiadores;
DROP POLICY IF EXISTS "Usuários autenticados podem editar financiadores" ON public.financiadores;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar financiadores" ON public.financiadores;

CREATE POLICY "Users can view their own financiadores" ON public.financiadores
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own financiadores" ON public.financiadores
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financiadores" ON public.financiadores
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financiadores" ON public.financiadores
FOR DELETE USING (auth.uid() = user_id);