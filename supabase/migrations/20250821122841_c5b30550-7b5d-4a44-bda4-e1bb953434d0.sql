-- Rimuoviamo DEFINITIVAMENTE il constraint problematico
ALTER TABLE job_offers DROP CONSTRAINT job_offers_employment_type_check;

-- Rimuoviamo anche il constraint che potrebbe essere stato creato nelle migrazioni precedenti
ALTER TABLE job_offers DROP CONSTRAINT IF EXISTS job_offers_employment_type_valid;

-- Creiamo il constraint finale con i valori corretti che corrispondono al form
ALTER TABLE job_offers 
ADD CONSTRAINT job_offers_employment_type_check 
CHECK (employment_type IS NULL OR employment_type IN (
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

-- Verifica che il constraint sia stato creato correttamente
SELECT conname, pg_get_constraintdef(oid) as definition 
FROM pg_constraint 
WHERE conrelid = 'job_offers'::regclass 
AND contype = 'c' 
AND conname = 'job_offers_employment_type_check';