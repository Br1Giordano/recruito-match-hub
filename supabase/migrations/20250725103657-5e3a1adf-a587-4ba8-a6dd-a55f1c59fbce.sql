-- Phase 3: Controlled RLS Implementation - Start with core tables
-- Enable RLS and create basic policies for user_profiles (most critical)

-- Enable RLS on user_profiles first (core authentication table)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles - users can only access their own profile
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = auth_user_id);

-- Enable RLS on recruiter_registrations
ALTER TABLE public.recruiter_registrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for recruiter_registrations
CREATE POLICY "Recruiters can manage their own registration" 
ON public.recruiter_registrations 
FOR ALL 
USING (auth.uid() = user_id);

-- Allow companies to read recruiter profiles for proposal purposes (public info)
CREATE POLICY "Companies can view recruiter profiles" 
ON public.recruiter_registrations 
FOR SELECT 
USING (true);

-- Enable RLS on company_registrations  
ALTER TABLE public.company_registrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for company_registrations
CREATE POLICY "Companies can manage their own registration" 
ON public.company_registrations 
FOR ALL 
USING (auth.uid() = user_id);

-- Allow recruiters to read company profiles for proposal purposes (public info)
CREATE POLICY "Recruiters can view company profiles" 
ON public.company_registrations 
FOR SELECT 
USING (true);