-- Remove a constraint antiga que exige markup >= 1.2
ALTER TABLE backing_offers DROP CONSTRAINT backing_offers_markup_percentage_check;

-- Adiciona nova constraint que permite markup >= 1 (1 = sem markup)
ALTER TABLE backing_offers ADD CONSTRAINT backing_offers_markup_percentage_check CHECK (markup_percentage >= 1);