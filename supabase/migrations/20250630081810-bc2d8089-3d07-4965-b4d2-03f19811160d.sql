
-- Prima eliminiamo TUTTE le policy esistenti sulla tabella proposals
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'proposals' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.proposals';
    END LOOP;
END $$;

-- Ora creiamo le nuove policy con nomi univoci
-- Le aziende possono vedere le proposte per le loro offerte
CREATE POLICY "enable_select_for_companies_on_proposals" 
  ON public.proposals 
  FOR SELECT 
  USING (
    company_id IN (
      SELECT cr.id 
      FROM company_registrations cr 
      WHERE cr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
    OR 
    company_id IN (
      SELECT jo.company_id 
      FROM job_offers jo 
      WHERE jo.contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Permettere inserimento anonimo di proposte (qualsiasi utente può inviare)
CREATE POLICY "enable_insert_for_everyone_on_proposals" 
  ON public.proposals 
  FOR INSERT 
  WITH CHECK (true);

-- Solo le aziende possono aggiornare lo stato delle proposte
CREATE POLICY "enable_update_for_companies_on_proposals" 
  ON public.proposals 
  FOR UPDATE 
  USING (
    company_id IN (
      SELECT cr.id 
      FROM company_registrations cr 
      WHERE cr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
    OR 
    company_id IN (
      SELECT jo.company_id 
      FROM job_offers jo 
      WHERE jo.contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Le aziende possono eliminare proposte inappropriate
CREATE POLICY "enable_delete_for_companies_on_proposals" 
  ON public.proposals 
  FOR DELETE 
  USING (
    company_id IN (
      SELECT cr.id 
      FROM company_registrations cr 
      WHERE cr.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
    OR 
    company_id IN (
      SELECT jo.company_id 
      FROM job_offers jo 
      WHERE jo.contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );
