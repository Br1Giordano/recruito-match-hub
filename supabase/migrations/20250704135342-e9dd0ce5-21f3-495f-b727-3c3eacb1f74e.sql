
-- Aggiorna la tabella recruiter_registrations per includere informazioni aggiuntive del profilo
ALTER TABLE public.recruiter_registrations 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS specializations TEXT[],
ADD COLUMN IF NOT EXISTS years_of_experience INTEGER,
ADD COLUMN IF NOT EXISTS location TEXT;

-- Crea un bucket per gli avatar dei recruiter
INSERT INTO storage.buckets (id, name, public)
VALUES ('recruiter-avatars', 'recruiter-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Crea politiche per il bucket degli avatar
CREATE POLICY "Anyone can upload recruiter avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'recruiter-avatars');

CREATE POLICY "Anyone can view recruiter avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'recruiter-avatars');

CREATE POLICY "Anyone can update recruiter avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'recruiter-avatars');

CREATE POLICY "Recruiters can delete their own avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'recruiter-avatars');

-- Permette ai recruiter di aggiornare il proprio profilo
CREATE POLICY "Recruiters can update their own profile" ON public.recruiter_registrations
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.auth_user_id = auth.uid() 
    AND user_profiles.user_type = 'recruiter' 
    AND user_profiles.registration_id = recruiter_registrations.id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.auth_user_id = auth.uid() 
    AND user_profiles.user_type = 'recruiter' 
    AND user_profiles.registration_id = recruiter_registrations.id
  )
);
