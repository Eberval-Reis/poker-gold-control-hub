
-- Passo 1: Remover o trigger dependente (se existir)
DROP TRIGGER IF EXISTS check_backing_percentage ON public.backing_investments;

-- Passo 2: Remover a função antiga
DROP FUNCTION IF EXISTS public.validate_backing_percentage();

-- Passo 3: Criar a função corrigida com search_path explícito e SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.validate_backing_percentage()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  IF (SELECT COALESCE(SUM(percentage_bought), 0) + NEW.percentage_bought 
      FROM backing_investments 
      WHERE backing_offer_id = NEW.backing_offer_id) > 
     (SELECT available_percentage 
      FROM backing_offers 
      WHERE id = NEW.backing_offer_id) THEN
    RAISE EXCEPTION 'Total percentage sold cannot exceed available percentage';
  END IF;
  RETURN NEW;
END;
$function$;

-- Passo 4: Recriar o trigger
CREATE TRIGGER check_backing_percentage
BEFORE INSERT OR UPDATE ON public.backing_investments
FOR EACH ROW
EXECUTE FUNCTION public.validate_backing_percentage();
