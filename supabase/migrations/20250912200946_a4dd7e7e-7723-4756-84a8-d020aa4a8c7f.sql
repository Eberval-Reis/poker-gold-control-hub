-- Update RLS policies for backing tables
-- backing_offers
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

-- backing_investments
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

-- backing_results
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