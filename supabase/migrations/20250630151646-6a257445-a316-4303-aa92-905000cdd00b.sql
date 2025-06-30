
-- Prima eliminiamo le policy problematiche
DROP POLICY IF EXISTS "Companies can view proposals sent to them via job offers" ON public.proposals;
DROP POLICY IF EXISTS "Allow anonymous proposal submission" ON public.proposals;
DROP POLICY IF EXISTS "Companies can update proposal status" ON public.proposals;

-- Creiamo nuove policy corrette che non accedono alla tabella users
CREATE POLICY "Companies can view proposals for their job offers" 
  ON public.proposals 
  FOR SELECT 
  USING (
    job_offer_id IN (
      SELECT id FROM public.job_offers 
      WHERE contact_email = auth.email()
    )
  );

-- Permittiamo l'inserimento di proposte a tutti gli utenti autenticati
CREATE POLICY "Allow authenticated users to insert proposals" 
  ON public.proposals 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Permettiamo anche l'inserimento anonimo per i form pubblici
CREATE POLICY "Allow anonymous proposal insertion" 
  ON public.proposals 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Permettiamo alle aziende di aggiornare lo stato delle proposte per le loro offerte
CREATE POLICY "Companies can update proposals for their job offers" 
  ON public.proposals 
  FOR UPDATE 
  USING (
    job_offer_id IN (
      SELECT id FROM public.job_offers 
      WHERE contact_email = auth.email()
    )
  );
