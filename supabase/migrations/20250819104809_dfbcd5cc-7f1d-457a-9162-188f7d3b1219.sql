
-- Controlliamo tutti i constraint esistenti sulla tabella job_offers
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'job_offers'::regclass;

-- Rimuoviamo TUTTI i possibili constraint su employment_type
DO $$ 
DECLARE
    constraint_rec RECORD;
BEGIN
    -- Trova e rimuovi tutti i constraint che contengono 'employment_type'
    FOR constraint_rec IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'job_offers'::regclass 
        AND contype = 'c'
        AND pg_get_constraintdef(oid) ILIKE '%employment_type%'
    LOOP
        EXECUTE 'ALTER TABLE job_offers DROP CONSTRAINT IF EXISTS ' || constraint_rec.conname;
        RAISE NOTICE 'Dropped constraint: %', constraint_rec.conname;
    END LOOP;
END $$;

-- Aspettiamo un momento per essere sicuri che i constraint siano stati rimossi
SELECT pg_sleep(1);

-- Ora ricreiamo il constraint corretto
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

-- Verifichiamo che il nuovo constraint sia stato creato
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'job_offers'::regclass 
AND conname = 'job_offers_employment_type_valid';
