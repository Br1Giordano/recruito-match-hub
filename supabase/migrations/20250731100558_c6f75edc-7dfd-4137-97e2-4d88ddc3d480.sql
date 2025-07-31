-- Create table for company fiscal data
CREATE TABLE public.company_fiscal_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  codice_fiscale VARCHAR(16),
  partita_iva VARCHAR(11),
  ragione_sociale TEXT,
  codice_sdi VARCHAR(7),
  pec VARCHAR(255),
  indirizzo_fatturazione TEXT,
  cap_fatturazione VARCHAR(5),
  citta_fatturazione VARCHAR(100),
  provincia_fatturazione VARCHAR(2),
  iban VARCHAR(34),
  swift VARCHAR(11),
  is_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

-- Add foreign key constraint
ALTER TABLE public.company_fiscal_data 
ADD CONSTRAINT fk_company_fiscal_data_company_id 
FOREIGN KEY (company_id) REFERENCES public.company_registrations(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.company_fiscal_data ENABLE ROW LEVEL SECURITY;

-- Create policies for company fiscal data
CREATE POLICY "Companies can view their own fiscal data" 
ON public.company_fiscal_data 
FOR SELECT 
USING (
  company_id IN (
    SELECT id FROM public.company_registrations 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Companies can insert their own fiscal data" 
ON public.company_fiscal_data 
FOR INSERT 
WITH CHECK (
  company_id IN (
    SELECT id FROM public.company_registrations 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Companies can update their own fiscal data" 
ON public.company_fiscal_data 
FOR UPDATE 
USING (
  company_id IN (
    SELECT id FROM public.company_registrations 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all fiscal data" 
ON public.company_fiscal_data 
FOR ALL 
USING (is_admin((auth.jwt() ->> 'email'::text)))
WITH CHECK (is_admin((auth.jwt() ->> 'email'::text)));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_company_fiscal_data_updated_at
BEFORE UPDATE ON public.company_fiscal_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();