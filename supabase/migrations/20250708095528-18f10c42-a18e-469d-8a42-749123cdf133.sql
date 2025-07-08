-- Security Fix Migration: Add RLS policies and admin management (Fixed)

-- 1. Add RLS policies for recruiter_reviews table
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

-- 2. Create admin_users table to replace hardcoded admin emails
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow admins to manage admin users (bootstrap with existing admin)
CREATE POLICY "Admins can manage admin users" 
  ON public.admin_users 
  FOR ALL 
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'giordano.brunolucio@gmail.com'
    OR 
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (SELECT email FROM public.admin_users)
  )
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'giordano.brunolucio@gmail.com'
    OR 
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (SELECT email FROM public.admin_users)
  );

-- Insert the existing admin user
INSERT INTO public.admin_users (email, role) 
VALUES ('giordano.brunolucio@gmail.com', 'admin');

-- 3. Add input validation constraints (only if they don't exist)
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

-- 4. Add indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- 5. Create security function for admin check
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