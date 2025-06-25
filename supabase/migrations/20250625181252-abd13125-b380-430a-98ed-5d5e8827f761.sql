
-- Risolviamo i problemi RLS con DROP delle policy esistenti

-- 1. Abilitare RLS per tutte le tabelle di registrazione
ALTER TABLE public.company_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_registrations ENABLE ROW LEVEL SECURITY;

-- 2. Abilitare RLS per tutte le altre tabelle se non già abilitato
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Rimuovere e ricreare policy per user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can create their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = auth_user_id);

-- 4. Aggiornare le policy per job_offers per usare il nuovo sistema di autenticazione
DROP POLICY IF EXISTS "Companies can view their own job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Companies can create their own job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Companies can update their own job offers" ON public.job_offers;

CREATE POLICY "Companies can view their own job offers" 
  ON public.job_offers 
  FOR SELECT 
  USING (
    company_id IN (
      SELECT registration_id FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() AND user_type = 'company'
    )
  );

CREATE POLICY "Companies can create their own job offers" 
  ON public.job_offers 
  FOR INSERT 
  WITH CHECK (
    company_id IN (
      SELECT registration_id FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() AND user_type = 'company'
    )
  );

CREATE POLICY "Companies can update their own job offers" 
  ON public.job_offers 
  FOR UPDATE 
  USING (
    company_id IN (
      SELECT registration_id FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() AND user_type = 'company'
    )
  );

-- 5. Aggiornare le policy per proposal_responses
DROP POLICY IF EXISTS "Companies can manage responses to their proposals" ON public.proposal_responses;
DROP POLICY IF EXISTS "Recruiters can view responses to their proposals" ON public.proposal_responses;

CREATE POLICY "Companies can manage responses to their proposals" 
  ON public.proposal_responses 
  FOR ALL 
  USING (
    company_id IN (
      SELECT registration_id FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() AND user_type = 'company'
    )
  );

CREATE POLICY "Recruiters can view responses to their proposals" 
  ON public.proposal_responses 
  FOR SELECT 
  USING (
    proposal_id IN (
      SELECT id FROM public.proposals 
      WHERE recruiter_id IN (
        SELECT registration_id FROM public.user_profiles 
        WHERE auth_user_id = auth.uid() AND user_type = 'recruiter'
      )
    )
  );
