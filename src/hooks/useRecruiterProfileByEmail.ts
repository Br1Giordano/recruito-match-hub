
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
    if (!email) return null;
    
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
        return null;
      }
      
      console.log('Recruiter profile fetched by email:', data);
      setProfile(data as RecruiterProfile | null);
      return data as RecruiterProfile | null;
    } catch (error) {
      console.error('Error in fetchProfileByEmail:', error);
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
