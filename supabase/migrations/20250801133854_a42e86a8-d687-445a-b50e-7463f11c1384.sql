-- Adicionar coluna tournament_date na tabela tournament_performance
ALTER TABLE public.tournament_performance 
ADD COLUMN tournament_date DATE;

-- Migrar dados existentes usando created_at como base (converter para data)
UPDATE public.tournament_performance 
SET tournament_date = created_at::date 
WHERE tournament_date IS NULL;

-- Tornar o campo obrigatório após a migração
ALTER TABLE public.tournament_performance 
ALTER COLUMN tournament_date SET NOT NULL;