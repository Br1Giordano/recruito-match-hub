-- Continue RLS implementation for remaining critical tables

-- Enable RLS on job_offers
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

-- RLS policies for job_offers  
CREATE POLICY "Companies can manage their own job offers" 
ON public.job_offers 
FOR ALL 
USING (auth.uid() = user_id);

-- Allow recruiters to view active job offers
CREATE POLICY "Recruiters can view active job offers" 
ON public.job_offers 
FOR SELECT 
USING (status = 'active');

-- Enable RLS on proposals
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- RLS policies for proposals - users can see proposals they created or that are for their job offers
CREATE POLICY "Users can view their own proposals" 
ON public.proposals 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT user_id FROM public.job_offers WHERE id = proposals.job_offer_id
  )
);

CREATE POLICY "Recruiters can create proposals" 
ON public.proposals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update proposals they created" 
ON public.proposals 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Companies can update status of proposals for their job offers
CREATE POLICY "Companies can update proposal status" 
ON public.proposals 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.job_offers WHERE id = proposals.job_offer_id
  )
);

-- Enable RLS on proposal_responses
ALTER TABLE public.proposal_responses ENABLE ROW LEVEL SECURITY;

-- RLS policies for proposal_responses
CREATE POLICY "Users can view responses to their proposals" 
ON public.proposal_responses 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.proposals WHERE id = proposal_responses.proposal_id
  ) OR
  auth.uid() IN (
    SELECT user_id FROM public.job_offers jo 
    JOIN public.proposals p ON jo.id = p.job_offer_id 
    WHERE p.id = proposal_responses.proposal_id
  )
);

CREATE POLICY "Companies can create responses" 
ON public.proposal_responses 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.job_offers jo 
    JOIN public.proposals p ON jo.id = p.job_offer_id 
    WHERE p.id = proposal_responses.proposal_id
  )
);

-- Enable RLS on recruiter_reviews
ALTER TABLE public.recruiter_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for recruiter_reviews - public read, authenticated write
CREATE POLICY "Anyone can view recruiter reviews" 
ON public.recruiter_reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create reviews" 
ON public.recruiter_reviews 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Enable RLS on admin_users (admin only access)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access admin_users" 
ON public.admin_users 
FOR ALL 
USING (public.is_admin(auth.jwt() ->> 'email'));

-- Enable RLS on login_attempts (system access only)
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System only access to login_attempts" 
ON public.login_attempts 
FOR ALL 
USING (false);