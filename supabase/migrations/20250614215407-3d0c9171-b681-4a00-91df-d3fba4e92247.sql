
-- Cria a tabela de eventos da agenda para comportar informações dos eventos
CREATE TABLE public.schedule_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Torna a tabela publicamente legível (caso você queira restringir depois, podemos ajustar RLS)
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read all" ON public.schedule_events
  FOR SELECT USING (true);
CREATE POLICY "Allow insert all" ON public.schedule_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update all" ON public.schedule_events
  FOR UPDATE USING (true);
CREATE POLICY "Allow delete all" ON public.schedule_events
  FOR DELETE USING (true);
