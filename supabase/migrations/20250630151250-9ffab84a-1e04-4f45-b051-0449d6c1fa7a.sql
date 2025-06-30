
-- Aggiungiamo le policy RLS per permettere alle aziende di vedere le proposte inviate a loro
CREATE POLICY "Companies can view proposals sent to them via job offers" 
  ON public.proposals 
  FOR SELECT 
  USING (
    job_offer_id IN (
      SELECT id FROM public.job_offers 
      WHERE contact_email = auth.email()
    )
    OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() 
      AND user_type = 'company'
      AND registration_id = proposals.company_id
    )
  );

-- Permettiamo anche l'inserimento anonimo di proposte
CREATE POLICY "Allow anonymous proposal submission" 
  ON public.proposals 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Permettiamo alle aziende di aggiornare lo stato delle proposte inviate a loro
CREATE POLICY "Companies can update proposal status" 
  ON public.proposals 
  FOR UPDATE 
  USING (
    job_offer_id IN (
      SELECT id FROM public.job_offers 
      WHERE contact_email = auth.email()
    )
    OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() 
      AND user_type = 'company'
      AND registration_id = proposals.company_id
    )
  );
