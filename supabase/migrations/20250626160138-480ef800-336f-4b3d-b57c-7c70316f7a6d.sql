
-- Rimuovi le policy esistenti che sono troppo restrittive
DROP POLICY IF EXISTS "Users can manage their job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Everyone can view active job offers" ON public.job_offers;

-- Policy per permettere a tutti gli utenti autenticati di vedere le offerte attive
CREATE POLICY "Anyone can view active job offers" 
  ON public.job_offers 
  FOR SELECT 
  TO authenticated, anon
  USING (status = 'active');

-- Policy per permettere agli utenti di gestire le proprie offerte
CREATE POLICY "Users can manage their own job offers" 
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
  )
  WITH CHECK (
    -- Per le insert, permetti se l'email corrisponde o se hanno un company_id valido
    (contact_email = auth.jwt() ->> 'email')
    OR
    (company_id IS NOT NULL AND company_id IN (
      SELECT registration_id FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() AND user_type = 'company'
    ))
  );

-- Policy per permettere inserimenti dalle aziende
CREATE POLICY "Companies can create job offers" 
  ON public.job_offers 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    -- Permetti se l'email corrisponde o se hanno un company_id valido
    (contact_email = auth.jwt() ->> 'email')
    OR
    (company_id IS NOT NULL AND company_id IN (
      SELECT registration_id FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() AND user_type = 'company'
    ))
  );
