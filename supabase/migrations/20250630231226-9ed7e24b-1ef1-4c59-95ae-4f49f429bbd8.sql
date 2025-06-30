
-- Disabilitiamo completamente RLS sulla tabella proposals
ALTER TABLE public.proposals DISABLE ROW LEVEL SECURITY;

-- Eliminiamo tutte le policy esistenti sulla tabella proposals
DROP POLICY IF EXISTS "Companies can view proposals for their job offers" ON public.proposals;
DROP POLICY IF EXISTS "Allow authenticated users to insert proposals" ON public.proposals;
DROP POLICY IF EXISTS "Allow anonymous proposal insertion" ON public.proposals;
DROP POLICY IF EXISTS "Companies can update proposals for their job offers" ON public.proposals;

-- Ora le proposte sono completamente pubbliche, proprio come le job offers
-- L'accesso sarà gestito a livello applicativo, non tramite RLS
