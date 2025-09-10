-- Create new authenticated-only policies for tournaments (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tournaments' AND policyname = 'Authenticated users can view tournaments') THEN
        CREATE POLICY "Authenticated users can view tournaments" ON public.tournaments
            FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tournaments' AND policyname = 'Authenticated users can create tournaments') THEN
        CREATE POLICY "Authenticated users can create tournaments" ON public.tournaments
            FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tournaments' AND policyname = 'Authenticated users can update tournaments') THEN
        CREATE POLICY "Authenticated users can update tournaments" ON public.tournaments
            FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tournaments' AND policyname = 'Authenticated users can delete tournaments') THEN
        CREATE POLICY "Authenticated users can delete tournaments" ON public.tournaments
            FOR DELETE TO authenticated USING (true);
    END IF;
END $$;

-- Create new authenticated-only policies for tournament_performance (if they don't exist)  
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tournament_performance' AND policyname = 'Authenticated users can view tournament performance') THEN
        CREATE POLICY "Authenticated users can view tournament performance" ON public.tournament_performance
            FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tournament_performance' AND policyname = 'Authenticated users can create tournament performance') THEN
        CREATE POLICY "Authenticated users can create tournament performance" ON public.tournament_performance
            FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tournament_performance' AND policyname = 'Authenticated users can update tournament performance') THEN
        CREATE POLICY "Authenticated users can update tournament performance" ON public.tournament_performance
            FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tournament_performance' AND policyname = 'Authenticated users can delete tournament performance') THEN
        CREATE POLICY "Authenticated users can delete tournament performance" ON public.tournament_performance
            FOR DELETE TO authenticated USING (true);
    END IF;
END $$;

-- Create new authenticated-only policies for schedule_events (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'schedule_events' AND policyname = 'Authenticated users can view schedule events') THEN
        CREATE POLICY "Authenticated users can view schedule events" ON public.schedule_events
            FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'schedule_events' AND policyname = 'Authenticated users can create schedule events') THEN
        CREATE POLICY "Authenticated users can create schedule events" ON public.schedule_events
            FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'schedule_events' AND policyname = 'Authenticated users can update schedule events') THEN
        CREATE POLICY "Authenticated users can update schedule events" ON public.schedule_events
            FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'schedule_events' AND policyname = 'Authenticated users can delete schedule events') THEN
        CREATE POLICY "Authenticated users can delete schedule events" ON public.schedule_events
            FOR DELETE TO authenticated USING (true);
    END IF;
END $$;