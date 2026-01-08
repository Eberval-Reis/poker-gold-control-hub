-- Allow tournament_id to be nullable for bankroll offers
ALTER TABLE backing_offers 
ALTER COLUMN tournament_id DROP NOT NULL;