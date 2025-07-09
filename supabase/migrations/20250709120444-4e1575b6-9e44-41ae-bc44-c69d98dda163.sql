-- Disable RLS completely on all tables to restore site functionality

-- Disable RLS on all main tables
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies to clean up
-- admin_users policies
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;

-- company_registrations policies
DROP POLICY IF EXISTS "Allow anonymous registration for companies" ON public.company_registrations;
DROP POLICY IF EXISTS "Allow authenticated users to view linked registrations" ON public.company_registrations;

-- job_offers policies
DROP POLICY IF EXISTS "Companies can manage their own job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Anyone can view active job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Users can manage their own job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Companies can create job offers" ON public.job_offers;

-- proposal_responses policies
DROP POLICY IF EXISTS "Companies can view their proposal responses" ON public.proposal_responses;
DROP POLICY IF EXISTS "Companies can insert proposal responses" ON public.proposal_responses;
DROP POLICY IF EXISTS "Companies can update their proposal responses" ON public.proposal_responses;
DROP POLICY IF EXISTS "Recruiters can view responses to their proposals" ON public.proposal_responses;

-- proposals policies
DROP POLICY IF EXISTS "Authenticated users can insert proposals" ON public.proposals;
DROP POLICY IF EXISTS "Anonymous users can insert proposals" ON public.proposals;
DROP POLICY IF EXISTS "Admin users can delete proposals" ON public.proposals;
DROP POLICY IF EXISTS "Recruiters can view their own proposals" ON public.proposals;
DROP POLICY IF EXISTS "Companies can view proposals for their job offers" ON public.proposals;
DROP POLICY IF EXISTS "Companies can update proposal status" ON public.proposals;
DROP POLICY IF EXISTS "Admins can delete proposals" ON public.proposals;

-- recruiter_registrations policies
DROP POLICY IF EXISTS "Allow anonymous registration for recruiters" ON public.recruiter_registrations;
DROP POLICY IF EXISTS "Allow authenticated users to view linked registrations" ON public.recruiter_registrations;
DROP POLICY IF EXISTS "Recruiters can update their own profile" ON public.recruiter_registrations;

-- recruiter_reviews policies
DROP POLICY IF EXISTS "Companies can create reviews for their proposals" ON public.recruiter_reviews;
DROP POLICY IF EXISTS "Everyone can view recruiter reviews" ON public.recruiter_reviews;
DROP POLICY IF EXISTS "Companies can update their own reviews" ON public.recruiter_reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.recruiter_reviews;

-- user_profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- login_attempts policies
DROP POLICY IF EXISTS "Service role can manage login attempts" ON public.login_attempts;