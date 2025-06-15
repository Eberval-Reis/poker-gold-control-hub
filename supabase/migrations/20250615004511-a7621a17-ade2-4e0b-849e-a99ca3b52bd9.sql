
-- Atualizar a constraint do campo result_type na tabela backing_results
-- para aceitar valores em português: 'busto', 'itm', 'ft', 'campeao'.
-- 1. Remover a constraint existente (nome real pode variar)
ALTER TABLE backing_results
  DROP CONSTRAINT IF EXISTS backing_results_result_type_check;

-- 2. Criar nova constraint permitindo os novos valores em pt-br
ALTER TABLE backing_results
  ADD CONSTRAINT backing_results_result_type_check 
  CHECK (result_type IN ('busto', 'itm', 'ft', 'campeao'));
