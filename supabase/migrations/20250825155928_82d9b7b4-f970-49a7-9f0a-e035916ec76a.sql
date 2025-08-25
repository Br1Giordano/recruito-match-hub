-- Create a function to update job offers when company name changes
CREATE OR REPLACE FUNCTION sync_company_name_to_job_offers()
RETURNS TRIGGER AS $$
BEGIN
  -- Update all job offers for this company when the company name changes
  IF OLD.nome_azienda IS DISTINCT FROM NEW.nome_azienda THEN
    UPDATE job_offers 
    SET company_name = NEW.nome_azienda,
        updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires when company registration is updated
CREATE TRIGGER trigger_sync_company_name
  AFTER UPDATE ON company_registrations
  FOR EACH ROW
  EXECUTE FUNCTION sync_company_name_to_job_offers();

-- Also update existing job offers to match current company names
UPDATE job_offers 
SET company_name = cr.nome_azienda,
    updated_at = now()
FROM company_registrations cr 
WHERE job_offers.user_id = cr.user_id 
AND job_offers.company_name != cr.nome_azienda;