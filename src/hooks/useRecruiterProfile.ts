
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
    console.log('fetchProfile called with userProfile:', userProfile);
    
    if (!userProfile?.auth_user_id) {
      console.log('No auth_user_id found');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching profile for auth_user_id:', userProfile.auth_user_id);
      
      const { data, error } = await supabase
        .from('recruiter_registrations')
        .select('*')
        .eq('user_id', userProfile.auth_user_id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Profile fetched successfully:', data);
      setProfile(data as RecruiterProfile | null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Non mostrare toast di errore se il profilo semplicemente non esiste
      if (error?.code !== 'PGRST116') {
        toast({
          title: "Errore",
          description: "Impossibile caricare il profilo",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<RecruiterProfile>) => {
    console.log('🔄 updateProfile called with:', updates);
    console.log('📋 userProfile:', userProfile);
    
    if (!userProfile?.auth_user_id) {
      console.error('❌ No auth_user_id found');
      return false;
    }

    try {
      console.log('📤 Sending update to database...');
      // Prima trova il record corretto usando user_id
      const { data: existingProfile, error: findError } = await supabase
        .from('recruiter_registrations')
        .select('id')
        .eq('user_id', userProfile.auth_user_id)
        .maybeSingle();

      if (findError) {
        console.error('❌ Error finding profile:', findError);
        throw findError;
      }

      if (!existingProfile) {
        console.error('❌ Profile not found for user_id:', userProfile.auth_user_id);
        // Se non esiste, crea un nuovo profilo
        return await createProfile(updates);
      }

      // Ora aggiorna usando l'ID corretto
      const { data, error } = await supabase
        .from('recruiter_registrations')
        .update(updates)
        .eq('id', existingProfile.id)
        .select()
        .maybeSingle();

      console.log('📊 Database response:', { data, error });

      if (error) throw error;

      if (data) {
        console.log('✅ Update successful, updating local state...');
        setProfile(data as RecruiterProfile);
      }
      
      toast({
        title: "Successo",
        description: "Profilo aggiornato con successo",
      });
      return true;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento del profilo",
        variant: "destructive",
      });
      return false;
    }
  };

  const createProfile = async (profileData: Partial<RecruiterProfile>) => {
    if (!userProfile?.auth_user_id) return false;

    try {
      const { data, error } = await supabase
        .from('recruiter_registrations')
        .insert([{
          user_id: userProfile.auth_user_id,
          nome: profileData.nome || '',
          cognome: profileData.cognome || '',
          email: profileData.email || '',
          ...profileData
        }])
        .select()
        .single();

      if (error) throw error;

      setProfile(data as RecruiterProfile);
      toast({
        title: "Successo",
        description: "Profilo creato con successo",
      });
      return true;
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Errore",
        description: "Errore nella creazione del profilo",
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
  }, [userProfile?.auth_user_id]);

  return {
    profile,
    loading,
    updateProfile,
    createProfile,
    uploadAvatar,
    isUploading,
    refetchProfile: fetchProfile
  };
};
