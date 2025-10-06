-- Atualizar despesas antigas sem user_id para o usuário atual
-- Esta migration corrige as despesas que foram criadas sem user_id
UPDATE expenses 
SET user_id = 'aaef9296-c355-4ae5-b00d-97d78d30079a'
WHERE user_id IS NULL;