
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
  created_at?: string;
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
      // Cerco il profilo completo da recruiter_registrations
      const { data, error } = await supabase
        .from('recruiter_registrations')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      console.log('Raw recruiter data from DB:', data);
      console.log('Query error:', error);

      if (error) {
        console.error('Error fetching recruiter profile by email:', error);
        setProfile(null);
        return null;
      }

      if (!data) {
        console.log('No recruiter profile found for email:', email);
        setProfile(null);
        return null;
      }
      
      console.log('Complete recruiter profile fetched:', data);
      const fullProfile = data as RecruiterProfile;
      setProfile(fullProfile);
      return fullProfile;
    } catch (error) {
      console.error('Unexpected error in fetchProfileByEmail:', error);
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
