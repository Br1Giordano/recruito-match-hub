-- Add DELETE policies for admin users on proposals table
CREATE POLICY "Admins can delete any proposal" 
ON public.proposals 
FOR DELETE 
USING (is_admin((auth.jwt() ->> 'email'::text)));

-- Add DELETE policies for admin users on job_offers table  
CREATE POLICY "Admins can delete any job offer" 
ON public.job_offers 
FOR DELETE 
USING (is_admin((auth.jwt() ->> 'email'::text)));