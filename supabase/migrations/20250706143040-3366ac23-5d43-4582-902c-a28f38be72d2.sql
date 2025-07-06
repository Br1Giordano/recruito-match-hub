
-- Add missing RLS policies for proposals table to allow recruiters to view their own proposals
-- and companies to view proposals for their job offers

-- Policy for recruiters to view their own proposals
CREATE POLICY "Recruiters can view their own proposals" 
  ON public.proposals 
  FOR SELECT 
  USING (
    recruiter_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR 
    recruiter_id IN (
      SELECT registration_id 
      FROM user_profiles 
      WHERE auth_user_id = auth.uid() AND user_type = 'recruiter'
    )
  );

-- Policy for companies to view proposals for their job offers
CREATE POLICY "Companies can view proposals for their job offers" 
  ON public.proposals 
  FOR SELECT 
  USING (
    job_offer_id IN (
      SELECT id 
      FROM job_offers 
      WHERE contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Policy for companies to update proposal status
CREATE POLICY "Companies can update proposal status" 
  ON public.proposals 
  FOR UPDATE 
  USING (
    job_offer_id IN (
      SELECT id 
      FROM job_offers 
      WHERE contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );
