
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
  status?: string;
  created_at?: string;
}

export const useRecruiterProfileByEmail = () => {
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileByEmail = async (email: string): Promise<RecruiterProfile | null> => {
    if (!email) {
      console.log('No email provided');
      return null;
    }
    
    setLoading(true);
    setError(null);
    console.log('Fetching recruiter profile by email:', email);
    
    try {
      const { data, error } = await supabase
        .from('recruiter_registrations')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      console.log('Raw recruiter data from DB:', data);
      console.log('Query error:', error);

      if (error) {
        console.error('Error fetching recruiter profile by email:', error);
        setError('Errore nel caricamento del profilo');
        return null;
      }

      if (!data) {
        console.log('No recruiter profile found for email:', email);
        const basicProfile: RecruiterProfile = {
          id: '',
          nome: email.split('@')[0] || 'Recruiter',
          cognome: '',
          email: email,
        };
        setProfile(basicProfile);
        return basicProfile;
      }
      
      console.log('Complete recruiter profile fetched:', data);
      const fullProfile = data as RecruiterProfile;
      setProfile(fullProfile);
      return fullProfile;
    } catch (error) {
      console.error('Unexpected error in fetchProfileByEmail:', error);
      setError('Errore inaspettato nel caricamento del profilo');
      const basicProfile: RecruiterProfile = {
        id: '',
        nome: email.split('@')[0] || 'Recruiter',
        cognome: '',
        email: email,
      };
      setProfile(basicProfile);
      return basicProfile;
    } finally {
      setLoading(false);
    }
  };

  const clearProfile = () => {
    setProfile(null);
    setError(null);
  };

  return {
    profile,
    loading,
    error,
    fetchProfileByEmail,
    clearProfile
  };
};
