-- Allow admins to view all proposals
CREATE POLICY IF NOT EXISTS "Admins can view all proposals"
ON public.proposals
FOR SELECT
USING (public.is_admin((auth.jwt() ->> 'email')::text));

-- Optional: make it easy for admin UIs that join proposal_responses
CREATE POLICY IF NOT EXISTS "Admins can view all proposal responses"
ON public.proposal_responses
FOR SELECT
USING (public.is_admin((auth.jwt() ->> 'email')::text));