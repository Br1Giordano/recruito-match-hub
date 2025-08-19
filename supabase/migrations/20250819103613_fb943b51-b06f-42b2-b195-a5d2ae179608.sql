
-- Prima controlliamo quale constraint esiste attualmente
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'job_offers'::regclass 
AND contype = 'c';

-- Rimuoviamo completamente tutti i constraint di check su employment_type
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'job_offers_employment_type_check' AND conrelid = 'job_offers'::regclass) THEN
        ALTER TABLE job_offers DROP CONSTRAINT job_offers_employment_type_check;
    END IF;
END $$;

-- Verifichiamo i valori esistenti nella tabella
SELECT DISTINCT employment_type FROM job_offers WHERE employment_type IS NOT NULL;

-- Creiamo un nuovo constraint che include TUTTI i valori possibili
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
