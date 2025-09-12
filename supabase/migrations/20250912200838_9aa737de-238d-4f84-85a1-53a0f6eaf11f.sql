-- Update RLS policies for tournaments
DROP POLICY IF EXISTS "Users can view their own tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Users can create their own tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Users can update their own tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Users can delete their own tournaments" ON public.tournaments;

CREATE POLICY "Users can view their own tournaments" ON public.tournaments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tournaments" ON public.tournaments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tournaments" ON public.tournaments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tournaments" ON public.tournaments
FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for tournament_performance
DROP POLICY IF EXISTS "Users can view their own tournament performance" ON public.tournament_performance;
DROP POLICY IF EXISTS "Users can create their own tournament performance" ON public.tournament_performance;
DROP POLICY IF EXISTS "Users can update their own tournament performance" ON public.tournament_performance;
DROP POLICY IF EXISTS "Users can delete their own tournament performance" ON public.tournament_performance;

CREATE POLICY "Users can view their own tournament performance" ON public.tournament_performance
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tournament performance" ON public.tournament_performance
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tournament performance" ON public.tournament_performance
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tournament performance" ON public.tournament_performance
FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for expenses
DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can create their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expenses;

CREATE POLICY "Users can view their own expenses" ON public.expenses
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses" ON public.expenses
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON public.expenses
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON public.expenses
FOR DELETE USING (auth.uid() = user_id);