-- Update RLS policies for remaining tables

-- backer_payouts
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

-- Cadastro Clube
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

-- schedule_events
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

-- financiadores
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