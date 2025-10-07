-- Add club_id column to tournament_performance table
ALTER TABLE tournament_performance 
ADD COLUMN club_id uuid REFERENCES "Cadastro Clube"(id);

-- Create index for better query performance
CREATE INDEX idx_tournament_performance_club_id 
ON tournament_performance(club_id);

-- Migrate existing data: populate club_id based on tournament_id
UPDATE tournament_performance tp
SET club_id = t.club_id
FROM tournaments t
WHERE tp.tournament_id = t.id 
AND tp.club_id IS NULL;