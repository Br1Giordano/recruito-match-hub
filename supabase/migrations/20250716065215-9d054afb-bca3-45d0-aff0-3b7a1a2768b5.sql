-- Corregge gli URL LinkedIn nel database aggiungendo il protocollo https://
UPDATE recruiter_registrations 
SET linkedin_url = CASE 
  WHEN linkedin_url IS NOT NULL AND linkedin_url != '' AND NOT linkedin_url LIKE 'http%'
  THEN 'https://' || linkedin_url
  ELSE linkedin_url
END
WHERE linkedin_url IS NOT NULL;

-- Corregge anche gli URL dei siti web
UPDATE recruiter_registrations 
SET website_url = CASE 
  WHEN website_url IS NOT NULL AND website_url != '' AND NOT website_url LIKE 'http%'
  THEN 'https://' || website_url
  ELSE website_url
END
WHERE website_url IS NOT NULL;

-- Aggiunge indici per migliorare le performance nelle ricerche per email
CREATE INDEX IF NOT EXISTS idx_recruiter_registrations_email ON recruiter_registrations(email);
CREATE INDEX IF NOT EXISTS idx_proposals_recruiter_email ON proposals(recruiter_email);