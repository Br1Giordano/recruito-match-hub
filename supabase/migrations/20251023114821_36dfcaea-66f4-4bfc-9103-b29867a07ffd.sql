-- Create demo_requests table
CREATE TABLE public.demo_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cognome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(50),
  nome_azienda VARCHAR(255),
  messaggio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status VARCHAR(50) NOT NULL DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert demo requests (public form)
CREATE POLICY "Anyone can submit demo requests"
ON public.demo_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view demo requests
CREATE POLICY "Admins can view demo requests"
ON public.demo_requests
FOR SELECT
USING (is_admin((auth.jwt() ->> 'email'::text)));

-- Only admins can update demo requests
CREATE POLICY "Admins can update demo requests"
ON public.demo_requests
FOR UPDATE
USING (is_admin((auth.jwt() ->> 'email'::text)));

-- Add index for faster lookups
CREATE INDEX idx_demo_requests_created_at ON public.demo_requests(created_at DESC);
CREATE INDEX idx_demo_requests_email ON public.demo_requests(email);