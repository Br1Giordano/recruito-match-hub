
-- Crea un bucket per i CV dei candidati
INSERT INTO storage.buckets (id, name, public)
VALUES ('candidate-cvs', 'candidate-cvs', true);

-- Crea politiche per il bucket dei CV
CREATE POLICY "Anyone can upload CVs" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'candidate-cvs');

CREATE POLICY "Anyone can view CVs" ON storage.objects
FOR SELECT USING (bucket_id = 'candidate-cvs');

CREATE POLICY "Anyone can update CVs" ON storage.objects
FOR UPDATE USING (bucket_id = 'candidate-cvs');

CREATE POLICY "Anyone can delete CVs" ON storage.objects
FOR DELETE USING (bucket_id = 'candidate-cvs');
