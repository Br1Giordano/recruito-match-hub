-- Creo prima la funzione per aggiornare updated_at se non esiste
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabella per tracciare le job offers prese in carico dai recruiter
CREATE TABLE public.recruiter_job_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_email VARCHAR NOT NULL,
  job_offer_id UUID NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'interested', -- interested, removed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(recruiter_email, job_offer_id)
);

-- Enable RLS
ALTER TABLE public.recruiter_job_interests ENABLE ROW LEVEL SECURITY;

-- Policies per recruiter_job_interests
CREATE POLICY "Recruiters can view their own interests"
ON public.recruiter_job_interests
FOR SELECT
USING (recruiter_email = (auth.jwt() ->> 'email'));

CREATE POLICY "Recruiters can manage their own interests"
ON public.recruiter_job_interests
FOR ALL
USING (recruiter_email = (auth.jwt() ->> 'email'));

-- Companies can view interests for their job offers
CREATE POLICY "Companies can view interests for their job offers"
ON public.recruiter_job_interests
FOR SELECT
USING (
  job_offer_id IN (
    SELECT id FROM public.job_offers 
    WHERE user_id = auth.uid()
  )
);

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_recruiter_job_interests_updated_at
BEFORE UPDATE ON public.recruiter_job_interests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();