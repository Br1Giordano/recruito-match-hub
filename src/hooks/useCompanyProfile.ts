import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface CompanyProfile {
  id: string;
  nome_azienda: string;
  settore: string | null;
  email: string;
  telefono: string | null;
  messaggio: string | null;
  sede: string | null;
  employee_count_range: string | null;
  logo_url: string | null;
  created_at: string;
  status: string | null;
}

export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, userProfile, linkToRegistration } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && userProfile?.user_type === 'company') {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user, userProfile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (!userProfile?.registration_id) return;

      const { data, error } = await supabase
        .from('company_registrations')
        .select('*')
        .or(`id.eq.${userProfile.registration_id},user_id.eq.${userProfile.auth_user_id}`)
        .maybeSingle();

      if (error) {
        console.error('Error fetching company profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching company profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<CompanyProfile>) => {
    console.log('🔄 updateProfile called with:', updates);
    console.log('📋 current profile:', profile);
    
    try {
      if (!profile) {
        console.error('❌ No profile found');
        return false;
      }

      console.log('📤 Sending update to database...');
      const { data, error } = await supabase
        .from('company_registrations')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .maybeSingle();

      console.log('📊 Database response:', { data, error });

      if (error) {
        console.error('❌ Database error:', error);
        toast({
          title: "Errore",
          description: "Non è stato possibile aggiornare il profilo.",
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        console.log('✅ Update successful, updating local state...');
        // Aggiorna immediatamente lo stato locale con i dati dal database
        setProfile(data as CompanyProfile);
      }

      toast({
        title: "Successo",
        description: "Profilo aggiornato con successo!",
      });
      return true;
    } catch (error) {
      console.error('❌ Error updating company profile:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore imprevisto.",
        variant: "destructive",
      });
      return false;
    }
  };

  const createProfile = async (profileData: Omit<CompanyProfile, 'id' | 'created_at' | 'status'>) => {
    try {
      console.log('Creating profile with data:', profileData);
      
      // Prima controlliamo se esiste già un profilo con questa email
      const { data: existingProfile, error: checkError } = await supabase
        .from('company_registrations')
        .select('*')
        .eq('email', profileData.email)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing profile:', checkError);
        throw checkError;
      }

      let data, error;

      if (existingProfile) {
        // Se esiste già, aggiorniamo il profilo esistente
        console.log('Updating existing profile:', existingProfile.id);
        const result = await supabase
          .from('company_registrations')
          .update(profileData)
          .eq('id', existingProfile.id)
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      } else {
        // Se non esiste, ne creiamo uno nuovo
        console.log('Creating new profile');
        const result = await supabase
          .from('company_registrations')
          .insert([profileData])
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      }

      console.log('Insert/Update result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Errore",
          description: "Non è stato possibile creare il profilo.",
          variant: "destructive",
        });
        return false;
      }

      // Link the profile to the user
      if (user && data) {
        console.log('Linking profile to user:', { userId: user.id, profileId: data.id });
        const linkResult = await linkToRegistration(data.id, 'company');
        console.log('Link result:', linkResult);
      }

      await fetchProfile();
      toast({
        title: "Successo",
        description: "Profilo creato con successo!",
      });
      return true;
    } catch (error) {
      console.error('Error creating company profile:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore imprevisto.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    createProfile,
    refreshProfile: fetchProfile
  };
}