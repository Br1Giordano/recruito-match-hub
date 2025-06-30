
-- Disabilita RLS su tutte le tabelle principali
ALTER TABLE public.job_offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_responses DISABLE ROW LEVEL SECURITY;

-- Rimuovi tutte le policy esistenti per job_offers
DROP POLICY IF EXISTS "Anyone can view active job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Users can manage their own job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Companies can create job offers" ON public.job_offers;

-- Rimuovi eventuali altre policy esistenti
DROP POLICY IF EXISTS "Users can view their own proposals" ON public.proposals;
DROP POLICY IF EXISTS "Users can create proposals" ON public.proposals;
DROP POLICY IF EXISTS "Users can update their own proposals" ON public.proposals;
DROP POLICY IF EXISTS "Users can delete their own proposals" ON public.proposals;
