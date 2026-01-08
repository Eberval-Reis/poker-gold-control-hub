-- Add new columns to backing_offers for bankroll model
ALTER TABLE backing_offers 
ADD COLUMN IF NOT EXISTS offer_type text NOT NULL DEFAULT 'tournament',
ADD COLUMN IF NOT EXISTS total_bankroll numeric NULL,
ADD COLUMN IF NOT EXISTS period_description text NULL,
ADD COLUMN IF NOT EXISTS start_date date NULL,
ADD COLUMN IF NOT EXISTS end_date date NULL;

-- Add check constraint for offer_type
ALTER TABLE backing_offers 
ADD CONSTRAINT backing_offers_offer_type_check 
CHECK (offer_type IN ('tournament', 'bankroll'));

-- Add comment for documentation
COMMENT ON COLUMN backing_offers.offer_type IS 'Type of backing offer: tournament (specific tournament) or bankroll (total amount for period)';
COMMENT ON COLUMN backing_offers.total_bankroll IS 'Total bankroll amount for bankroll-type offers';
COMMENT ON COLUMN backing_offers.period_description IS 'Description of the period/event for bankroll offers';