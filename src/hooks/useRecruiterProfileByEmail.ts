
import { useState, useCallback, useRef, useEffect } from 'react';
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

export const useRecruiterProfileByEmail = (email?: string) => {
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef<Set<string>>(new Set());

  const fetchProfileByEmail = useCallback(async (emailToFetch: string) => {
    if (!emailToFetch) {
      console.log('No email provided');
      return null;
    }

    // Controlla la cache
    const cached = profileCache.get(emailToFetch);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached profile for:', emailToFetch);
      setProfile(cached.profile);
      return cached.profile;
    }

    // Evita fetch multipli simultanei per la stessa email
    if (fetchingRef.current.has(emailToFetch)) {
      console.log('Already fetching profile for:', emailToFetch);
      return null;
    }

    fetchingRef.current.add(emailToFetch);
    setLoading(true);
    console.log('Fetching recruiter profile by email:', emailToFetch);
    
    try {
      const { data, error } = await supabase
        .from('recruiter_registrations')
        .select('*')
        .eq('email', emailToFetch)
        .maybeSingle();

      console.log('Raw recruiter data from DB:', data);
      console.log('Query error:', error);

      if (error) {
        console.error('Error fetching recruiter profile by email:', error);
        profileCache.set(emailToFetch, { profile: null, timestamp: Date.now() });
        setProfile(null);
        return null;
      }

      if (!data) {
        console.log('No recruiter profile found for email:', emailToFetch);
        profileCache.set(emailToFetch, { profile: null, timestamp: Date.now() });
        setProfile(null);
        return null;
      }
      
      console.log('Complete recruiter profile fetched:', data);
      const fullProfile = data as RecruiterProfile;
      
      // Salva nella cache
      profileCache.set(emailToFetch, { profile: fullProfile, timestamp: Date.now() });
      setProfile(fullProfile);
      return fullProfile;
    } catch (error) {
      console.error('Unexpected error in fetchProfileByEmail:', error);
      profileCache.set(emailToFetch, { profile: null, timestamp: Date.now() });
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
      fetchingRef.current.delete(emailToFetch);
    }
  }, []);

  // Auto-fetch quando l'email viene fornita
  useEffect(() => {
    if (email && !profile) {
      fetchProfileByEmail(email);
    }
  }, [email, fetchProfileByEmail, profile]);

  return {
    profile,
    loading,
    fetchProfileByEmail
  };
};
