
-- First, drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view active job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Companies can manage their own job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Companies can view proposals for their job offers" ON public.proposals;
DROP POLICY IF EXISTS "Authenticated users can insert proposals" ON public.proposals;
DROP POLICY IF EXISTS "Anonymous users can insert proposals" ON public.proposals;
DROP POLICY IF EXISTS "Companies can update proposals for their job offers" ON public.proposals;
DROP POLICY IF EXISTS "Admin users can delete proposals" ON public.proposals;
DROP POLICY IF EXISTS "Companies can view their proposal responses" ON public.proposal_responses;
DROP POLICY IF EXISTS "Companies can insert proposal responses" ON public.proposal_responses;
DROP POLICY IF EXISTS "Companies can update their proposal responses" ON public.proposal_responses;

-- PHASE 1: IMMEDIATE DATA PROTECTION - Re-enable RLS on critical tables
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

-- PHASE 2: CREATE SECURE ACCESS POLICIES FOR JOB OFFERS
-- Allow everyone to view active job offers (for recruiter browsing)
CREATE POLICY "Anyone can view active job offers" 
  ON public.job_offers 
  FOR SELECT 
  USING (status = 'active');

-- Companies can manage their own job offers
CREATE POLICY "Companies can manage their own job offers" 
  ON public.job_offers 
  FOR ALL 
  TO authenticated
  USING (
    contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  WITH CHECK (
    contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- PHASE 3: CREATE SECURE ACCESS POLICIES FOR PROPOSALS
-- Policy 1: Companies can view proposals sent to their job offers
CREATE POLICY "Companies can view proposals for their job offers" 
  ON public.proposals 
  FOR SELECT 
  USING (
    job_offer_id IN (
      SELECT id FROM public.job_offers 
      WHERE contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Policy 2: Allow authenticated recruiters to insert proposals
CREATE POLICY "Authenticated users can insert proposals" 
  ON public.proposals 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Policy 3: Allow anonymous users to insert proposals (for public form submissions)
CREATE POLICY "Anonymous users can insert proposals" 
  ON public.proposals 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Policy 4: Companies can update proposal status for their job offers
CREATE POLICY "Companies can update proposals for their job offers" 
  ON public.proposals 
  FOR UPDATE 
  USING (
    job_offer_id IN (
      SELECT id FROM public.job_offers 
      WHERE contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Policy 5: Admin users can delete inappropriate proposals
CREATE POLICY "Admin users can delete proposals" 
  ON public.proposals 
  FOR DELETE 
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'giordano.brunolucio@gmail.com'
  );

-- PHASE 4: CREATE SECURE ACCESS POLICIES FOR PROPOSAL RESPONSES
-- Policy 1: Companies can view responses to their proposals
CREATE POLICY "Companies can view their proposal responses" 
  ON public.proposal_responses 
  FOR SELECT 
  USING (
    proposal_id IN (
      SELECT id FROM public.proposals 
      WHERE job_offer_id IN (
        SELECT id FROM public.job_offers 
        WHERE contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  );

-- Policy 2: Companies can insert responses to proposals for their job offers
CREATE POLICY "Companies can insert proposal responses" 
  ON public.proposal_responses 
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

-- Policy 3: Companies can update their own responses
CREATE POLICY "Companies can update their proposal responses" 
  ON public.proposal_responses 
  FOR UPDATE 
  USING (
    proposal_id IN (
      SELECT id FROM public.proposals 
      WHERE job_offer_id IN (
        SELECT id FROM public.job_offers 
        WHERE contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  );
