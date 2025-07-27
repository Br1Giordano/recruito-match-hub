-- Add admin policies for managing recruiter and company registrations

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Admins can manage all recruiter registrations" ON public.recruiter_registrations;
DROP POLICY IF EXISTS "Admins can manage all company registrations" ON public.company_registrations;

-- Add comprehensive admin policies for recruiter_registrations
CREATE POLICY "Admins can manage all recruiter registrations"
ON public.recruiter_registrations
FOR ALL
TO authenticated
USING (is_admin((auth.jwt() ->> 'email'::text)))
WITH CHECK (is_admin((auth.jwt() ->> 'email'::text)));

-- Add comprehensive admin policies for company_registrations  
CREATE POLICY "Admins can manage all company registrations"
ON public.company_registrations
FOR ALL
TO authenticated
USING (is_admin((auth.jwt() ->> 'email'::text)))
WITH CHECK (is_admin((auth.jwt() ->> 'email'::text)));