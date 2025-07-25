-- Phase 1: Database Schema Enhancement for RLS Migration
-- Adding user_id columns and populating them safely

-- Add user_id columns to tables that need RLS
ALTER TABLE public.company_registrations 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.recruiter_registrations 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.job_offers 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.proposals 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create function to safely populate user_ids from emails
CREATE OR REPLACE FUNCTION public.populate_user_ids()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Update company_registrations with user_ids
  UPDATE public.company_registrations cr
  SET user_id = au.id
  FROM auth.users au
  WHERE cr.email = au.email
  AND cr.user_id IS NULL;

  -- Update recruiter_registrations with user_ids  
  UPDATE public.recruiter_registrations rr
  SET user_id = au.id
  FROM auth.users au
  WHERE rr.email = au.email
  AND rr.user_id IS NULL;

  -- Update job_offers with user_ids (match contact_email to auth users)
  UPDATE public.job_offers jo
  SET user_id = au.id
  FROM auth.users au
  WHERE jo.contact_email = au.email
  AND jo.user_id IS NULL;

  -- Update proposals with user_ids (match recruiter_email to auth users)
  UPDATE public.proposals p
  SET user_id = au.id
  FROM auth.users au
  WHERE p.recruiter_email = au.email
  AND p.user_id IS NULL;

  RAISE NOTICE 'User IDs populated successfully';
END;
$$;

-- Execute the population function
SELECT public.populate_user_ids();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_company_registrations_user_id ON public.company_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_registrations_user_id ON public.recruiter_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_user_id ON public.job_offers(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON public.proposals(user_id);

-- Create helper function to get current user's registration ID
CREATE OR REPLACE FUNCTION public.get_current_user_registration_id(table_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  reg_id uuid;
BEGIN
  IF table_name = 'company' THEN
    SELECT id INTO reg_id
    FROM public.company_registrations
    WHERE user_id = auth.uid()
    LIMIT 1;
  ELSIF table_name = 'recruiter' THEN
    SELECT id INTO reg_id
    FROM public.recruiter_registrations
    WHERE user_id = auth.uid()
    LIMIT 1;
  END IF;
  
  RETURN reg_id;
END;
$$;