
-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Companies can create reviews for proposals they received" ON public.recruiter_reviews;
DROP POLICY IF EXISTS "Companies can update their own reviews" ON public.recruiter_reviews;

-- Create a new policy that allows companies to create reviews based on their email match
CREATE POLICY "Companies can create reviews for their proposals" 
  ON public.recruiter_reviews 
  FOR INSERT 
  WITH CHECK (
    company_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Create a new policy for updates
CREATE POLICY "Companies can update their own reviews" 
  ON public.recruiter_reviews 
  FOR UPDATE 
  USING (
    company_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  WITH CHECK (
    company_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
