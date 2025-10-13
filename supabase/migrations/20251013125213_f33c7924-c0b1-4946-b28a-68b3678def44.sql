-- Normalize expense types from Portuguese to English
-- This ensures all expense categories are stored in a consistent format

UPDATE expenses
SET type = 'transport'
WHERE type = 'transporte';

UPDATE expenses
SET type = 'food'
WHERE type = 'alimentacao' OR type = 'alimentação';

UPDATE expenses
SET type = 'accommodation'
WHERE type = 'hospedagem';

UPDATE expenses
SET type = 'material'
WHERE type = 'material';

UPDATE expenses
SET type = 'other'
WHERE type = 'outro' OR type = 'outros';