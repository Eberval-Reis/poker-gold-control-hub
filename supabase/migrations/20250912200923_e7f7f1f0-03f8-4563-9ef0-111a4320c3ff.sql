-- Update all RLS policies to filter by user_id

-- tournaments
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

-- tournament_performance
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

-- expenses
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