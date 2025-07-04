
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useRecruiterProfileByEmail = () => {
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfileByEmail = async (email: string) => {
    if (!email) {
      console.log('No email provided');
      return null;
    }
    
    setLoading(true);
    console.log('Fetching recruiter profile by email:', email);
    
    try {
      const { data, error } = await supabase
        .from('recruiter_registrations')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error fetching recruiter profile by email:', error);
        setProfile(null);
        return null;
      }

      if (!data) {
        console.log('No recruiter profile found for email:', email);
        // Create a basic profile with email information if no full profile exists
        const basicProfile: RecruiterProfile = {
          id: '',
          nome: email.split('@')[0] || 'Recruiter',
          cognome: '',
          email: email,
        };
        setProfile(basicProfile);
        return basicProfile;
      }
      
      console.log('Recruiter profile fetched by email:', data);
      setProfile(data as RecruiterProfile);
      return data as RecruiterProfile;
    } catch (error) {
      console.error('Error in fetchProfileByEmail:', error);
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    fetchProfileByEmail
  };
};
