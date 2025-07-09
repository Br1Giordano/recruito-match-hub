-- Migration: Permanent Security Policies Fix
-- This migration ensures all RLS policies are properly set up and permanent

-- 1. Re-enable RLS on recruiter_reviews table (if it was disabled)
ALTER TABLE public.recruiter_reviews ENABLE ROW LEVEL SECURITY;

-- 2. Ensure RLS is enabled on all relevant tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_registrations ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Drop all existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Companies can create reviews for their proposals" ON public.recruiter_reviews;
DROP POLICY IF EXISTS "Companies can update their own reviews" ON public.recruiter_reviews;
DROP POLICY IF EXISTS "Everyone can view recruiter reviews" ON public.recruiter_reviews;

-- 4. Recreate comprehensive RLS policies for recruiter_reviews
CREATE POLICY "Companies can create reviews for their proposals" 
  ON public.recruiter_reviews 
  FOR INSERT 
  WITH CHECK (
    company_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Everyone can view recruiter reviews" 
  ON public.recruiter_reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Companies can update their own reviews" 
  ON public.recruiter_reviews 
  FOR UPDATE 
  USING (
    company_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  WITH CHECK (
    company_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- 5. Add missing DELETE policy for admins on recruiter_reviews
CREATE POLICY "Admins can delete reviews" 
  ON public.recruiter_reviews 
  FOR DELETE 
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (SELECT email FROM public.admin_users)
  );

-- 6. Ensure admin DELETE policies exist on other tables
DROP POLICY IF EXISTS "Admins can delete proposals" ON public.proposals;
CREATE POLICY "Admins can delete proposals" 
  ON public.proposals 
  FOR DELETE 
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (SELECT email FROM public.admin_users)
  );

-- 7. Add constraints to recruiter_reviews if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rating_range') THEN
    ALTER TABLE public.recruiter_reviews 
    ADD CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'review_text_length') THEN
    ALTER TABLE public.recruiter_reviews 
    ADD CONSTRAINT review_text_length CHECK (char_length(review_text) <= 500);
  END IF;
END
$$;

-- 8. Add security indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_recruiter_reviews_company_email ON public.recruiter_reviews(company_email);
CREATE INDEX IF NOT EXISTS idx_recruiter_reviews_recruiter_email ON public.recruiter_reviews(recruiter_email);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON public.user_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_recruiter_email ON public.proposals(recruiter_email);
CREATE INDEX IF NOT EXISTS idx_job_offers_contact_email ON public.job_offers(contact_email);

-- 9. Ensure is_admin function exists and is properly configured
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = user_email
  );
$$;