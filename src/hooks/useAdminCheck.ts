
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

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
          // In caso di errore, l'utente NON è considerato admin per sicurezza
          setIsAdmin(false);
        } else {
          setIsAdmin(data || false);
        }
      } catch (error) {
        console.error('Errore connessione admin check:', error);
        // In caso di errore di connessione, l'utente NON è considerato admin per sicurezza
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user?.email]);

  return { isAdmin, loading };
}
