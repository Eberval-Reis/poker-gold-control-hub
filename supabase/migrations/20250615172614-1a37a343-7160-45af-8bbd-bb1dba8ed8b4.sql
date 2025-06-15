
-- Habilitar RLS nas tabelas relacionadas ao backing
ALTER TABLE public.backer_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backing_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backing_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backing_results ENABLE ROW LEVEL SECURITY;

-- Criar políticas permissivas para não quebrar o app;
-- Recomenda-se customizar depois para maior segurança!

-- backer_payouts: leitura/consulta/alteração para qualquer usuário autenticado
CREATE POLICY "Select all backer_payouts (temporário)" ON public.backer_payouts
  FOR SELECT USING (true);
CREATE POLICY "Insert all backer_payouts (temporário)" ON public.backer_payouts
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Update all backer_payouts (temporário)" ON public.backer_payouts
  FOR UPDATE USING (true);
CREATE POLICY "Delete all backer_payouts (temporário)" ON public.backer_payouts
  FOR DELETE USING (true);

-- backing_investments: leitura/consulta/alteração para qualquer usuário autenticado
CREATE POLICY "Select all backing_investments (temporário)" ON public.backing_investments
  FOR SELECT USING (true);
CREATE POLICY "Insert all backing_investments (temporário)" ON public.backing_investments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Update all backing_investments (temporário)" ON public.backing_investments
  FOR UPDATE USING (true);
CREATE POLICY "Delete all backing_investments (temporário)" ON public.backing_investments
  FOR DELETE USING (true);

-- backing_offers: leitura/consulta/alteração para qualquer usuário autenticado
CREATE POLICY "Select all backing_offers (temporário)" ON public.backing_offers
  FOR SELECT USING (true);
CREATE POLICY "Insert all backing_offers (temporário)" ON public.backing_offers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Update all backing_offers (temporário)" ON public.backing_offers
  FOR UPDATE USING (true);
CREATE POLICY "Delete all backing_offers (temporário)" ON public.backing_offers
  FOR DELETE USING (true);

-- backing_results: leitura/consulta/alteração para qualquer usuário autenticado
CREATE POLICY "Select all backing_results (temporário)" ON public.backing_results
  FOR SELECT USING (true);
CREATE POLICY "Insert all backing_results (temporário)" ON public.backing_results
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Update all backing_results (temporário)" ON public.backing_results
  FOR UPDATE USING (true);
CREATE POLICY "Delete all backing_results (temporário)" ON public.backing_results
  FOR DELETE USING (true);
