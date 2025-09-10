-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow all club operations" ON public."Cadastro Clube";
DROP POLICY IF EXISTS "Select all backing_offers (temporário)" ON public.backing_offers;
DROP POLICY IF EXISTS "Insert all backing_offers (temporário)" ON public.backing_offers;
DROP POLICY IF EXISTS "Update all backing_offers (temporário)" ON public.backing_offers;
DROP POLICY IF EXISTS "Delete all backing_offers (temporário)" ON public.backing_offers;
DROP POLICY IF EXISTS "Select all backing_investments (temporário)" ON public.backing_investments;
DROP POLICY IF EXISTS "Insert all backing_investments (temporário)" ON public.backing_investments;
DROP POLICY IF EXISTS "Update all backing_investments (temporário)" ON public.backing_investments;
DROP POLICY IF EXISTS "Delete all backing_investments (temporário)" ON public.backing_investments;
DROP POLICY IF EXISTS "Select all backing_results (temporário)" ON public.backing_results;
DROP POLICY IF EXISTS "Insert all backing_results (temporário)" ON public.backing_results;
DROP POLICY IF EXISTS "Update all backing_results (temporário)" ON public.backing_results;
DROP POLICY IF EXISTS "Delete all backing_results (temporário)" ON public.backing_results;
DROP POLICY IF EXISTS "Select all backer_payouts (temporário)" ON public.backer_payouts;
DROP POLICY IF EXISTS "Insert all backer_payouts (temporário)" ON public.backer_payouts;
DROP POLICY IF EXISTS "Update all backer_payouts (temporário)" ON public.backer_payouts;
DROP POLICY IF EXISTS "Delete all backer_payouts (temporário)" ON public.backer_payouts;
DROP POLICY IF EXISTS "Allow all tournament operations" ON public.tournaments;
DROP POLICY IF EXISTS "Allow all expense operations" ON public.expenses;
DROP POLICY IF EXISTS "Enable all access to tournament_performance" ON public.tournament_performance;
DROP POLICY IF EXISTS "Allow read all" ON public.schedule_events;
DROP POLICY IF EXISTS "Allow insert all" ON public.schedule_events;
DROP POLICY IF EXISTS "Allow update all" ON public.schedule_events;
DROP POLICY IF EXISTS "Allow delete all" ON public.schedule_events;

-- Create new authenticated-only policies for Cadastro Clube
CREATE POLICY "Authenticated users can view clubs" ON public."Cadastro Clube"
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create clubs" ON public."Cadastro Clube"
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update clubs" ON public."Cadastro Clube"
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete clubs" ON public."Cadastro Clube"
    FOR DELETE TO authenticated USING (true);

-- Create new authenticated-only policies for backing_offers
CREATE POLICY "Authenticated users can view backing offers" ON public.backing_offers
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create backing offers" ON public.backing_offers
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update backing offers" ON public.backing_offers
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete backing offers" ON public.backing_offers
    FOR DELETE TO authenticated USING (true);

-- Create new authenticated-only policies for backing_investments
CREATE POLICY "Authenticated users can view backing investments" ON public.backing_investments
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create backing investments" ON public.backing_investments
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update backing investments" ON public.backing_investments
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete backing investments" ON public.backing_investments
    FOR DELETE TO authenticated USING (true);

-- Create new authenticated-only policies for backing_results
CREATE POLICY "Authenticated users can view backing results" ON public.backing_results
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create backing results" ON public.backing_results
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update backing results" ON public.backing_results
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete backing results" ON public.backing_results
    FOR DELETE TO authenticated USING (true);

-- Create new authenticated-only policies for backer_payouts
CREATE POLICY "Authenticated users can view backer payouts" ON public.backer_payouts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create backer payouts" ON public.backer_payouts
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update backer payouts" ON public.backer_payouts
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete backer payouts" ON public.backer_payouts
    FOR DELETE TO authenticated USING (true);

-- Create new authenticated-only policies for tournaments
CREATE POLICY "Authenticated users can view tournaments" ON public.tournaments
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create tournaments" ON public.tournaments
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update tournaments" ON public.tournaments
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tournaments" ON public.tournaments
    FOR DELETE TO authenticated USING (true);

-- Create new authenticated-only policies for expenses
CREATE POLICY "Authenticated users can view expenses" ON public.expenses
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create expenses" ON public.expenses
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update expenses" ON public.expenses
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete expenses" ON public.expenses
    FOR DELETE TO authenticated USING (true);

-- Create new authenticated-only policies for tournament_performance
CREATE POLICY "Authenticated users can view tournament performance" ON public.tournament_performance
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create tournament performance" ON public.tournament_performance
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update tournament performance" ON public.tournament_performance
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tournament performance" ON public.tournament_performance
    FOR DELETE TO authenticated USING (true);

-- Create new authenticated-only policies for schedule_events
CREATE POLICY "Authenticated users can view schedule events" ON public.schedule_events
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create schedule events" ON public.schedule_events
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update schedule events" ON public.schedule_events
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete schedule events" ON public.schedule_events
    FOR DELETE TO authenticated USING (true);