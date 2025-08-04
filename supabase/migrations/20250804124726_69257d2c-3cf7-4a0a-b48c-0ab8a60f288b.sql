-- Adicionar colunas de valores financeiros na tabela tournaments
ALTER TABLE tournaments 
ADD COLUMN IF NOT EXISTS buyin_amount numeric,
ADD COLUMN IF NOT EXISTS rebuy_amount numeric,
ADD COLUMN IF NOT EXISTS addon_amount numeric;