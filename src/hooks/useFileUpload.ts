
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, folder: string = ''): Promise<string | null> => {
    if (!file) return null;

    // Validazione del file
    if (file.type !== 'application/pdf') {
      toast({
        title: "Errore",
        description: "Solo file PDF sono consentiti",
        variant: "destructive",
      });
      return null;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB max
      toast({
        title: "Errore",
        description: "Il file non può superare i 10MB",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from('candidate-cvs')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Ottieni l'URL pubblico del file
      const { data: urlData } = supabase.storage
        .from('candidate-cvs')
        .getPublicUrl(filePath);

      toast({
        title: "Successo",
        description: "CV caricato con successo",
      });

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Errore",
        description: "Errore durante il caricamento del file",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from('candidate-cvs')
        .remove([filePath]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading,
  };
};
