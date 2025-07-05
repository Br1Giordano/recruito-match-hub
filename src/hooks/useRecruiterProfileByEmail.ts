
import { useState, useCallback, useRef } from 'react';
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

// Cache globale per evitare fetch multipli
const profileCache = new Map<string, { profile: RecruiterProfile | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti

export const useRecruiterProfileByEmail = () => {
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef<Set<string>>(new Set());

  const fetchProfileByEmail = useCallback(async (email: string) => {
    if (!email) {
      console.log('No email provided');
      return null;
    }

    // Controlla la cache
    const cached = profileCache.get(email);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached profile for:', email);
      setProfile(cached.profile);
      return cached.profile;
    }

    // Evita fetch multipli simultanei per la stessa email
    if (fetchingRef.current.has(email)) {
      console.log('Already fetching profile for:', email);
      return null;
    }

    fetchingRef.current.add(email);
    setLoading(true);
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
        profileCache.set(email, { profile: null, timestamp: Date.now() });
        setProfile(null);
        return null;
      }

      if (!data) {
        console.log('No recruiter profile found for email:', email);
        profileCache.set(email, { profile: null, timestamp: Date.now() });
        setProfile(null);
        return null;
      }
      
      console.log('Complete recruiter profile fetched:', data);
      const fullProfile = data as RecruiterProfile;
      
      // Salva nella cache
      profileCache.set(email, { profile: fullProfile, timestamp: Date.now() });
      setProfile(fullProfile);
      return fullProfile;
    } catch (error) {
      console.error('Unexpected error in fetchProfileByEmail:', error);
      profileCache.set(email, { profile: null, timestamp: Date.now() });
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
      fetchingRef.current.delete(email);
    }
  }, []);

  return {
    profile,
    loading,
    fetchProfileByEmail
  };
};
