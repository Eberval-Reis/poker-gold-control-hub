
-- Adiciona coluna event_id à tabela tournaments, permitindo valor nulo
ALTER TABLE public.tournaments
ADD COLUMN event_id uuid NULL;

-- Cria a chave estrangeira para schedule_events.id
ALTER TABLE public.tournaments
ADD CONSTRAINT tournaments_event_id_fkey
FOREIGN KEY (event_id)
REFERENCES public.schedule_events(id)
ON DELETE SET NULL;

-- Opcional: adiciona comentário para facilitar manutenção futura
COMMENT ON COLUMN public.tournaments.event_id IS 'Evento associado ao torneio (agenda/evento especial)';
