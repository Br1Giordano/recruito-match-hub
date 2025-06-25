
-- Phase 1: Fix Critical Authentication Issues

-- 1. Create a trigger function to automatically create user_profiles when users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_type_value TEXT;
BEGIN
  -- Get user_type from metadata (set during signup)
  user_type_value := NEW.raw_user_meta_data ->> 'user_type';
  
  -- Only proceed if user_type is valid
  IF user_type_value IN ('recruiter', 'company') THEN
    -- Insert into user_profiles table
    INSERT INTO public.user_profiles (auth_user_id, user_type, registration_id)
    VALUES (
      NEW.id,
      user_type_value::VARCHAR(20),
      gen_random_uuid() -- Temporary UUID, will be updated when they complete registration
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Update RLS policies to properly link auth users to registration data

-- Fix recruiter_registrations policies
DROP POLICY IF EXISTS "Allow anonymous registration for recruiters" ON public.recruiter_registrations;
DROP POLICY IF EXISTS "Recruiters can view their own registration" ON public.recruiter_registrations;

CREATE POLICY "Allow anonymous registration for recruiters" 
  ON public.recruiter_registrations 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view linked registrations" 
  ON public.recruiter_registrations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() 
      AND user_type = 'recruiter'
      AND registration_id = recruiter_registrations.id
    )
  );

-- Fix company_registrations policies  
DROP POLICY IF EXISTS "Allow anonymous registration for companies" ON public.company_registrations;
DROP POLICY IF EXISTS "Companies can view their own registration" ON public.company_registrations;

CREATE POLICY "Allow anonymous registration for companies" 
  ON public.company_registrations 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view linked registrations" 
  ON public.company_registrations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() 
      AND user_type = 'company'
      AND registration_id = company_registrations.id
    )
  );

-- Fix proposals policies to use proper authentication
DROP POLICY IF EXISTS "Recruiters can view their own proposals" ON public.proposals;
DROP POLICY IF EXISTS "Companies can view proposals sent to them" ON public.proposals;
DROP POLICY IF EXISTS "Recruiters can create proposals" ON public.proposals;
DROP POLICY IF EXISTS "Companies can update proposal status" ON public.proposals;

CREATE POLICY "Recruiters can view their own proposals" 
  ON public.proposals 
  FOR SELECT 
  USING (
    recruiter_id IN (
      SELECT registration_id FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() AND user_type = 'recruiter'
    )
  );

CREATE POLICY "Companies can view proposals sent to them" 
  ON public.proposals 
  FOR SELECT 
  USING (
    company_id IN (
      SELECT registration_id FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() AND user_type = 'company'
    )
  );

CREATE POLICY "Recruiters can create proposals" 
  ON public.proposals 
  FOR INSERT 
  WITH CHECK (
    recruiter_id IN (
      SELECT registration_id FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() AND user_type = 'recruiter'
    )
  );

CREATE POLICY "Companies can update proposal status" 
  ON public.proposals 
  FOR UPDATE 
  USING (
    company_id IN (
      SELECT registration_id FROM public.user_profiles 
      WHERE auth_user_id = auth.uid() AND user_type = 'company'
    )
  );

-- 4. Add function to link existing registrations to user profiles
CREATE OR REPLACE FUNCTION public.link_user_to_registration(
  p_registration_id UUID,
  p_user_type VARCHAR(20)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the user_profile to link to the actual registration
  UPDATE public.user_profiles 
  SET registration_id = p_registration_id
  WHERE auth_user_id = auth.uid() 
  AND user_type = p_user_type;
  
  RETURN FOUND;
END;
$$;
