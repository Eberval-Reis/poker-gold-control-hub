-- Atualizar todas as performances que usam "Clube não especificado" para "Sete Nove Zero"
UPDATE tournament_performance
SET club_id = '434e322f-31d4-4ab1-8fba-bf46421ddda8'
WHERE club_id = '26e54dd3-ed7a-4fc0-abbc-cf17cdcce96a';

-- Atualizar torneios que usam "Clube não especificado" para "Sete Nove Zero"
UPDATE tournaments
SET club_id = '434e322f-31d4-4ab1-8fba-bf46421ddda8'
WHERE club_id = '26e54dd3-ed7a-4fc0-abbc-cf17cdcce96a';