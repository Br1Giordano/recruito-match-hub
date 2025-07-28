-- Create enum first
CREATE TYPE access_level_enum AS ENUM ('restricted', 'partial', 'full');

-- Add fields for data protection in proposals table
ALTER TABLE public.proposals 
ADD COLUMN candidate_cv_anonymized_url text,
ADD COLUMN contact_data_protected boolean DEFAULT true,
ADD COLUMN company_access_level access_level_enum DEFAULT 'restricted';

-- Add indexes for better performance  
CREATE INDEX idx_proposals_contact_protected ON public.proposals(contact_data_protected);
CREATE INDEX idx_proposals_access_level ON public.proposals(company_access_level);