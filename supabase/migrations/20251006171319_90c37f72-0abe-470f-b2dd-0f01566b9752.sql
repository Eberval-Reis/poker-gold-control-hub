-- Atualizar performances antigas sem user_id para o usuário atual
-- Esta migration corrige as performances de torneio que foram criadas sem user_id
UPDATE tournament_performance 
SET user_id = 'aaef9296-c355-4ae5-b00d-97d78d30079a'
WHERE user_id IS NULL;