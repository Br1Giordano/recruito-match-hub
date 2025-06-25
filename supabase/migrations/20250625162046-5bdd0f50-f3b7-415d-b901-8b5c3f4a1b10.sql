
-- First, let's secure the registration tables with proper RLS policies
-- This allows anonymous users to register but prevents them from viewing other registrations

-- For recruiter_registrations
DROP POLICY IF EXISTS "Allow public insert for recruiter registrations" ON public.recruiter_registrations;
DROP POLICY IF EXISTS "Allow anonymous insertions for recruiter registrations" ON public.recruiter_registrations;

CREATE POLICY "Allow anonymous registration for recruiters" 
  ON public.recruiter_registrations 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Recruiters can view their own registration" 
  ON public.recruiter_registrations 
  FOR SELECT 
  USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

-- For company_registrations  
DROP POLICY IF EXISTS "Allow public insert for company registrations" ON public.company_registrations;
DROP POLICY IF EXISTS "Allow anonymous insertions for company registrations" ON public.company_registrations;

CREATE POLICY "Allow anonymous registration for companies" 
  ON public.company_registrations 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Companies can view their own registration" 
  ON public.company_registrations 
  FOR SELECT 
  USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

-- Fix the broken RLS policies for existing tables
-- Update job_offers policies to use proper auth.uid() instead of JWT email matching
DROP POLICY IF EXISTS "Companies can view their own job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Companies can create their own job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Companies can update their own job offers" ON public.job_offers;

CREATE POLICY "Companies can view their own job offers" 
  ON public.job_offers 
  FOR SELECT 
  USING (company_id IN (SELECT id FROM public.company_registrations WHERE auth.uid()::text = id::text));

CREATE POLICY "Companies can create their own job offers" 
  ON public.job_offers 
  FOR INSERT 
  WITH CHECK (company_id IN (SELECT id FROM public.company_registrations WHERE auth.uid()::text = id::text));

CREATE POLICY "Companies can update their own job offers" 
  ON public.job_offers 
  FOR UPDATE 
  USING (company_id IN (SELECT id FROM public.company_registrations WHERE auth.uid()::text = id::text));

-- Update proposals policies
DROP POLICY IF EXISTS "Recruiters can view their own proposals" ON public.proposals;
DROP POLICY IF EXISTS "Companies can view proposals sent to them" ON public.proposals;
DROP POLICY IF EXISTS "Recruiters can create proposals" ON public.proposals;
DROP POLICY IF EXISTS "Companies can update proposal status" ON public.proposals;

CREATE POLICY "Recruiters can view their own proposals" 
  ON public.proposals 
  FOR SELECT 
  USING (recruiter_id IN (SELECT id FROM public.recruiter_registrations WHERE auth.uid()::text = id::text));

CREATE POLICY "Companies can view proposals sent to them" 
  ON public.proposals 
  FOR SELECT 
  USING (company_id IN (SELECT id FROM public.company_registrations WHERE auth.uid()::text = id::text));

CREATE POLICY "Recruiters can create proposals" 
  ON public.proposals 
  FOR INSERT 
  WITH CHECK (recruiter_id IN (SELECT id FROM public.recruiter_registrations WHERE auth.uid()::text = id::text));

CREATE POLICY "Companies can update proposal status" 
  ON public.proposals 
  FOR UPDATE 
  USING (company_id IN (SELECT id FROM public.company_registrations WHERE auth.uid()::text = id::text));

-- Update proposal_responses policies
DROP POLICY IF EXISTS "Companies can manage responses to their proposals" ON public.proposal_responses;
DROP POLICY IF EXISTS "Recruiters can view responses to their proposals" ON public.proposal_responses;

CREATE POLICY "Companies can manage responses to their proposals" 
  ON public.proposal_responses 
  FOR ALL 
  USING (company_id IN (SELECT id FROM public.company_registrations WHERE auth.uid()::text = id::text));

CREATE POLICY "Recruiters can view responses to their proposals" 
  ON public.proposal_responses 
  FOR SELECT 
  USING (proposal_id IN (
    SELECT id FROM public.proposals 
    WHERE recruiter_id IN (
      SELECT id FROM public.recruiter_registrations WHERE auth.uid()::text = id::text
    )
  ));

-- Create a profiles table to link Supabase auth users to our registration tables
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('recruiter', 'company')),
  registration_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can create their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = auth_user_id);
