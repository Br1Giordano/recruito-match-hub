
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/useFileUpload';

interface RecruiterProfile {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  azienda?: string;
  esperienza?: string;
  settori?: string;
  messaggio?: string;
  avatar_url?: string;
  bio?: string;
  linkedin_url?: string;
  website_url?: string;
  specializations?: string[];
  years_of_experience?: number;
  location?: string;
}

export const useRecruiterProfile = () => {
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { uploadFile, deleteFile, isUploading } = useFileUpload();

  const fetchProfile = async () => {
    if (!userProfile?.registration_id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('recruiter_registrations')
        .select('*')
        .eq('id', userProfile.registration_id)
        .single();

      if (error) throw error;
      setProfile(data as RecruiterProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare il profilo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<RecruiterProfile>) => {
    if (!userProfile?.registration_id) return false;

    try {
      const { error } = await supabase
        .from('recruiter_registrations')
        .update(updates)
        .eq('id', userProfile.registration_id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Successo",
        description: "Profilo aggiornato con successo",
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento del profilo",
        variant: "destructive",
      });
      return false;
    }
  };

  const uploadAvatar = async (file: File) => {
    // Elimina l'avatar precedente se esiste
    if (profile?.avatar_url) {
      const oldPath = profile.avatar_url.split('/').pop();
      if (oldPath) {
        await deleteFile(`avatars/${oldPath}`);
      }
    }

    const avatarUrl = await uploadFile(file, 'avatars');
    if (avatarUrl) {
      await updateProfile({ avatar_url: avatarUrl });
      return avatarUrl;
    }
    return null;
  };

  useEffect(() => {
    fetchProfile();
  }, [userProfile?.registration_id]);

  return {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    isUploading,
    refetchProfile: fetchProfile
  };
};
