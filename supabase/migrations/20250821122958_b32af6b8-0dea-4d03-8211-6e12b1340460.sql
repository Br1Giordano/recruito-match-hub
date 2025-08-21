-- Prima rimuoviamo TUTTI i constraint su employment_type
ALTER TABLE job_offers DROP CONSTRAINT IF EXISTS job_offers_employment_type_check;
ALTER TABLE job_offers DROP CONSTRAINT IF EXISTS job_offers_employment_type_valid;
ALTER TABLE job_offers DROP CONSTRAINT IF EXISTS employment_type_check;

-- Aggiorniamo tutti i valori esistenti
UPDATE job_offers 
SET employment_type = CASE 
  WHEN employment_type = 'contract' THEN 'contratto-progetto'
  WHEN employment_type = 'internship' THEN 'stage'
  WHEN employment_type NOT IN ('tempo-indeterminato', 'tempo-determinato', 'full-time', 'part-time', 'contratto-progetto', 'partita-iva', 'stage', 'tirocinio', 'apprendistato', 'consulenza') THEN 'full-time'
  ELSE employment_type
END
WHERE employment_type IS NOT NULL;

-- Ora creiamo il constraint finale
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