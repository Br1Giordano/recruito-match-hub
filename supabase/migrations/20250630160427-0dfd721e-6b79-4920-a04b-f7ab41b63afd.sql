
-- Rimuoviamo tutte le policy rimanenti su proposal_responses
DROP POLICY IF EXISTS "Companies can manage responses to their proposals" ON public.proposal_responses;
DROP POLICY IF EXISTS "Companies can view responses to their proposals" ON public.proposal_responses;
DROP POLICY IF EXISTS "Companies can create responses to proposals" ON public.proposal_responses;
DROP POLICY IF EXISTS "Companies can update their proposal responses" ON public.proposal_responses;

-- Rimuoviamo anche tutte le policy rimanenti su proposals
DROP POLICY IF EXISTS "enable_update_for_companies_on_proposals" ON public.proposals;
DROP POLICY IF EXISTS "enable_select_for_companies_on_proposals" ON public.proposals;
DROP POLICY IF EXISTS "enable_insert_for_everyone_on_proposals" ON public.proposals;
DROP POLICY IF EXISTS "enable_delete_for_companies_on_proposals" ON public.proposals;

-- Disabilitiamo completamente RLS su entrambe le tabelle
ALTER TABLE public.proposal_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals DISABLE ROW LEVEL SECURITY;

-- Rimuoviamo tutti i constraint di foreign key
ALTER TABLE public.proposal_responses 
DROP CONSTRAINT IF EXISTS proposal_responses_company_id_fkey;

-- Ora modifichiamo i tipi di colonna da UUID a VARCHAR
ALTER TABLE public.proposal_responses 
ALTER COLUMN company_id TYPE VARCHAR(255);

ALTER TABLE public.proposals 
ALTER COLUMN company_id TYPE VARCHAR(255);
