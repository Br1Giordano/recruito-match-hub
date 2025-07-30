-- Prima rimuoviamo il vincolo di unicità problematico se esiste
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'recruiter_job_interests_recruiter_email_job_offer_id_key'
    ) THEN
        ALTER TABLE recruiter_job_interests 
        DROP CONSTRAINT recruiter_job_interests_recruiter_email_job_offer_id_key;
    END IF;
END $$;

-- Aggiungiamo un nuovo vincolo che permette multiple entries ma solo una "interested" per volta
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_interest 
ON recruiter_job_interests (recruiter_email, job_offer_id) 
WHERE status = 'interested';