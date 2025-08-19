
-- Add a processing status field to track CV anonymization
ALTER TABLE proposals 
ADD COLUMN cv_processing_status TEXT DEFAULT 'pending' CHECK (cv_processing_status IN ('pending', 'processing', 'completed', 'error'));

-- Add a field to store the original CV filename
ALTER TABLE proposals 
ADD COLUMN candidate_cv_original_filename TEXT;

-- Add an index for better performance on processing queries
CREATE INDEX idx_proposals_cv_processing_status ON proposals(cv_processing_status);

-- Add trigger to automatically set processing status when CV URL is added
CREATE OR REPLACE FUNCTION set_cv_processing_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If CV URL is added and processing status is pending, mark as processing
  IF NEW.candidate_cv_url IS NOT NULL AND OLD.candidate_cv_url IS NULL THEN
    NEW.cv_processing_status = 'processing';
  END IF;
  
  -- If anonymized CV URL is set, mark as completed
  IF NEW.candidate_cv_anonymized_url IS NOT NULL AND OLD.candidate_cv_anonymized_url IS NULL THEN
    NEW.cv_processing_status = 'completed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cv_processing_status
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION set_cv_processing_status();
