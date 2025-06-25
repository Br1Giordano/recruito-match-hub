
-- Risolviamo i problemi di sicurezza identificati

-- 1. Correggere la funzione link_user_to_registration per impostare correttamente search_path
DROP FUNCTION IF EXISTS public.link_user_to_registration(uuid, character varying);

CREATE OR REPLACE FUNCTION public.link_user_to_registration(
  p_registration_id UUID,
  p_user_type VARCHAR(20)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the user_profile to link to the actual registration
  UPDATE public.user_profiles 
  SET registration_id = p_registration_id
  WHERE auth_user_id = auth.uid() 
  AND user_type = p_user_type;
  
  RETURN FOUND;
END;
$$;

-- 2. Configurare OTP con expiry time appropriato (ridotto a 5 minuti)
-- Questo richiede configurazione lato Supabase Auth, ma possiamo impostare una policy
-- per monitorare i tentativi di accesso

-- 3. Abilitare protezione password leaked (configurazione Auth)
-- Questo deve essere fatto nelle impostazioni di Supabase Auth

-- 4. Creare una policy per limitare i tentativi di login
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  attempt_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  success BOOLEAN DEFAULT false
);

-- Abilitare RLS per login_attempts
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Policy per login_attempts (solo service_role può gestire)
CREATE POLICY "Service role can manage login attempts" 
  ON public.login_attempts 
  FOR ALL 
  TO service_role 
  WITH CHECK (true);

-- Funzione per pulire vecchi tentativi di login
CREATE OR REPLACE FUNCTION public.cleanup_old_login_attempts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.login_attempts 
  WHERE attempt_time < now() - interval '1 hour';
$$;
