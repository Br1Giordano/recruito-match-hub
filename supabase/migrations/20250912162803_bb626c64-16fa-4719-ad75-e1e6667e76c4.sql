-- Admins can view all proposals
CREATE POLICY "Admins can view all proposals"
ON public.proposals
FOR SELECT
USING (public.is_admin((auth.jwt() ->> 'email')::text));