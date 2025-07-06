
-- Create the recruiter_reviews table
CREATE TABLE public.recruiter_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_email VARCHAR(255) NOT NULL,
  company_email VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_email, proposal_id) -- Una recensione per proposta per azienda
);

-- Enable RLS for the reviews table
ALTER TABLE public.recruiter_reviews ENABLE ROW LEVEL SECURITY;

-- Policy to allow companies to create reviews for proposals they received
CREATE POLICY "Companies can create reviews for proposals they received" 
  ON public.recruiter_reviews 
  FOR INSERT 
  WITH CHECK (
    proposal_id IN (
      SELECT id FROM public.proposals 
      WHERE job_offer_id IN (
        SELECT id FROM public.job_offers 
        WHERE contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  );

-- Policy to allow everyone to view recruiter reviews (public)
CREATE POLICY "Everyone can view recruiter reviews" 
  ON public.recruiter_reviews 
  FOR SELECT 
  USING (true);

-- Policy to allow companies to update their own reviews
CREATE POLICY "Companies can update their own reviews" 
  ON public.recruiter_reviews 
  FOR UPDATE 
  USING (
    company_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX idx_recruiter_reviews_recruiter_email ON public.recruiter_reviews(recruiter_email);
CREATE INDEX idx_recruiter_reviews_company_email ON public.recruiter_reviews(company_email);
CREATE INDEX idx_recruiter_reviews_proposal_id ON public.recruiter_reviews(proposal_id);
