
-- Tabella per le offerte di lavoro delle aziende
CREATE TABLE public.job_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.company_registrations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  salary_min INTEGER,
  salary_max INTEGER,
  requirements TEXT,
  benefits TEXT,
  employment_type VARCHAR(50) DEFAULT 'full-time' CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabella per le proposte inviate dai recruiter
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_id UUID NOT NULL REFERENCES public.recruiter_registrations(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.company_registrations(id) ON DELETE CASCADE,
  job_offer_id UUID REFERENCES public.job_offers(id) ON DELETE SET NULL,
  candidate_name VARCHAR(255) NOT NULL,
  candidate_email VARCHAR(255) NOT NULL,
  candidate_phone VARCHAR(20),
  candidate_linkedin VARCHAR(500),
  candidate_cv_url TEXT,
  proposal_description TEXT,
  years_experience INTEGER,
  current_salary INTEGER,
  expected_salary INTEGER,
  availability_weeks INTEGER,
  recruiter_fee_percentage INTEGER DEFAULT 15,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'hired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabella per le risposte delle aziende alle proposte
CREATE TABLE public.proposal_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.company_registrations(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('interested', 'not_interested', 'interview_scheduled', 'hired', 'rejected')),
  response_message TEXT,
  feedback_notes TEXT,
  interview_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Abilita RLS per tutte le tabelle
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_responses ENABLE ROW LEVEL SECURITY;

-- Policies per job_offers (le aziende vedono solo le proprie offerte)
CREATE POLICY "Companies can view their own job offers" 
  ON public.job_offers 
  FOR SELECT 
  USING (company_id IN (SELECT id FROM public.company_registrations WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Companies can create their own job offers" 
  ON public.job_offers 
  FOR INSERT 
  WITH CHECK (company_id IN (SELECT id FROM public.company_registrations WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Companies can update their own job offers" 
  ON public.job_offers 
  FOR UPDATE 
  USING (company_id IN (SELECT id FROM public.company_registrations WHERE email = auth.jwt() ->> 'email'));

-- Policies per proposals 
CREATE POLICY "Recruiters can view their own proposals" 
  ON public.proposals 
  FOR SELECT 
  USING (recruiter_id IN (SELECT id FROM public.recruiter_registrations WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Companies can view proposals sent to them" 
  ON public.proposals 
  FOR SELECT 
  USING (company_id IN (SELECT id FROM public.company_registrations WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Recruiters can create proposals" 
  ON public.proposals 
  FOR INSERT 
  WITH CHECK (recruiter_id IN (SELECT id FROM public.recruiter_registrations WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Companies can update proposal status" 
  ON public.proposals 
  FOR UPDATE 
  USING (company_id IN (SELECT id FROM public.company_registrations WHERE email = auth.jwt() ->> 'email'));

-- Policies per proposal_responses
CREATE POLICY "Companies can manage responses to their proposals" 
  ON public.proposal_responses 
  FOR ALL 
  USING (company_id IN (SELECT id FROM public.company_registrations WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Recruiters can view responses to their proposals" 
  ON public.proposal_responses 
  FOR SELECT 
  USING (proposal_id IN (SELECT id FROM public.proposals WHERE recruiter_id IN 
    (SELECT id FROM public.recruiter_registrations WHERE email = auth.jwt() ->> 'email')));

-- Indici per performance
CREATE INDEX idx_job_offers_company_id ON public.job_offers(company_id);
CREATE INDEX idx_job_offers_status ON public.job_offers(status);
CREATE INDEX idx_proposals_recruiter_id ON public.proposals(recruiter_id);
CREATE INDEX idx_proposals_company_id ON public.proposals(company_id);
CREATE INDEX idx_proposals_status ON public.proposals(status);
CREATE INDEX idx_proposal_responses_proposal_id ON public.proposal_responses(proposal_id);
