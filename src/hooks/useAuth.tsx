
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  auth_user_id: string;
  user_type: 'recruiter' | 'company';
  registration_id: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  linkToRegistration: (registrationId: string, userType: 'recruiter' | 'company') => Promise<boolean>;
  createUserProfile: (userType: 'recruiter' | 'company') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('auth_user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('User profile data:', data);
      return data as UserProfile | null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const createUserProfile = async (userType: 'recruiter' | 'company') => {
    if (!user) {
      console.log('No user found, cannot create profile');
      return false;
    }
    
    try {
      console.log('Creating user profile for:', user.id, 'as', userType);
      
      const tempRegistrationId = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          auth_user_id: user.id,
          user_type: userType,
          registration_id: tempRegistrationId
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return false;
      }

      console.log('User profile created:', data);
      setUserProfile(data as UserProfile);
      return true;
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      return false;
    }
  };

  const linkToRegistration = async (registrationId: string, userType: 'recruiter' | 'company') => {
    try {
      const { data, error } = await supabase.rpc('link_user_to_registration', {
        p_registration_id: registrationId,
        p_user_type: userType
      });

      if (error) {
        console.error('Error linking registration:', error);
        return false;
      }

      // Refresh user profile after linking
      if (user) {
        const profile = await fetchUserProfile(user.id);
        setUserProfile(profile);
      }

      return data || false;
    } catch (error) {
      console.error('Error in linkToRegistration:', error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    let initializationComplete = false;

    console.log('Setting up optimized auth state listener');
    
    // Timeout di sicurezza più aggressivo - 3 secondi invece di 10
    const emergencyTimeout = setTimeout(() => {
      if (!initializationComplete && mounted) {
        console.warn('Emergency timeout: forcing auth initialization');
        setLoading(false);
      }
    }, 3000);

    // Gestione ottimizzata dello stato di autenticazione
    const handleAuthState = async (event: string, session: Session | null) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.id);
      
      // Aggiorna immediatamente session e user
      setSession(session);
      setUser(session?.user ?? null);
      
      // Se non c'è sessione, termina subito il loading
      if (!session?.user) {
        setUserProfile(null);
        if (!initializationComplete) {
          initializationComplete = true;
          clearTimeout(emergencyTimeout);
          setLoading(false);
        }
        return;
      }
      
      // Carica il profilo utente in background, senza bloccare l'UI
      setTimeout(async () => {
        if (!mounted) return;
        
        try {
          const profile = await fetchUserProfile(session.user.id);
          if (mounted) {
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          if (mounted) {
            setUserProfile(null);
          }
        } finally {
          if (mounted && !initializationComplete) {
            initializationComplete = true;
            clearTimeout(emergencyTimeout);
            setLoading(false);
          }
        }
      }, 0);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthState);

    // Inizializzazione veloce della sessione
    const initializeAuth = async () => {
      try {
        console.log('Quick session initialization');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Anche in caso di errore, termina il loading per non bloccare l'app
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        // Gestisci la sessione esistente
        await handleAuthState('INITIAL_SESSION', session);
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(emergencyTimeout);
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userProfile, 
      loading, 
      signOut, 
      linkToRegistration,
      createUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
