-- Add policy to allow admins to view all job offers
CREATE POLICY "Admins can view all job offers" 
ON public.job_offers 
FOR SELECT 
USING (is_admin((auth.jwt() ->> 'email'::text)));