
-- Prima verifichiamo tutti i constraint esistenti
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'job_offers'::regclass
AND contype = 'c';

-- Rimuoviamo specificamente il constraint che sta causando problemi
ALTER TABLE job_offers DROP CONSTRAINT IF EXISTS job_offers_employment_type_check;

-- Rimuoviamo anche altri possibili constraint con nomi simili
ALTER TABLE job_offers DROP CONSTRAINT IF EXISTS job_offers_check;
ALTER TABLE job_offers DROP CONSTRAINT IF EXISTS employment_type_check;

-- Verifichiamo che tutti i constraint siano stati rimossi
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'job_offers'::regclass
AND contype = 'c'
AND pg_get_constraintdef(oid) ILIKE '%employment_type%';

-- Ora ricreiamo il constraint con il nome corretto
ALTER TABLE job_offers 
ADD CONSTRAINT job_offers_employment_type_valid 
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

-- Verifica finale
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'job_offers'::regclass
AND conname = 'job_offers_employment_type_valid';
