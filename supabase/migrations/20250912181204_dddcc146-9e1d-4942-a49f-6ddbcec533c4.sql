-- Update Giulia Rossi to Imma Schembri
UPDATE public.recruiter_registrations 
SET nome = 'Imma', cognome = 'Schembri'
WHERE nome = 'Giulia' AND cognome = 'Rossi';