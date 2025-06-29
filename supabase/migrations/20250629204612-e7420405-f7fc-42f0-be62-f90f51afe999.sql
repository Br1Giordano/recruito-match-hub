
-- Aggiungere i campi recruiter direttamente alla tabella proposals
-- e rendere recruiter_id opzionale per permettere questo nuovo approccio

-- Aggiungere i nuovi campi per i dati del recruiter
ALTER TABLE public.proposals 
ADD COLUMN recruiter_name VARCHAR,
ADD COLUMN recruiter_email VARCHAR,
ADD COLUMN recruiter_phone VARCHAR,
ADD COLUMN submitted_by_user_id UUID;

-- Rendere recruiter_id opzionale per permettere il nuovo approccio
ALTER TABLE public.proposals 
ALTER COLUMN recruiter_id DROP NOT NULL;

-- Aggiungere un constraint per assicurarsi che almeno uno dei due approcci sia utilizzato
ALTER TABLE public.proposals 
ADD CONSTRAINT proposals_recruiter_info_check 
CHECK (
  (recruiter_id IS NOT NULL) OR 
  (recruiter_name IS NOT NULL AND recruiter_email IS NOT NULL)
);
