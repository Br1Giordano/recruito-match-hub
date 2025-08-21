-- Prima aggiorniamo tutti i valori esistenti per renderli compatibili con il nuovo constraint
UPDATE job_offers 
SET employment_type = CASE 
  WHEN employment_type = 'contract' THEN 'contratto-progetto'
  WHEN employment_type = 'internship' THEN 'stage'
  WHEN employment_type NOT IN ('tempo-indeterminato', 'tempo-determinato', 'full-time', 'part-time', 'contratto-progetto', 'partita-iva', 'stage', 'tirocinio', 'apprendistato', 'consulenza') THEN 'full-time'
  ELSE employment_type
END
WHERE employment_type IS NOT NULL;

-- Ora rimuoviamo il constraint problematico
ALTER TABLE job_offers DROP CONSTRAINT job_offers_employment_type_check;

-- Rimuoviamo anche eventuali altri constraint
ALTER TABLE job_offers DROP CONSTRAINT IF EXISTS job_offers_employment_type_valid;

-- Creiamo il constraint corretto
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