-- Criar tabela para agendamentos de torneios
CREATE TABLE IF NOT EXISTS public.tournament_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.schedule_events(id) ON DELETE SET NULL,
  event_name text,
  tournament_id uuid REFERENCES public.tournaments(id) ON DELETE CASCADE,
  tournament_name text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  buy_in numeric NOT NULL DEFAULT 0,
  rebuys integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'not_done')),
  reason text,
  user_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.tournament_schedules ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own tournament schedules"
  ON public.tournament_schedules
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tournament schedules"
  ON public.tournament_schedules
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tournament schedules"
  ON public.tournament_schedules
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tournament schedules"
  ON public.tournament_schedules
  FOR DELETE
  USING (auth.uid() = user_id);

-- Índices para melhor performance
CREATE INDEX idx_tournament_schedules_user_id ON public.tournament_schedules(user_id);
CREATE INDEX idx_tournament_schedules_date ON public.tournament_schedules(date);
CREATE INDEX idx_tournament_schedules_status ON public.tournament_schedules(status);