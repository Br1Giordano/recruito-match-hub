
-- Tabella per le registrazioni dei recruiter
CREATE TABLE public.recruiter_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cognome VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  azienda VARCHAR(255),
  esperienza VARCHAR(100),
  settori TEXT,
  messaggio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Tabella per le registrazioni delle aziende
CREATE TABLE public.company_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_azienda VARCHAR(255) NOT NULL,
  settore VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  messaggio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Abilitare RLS per sicurezza (anche se per ora i dati sono pubblici durante la beta)
ALTER TABLE public.recruiter_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_registrations ENABLE ROW LEVEL SECURITY;

-- Policy per permettere inserimenti pubblici (beta phase)
CREATE POLICY "Allow public insert for recruiter registrations" 
  ON public.recruiter_registrations 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public insert for company registrations" 
  ON public.company_registrations 
  FOR INSERT 
  WITH CHECK (true);

-- Indici per performance
CREATE INDEX idx_recruiter_email ON public.recruiter_registrations(email);
CREATE INDEX idx_company_email ON public.company_registrations(email);
CREATE INDEX idx_recruiter_created_at ON public.recruiter_registrations(created_at);
CREATE INDEX idx_company_created_at ON public.company_registrations(created_at);
