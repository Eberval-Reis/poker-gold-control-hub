
-- 1. Cria tabela financiadores
CREATE TABLE public.financiadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  cpf TEXT,
  nickname TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. (Opcional) Index para buscas rápidas por nome/whatsapp
CREATE INDEX idx_financiadores_name ON public.financiadores(name);
CREATE INDEX idx_financiadores_whatsapp ON public.financiadores(whatsapp);

-- 3. Habilita Row Level Security
ALTER TABLE public.financiadores ENABLE ROW LEVEL SECURITY;

-- 4. Política ampla: permite SELECT/INSERT/UPDATE/DELETE para todos os usuários autenticados
CREATE POLICY "Usuários autenticados podem visualizar financiadores"
  ON public.financiadores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir financiadores"
  ON public.financiadores
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem editar financiadores"
  ON public.financiadores
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar financiadores"
  ON public.financiadores
  FOR DELETE
  TO authenticated
  USING (true);
