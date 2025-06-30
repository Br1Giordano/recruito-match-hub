
-- Rimuoviamo il vincolo di foreign key per company_id nella tabella proposals
-- per permettere l'invio anonimo di proposte
ALTER TABLE public.proposals 
DROP CONSTRAINT IF EXISTS proposals_company_id_fkey;

-- Rendiamo il campo company_id opzionale
ALTER TABLE public.proposals 
ALTER COLUMN company_id DROP NOT NULL;
