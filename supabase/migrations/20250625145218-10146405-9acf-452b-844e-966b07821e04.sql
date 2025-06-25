
-- Disabilita RLS per le tabelle di registrazione per permettere inserimenti anonimi
ALTER TABLE public.recruiter_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_registrations DISABLE ROW LEVEL SECURITY;

-- In alternativa, se preferisci mantenere RLS attiva, puoi creare policy per permettere inserimenti anonimi:
-- ALTER TABLE public.recruiter_registrations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.company_registrations ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow anonymous insertions for recruiter registrations" 
--   ON public.recruiter_registrations 
--   FOR INSERT 
--   TO anon 
--   WITH CHECK (true);

-- CREATE POLICY "Allow anonymous insertions for company registrations" 
--   ON public.company_registrations 
--   FOR INSERT 
--   TO anon 
--   WITH CHECK (true);
