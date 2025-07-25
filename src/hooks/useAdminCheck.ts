
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

// Fallback temporaneo durante la migrazione
const ADMIN_EMAILS_FALLBACK = [
  'giordano.brunolucio@gmail.com'
];

export function useAdminCheck() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.email) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Usa la funzione database is_admin() per controllo sicuro
        const { data, error } = await supabase
          .rpc('is_admin', { user_email: user.email });

        if (error) {
          console.error('Errore controllo admin:', error);
          // Fallback temporaneo in caso di errore
          const fallbackAdmin = ADMIN_EMAILS_FALLBACK.includes(user.email);
          setIsAdmin(fallbackAdmin);
        } else {
          setIsAdmin(data || false);
        }
      } catch (error) {
        console.error('Errore connessione admin check:', error);
        // Fallback temporaneo in caso di errore di connessione
        const fallbackAdmin = ADMIN_EMAILS_FALLBACK.includes(user.email);
        setIsAdmin(fallbackAdmin);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user?.email]);

  return { isAdmin, loading };
}
