import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CompanyProfile {
  id: string;
  nome_azienda: string;
  settore: string | null;
  email: string;
  telefono: string | null;
  messaggio: string | null;
  sede: string | null;
  employee_count_range: string | null;
  logo_url: string | null;
  created_at: string;
  status: string | null;
}

export function useCompanyProfileByEmail() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfileByEmail = async (email: string) => {
    try {
      setLoading(true);
      setProfile(null);

      const { data, error } = await supabase
        .from('company_registrations')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error fetching company profile by email:', error);
        return null;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching company profile by email:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileByRegistrationId = async (registrationId: string) => {
    try {
      setLoading(true);
      setProfile(null);

      const { data, error } = await supabase
        .from('company_registrations')
        .select('*')
        .eq('id', registrationId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching company profile by ID:', error);
        return null;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching company profile by ID:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    fetchProfileByEmail,
    fetchProfileByRegistrationId,
    clearProfile: () => setProfile(null)
  };
}