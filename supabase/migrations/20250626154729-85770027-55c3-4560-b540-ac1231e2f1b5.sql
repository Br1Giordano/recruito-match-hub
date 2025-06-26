
-- Semplifichiamo la struttura: aggiungiamo i campi azienda direttamente in job_offers
ALTER TABLE public.job_offers 
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);

-- Rendiamo company_id opzionale (per retrocompatibilità)
ALTER TABLE public.job_offers 
ALTER COLUMN company_id DROP NOT NULL;

-- Aggiorniamo le policy RLS per un accesso più semplice
DROP POLICY IF EXISTS "Companies can view their own job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Companies can create their own job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Companies can update their own job offers" ON public.job_offers;

-- Policy semplice: gli utenti autenticati possono gestire le loro offerte
CREATE POLICY "Users can manage their job offers" 
  ON public.job_offers 
  FOR ALL 
  TO authenticated
  USING (
    -- Se company_id esiste, controlla attraverso user_profiles
    (company_id IS NOT NULL AND company_id IN (
      SELECT registration_id FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() AND user_type = 'company'
    ))
    OR 
    -- Se contact_email esiste, controlla l'email dell'utente
    (contact_email IS NOT NULL AND contact_email = auth.jwt() ->> 'email')
    OR
    -- Per le nuove offerte senza company_id
    (company_id IS NULL AND contact_email = auth.jwt() ->> 'email')
  )
  WITH CHECK (
    -- Per le insert, permetti se l'email corrisponde
    contact_email = auth.jwt() ->> 'email'
  );

-- Policy per visualizzare tutte le offerte attive (per recruiter)
CREATE POLICY "Everyone can view active job offers" 
  ON public.job_offers 
  FOR SELECT 
  TO authenticated
  USING (status = 'active');
