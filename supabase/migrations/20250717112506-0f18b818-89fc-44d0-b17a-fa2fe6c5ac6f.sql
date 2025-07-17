-- Aggiungi campo logo_url alla tabella company_registrations
ALTER TABLE public.company_registrations 
ADD COLUMN logo_url TEXT;

-- Crea bucket per i logo delle aziende
INSERT INTO storage.buckets (id, name, public) 
VALUES ('company-logos', 'company-logos', true);

-- Crea policy per permettere alle aziende di caricare i propri logo
CREATE POLICY "Companies can upload their own logos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'company-logos' AND
  auth.uid() IS NOT NULL
);

-- Crea policy per permettere a tutti di vedere i logo delle aziende
CREATE POLICY "Company logos are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'company-logos');

-- Crea policy per permettere alle aziende di aggiornare i propri logo
CREATE POLICY "Companies can update their own logos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'company-logos' AND auth.uid() IS NOT NULL);

-- Crea policy per permettere alle aziende di eliminare i propri logo
CREATE POLICY "Companies can delete their own logos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'company-logos' AND auth.uid() IS NOT NULL);