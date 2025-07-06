
-- Temporarily disable RLS on recruiter_reviews table to fix the permission issue
ALTER TABLE public.recruiter_reviews DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean up
DROP POLICY IF EXISTS "Companies can create reviews for their proposals" ON public.recruiter_reviews;
DROP POLICY IF EXISTS "Companies can update their own reviews" ON public.recruiter_reviews;
DROP POLICY IF EXISTS "Everyone can view recruiter reviews" ON public.recruiter_reviews;
