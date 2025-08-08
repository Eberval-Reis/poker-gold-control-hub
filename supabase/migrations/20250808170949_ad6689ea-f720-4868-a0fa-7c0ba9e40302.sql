-- Adicionar campos de email e endereço na tabela financiadores
ALTER TABLE financiadores 
ADD COLUMN email text,
ADD COLUMN endereco text;