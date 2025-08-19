
-- Verifica il constraint esistente per employment_type
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'job_offers'::regclass 
AND conname LIKE '%employment_type%';

-- Se necessario, aggiorna il constraint per includere tutti i valori validi
ALTER TABLE job_offers 
DROP CONSTRAINT IF EXISTS job_offers_employment_type_check;

-- Aggiungi il constraint aggiornato con tutti i valori validi
ALTER TABLE job_offers 
ADD CONSTRAINT job_offers_employment_type_check 
CHECK (employment_type IN (
  'tempo-indeterminato',
  'tempo-determinato', 
  'full-time',
  'part-time',
  'contratto-progetto',
  'partita-iva',
  'stage',
  'tirocinio',
  'apprendistato',
  'consulenza'
));
