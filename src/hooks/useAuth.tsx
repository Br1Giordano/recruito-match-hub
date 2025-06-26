
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
        setUserProfile(null);
        return;
      }

      console.log('User profile data:', data);
      if (data && (data.user_type === 'recruiter' || data.user_type === 'company')) {
        setUserProfile(data as UserProfile);
      } else {
        console.log('No user profile found');
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUserProfile(null);
    }
  };

  const createUserProfile = async (userType: 'recruiter' | 'company') => {
    if (!user) {
      console.log('No user found, cannot create profile');
      return false;
    }
    
    try {
      console.log('Creating user profile for:', user.id, 'as', userType);
      
      // Create a temporary registration ID - this will be updated when they complete registration
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
        await fetchUserProfile(user.id);
      }

      return data || false;
    } catch (error) {
      console.error('Error in linkToRegistration:', error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

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
