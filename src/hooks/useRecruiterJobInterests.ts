import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface JobInterest {
  id: string;
  recruiter_email: string;
  job_offer_id: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  job_offers?: {
    id: string;
    title: string;
    company_name?: string;
    location?: string;
    employment_type?: string;
    salary_min?: number;
    salary_max?: number;
    description?: string;
    requirements?: string;
    benefits?: string;
    contact_email?: string;
  } | null;
}

export const useRecruiterJobInterests = () => {
  const [interests, setInterests] = useState<JobInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInterests = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      
      // Prima prendo gli interessi del recruiter
      const { data: interestsData, error: interestsError } = await supabase
        .from('recruiter_job_interests')
        .select('*')
        .eq('recruiter_email', user.email)
        .eq('status', 'interested')
        .order('created_at', { ascending: false });

      if (interestsError) {
        console.error('Error fetching job interests:', interestsError);
        toast({
          title: "Errore",
          description: "Impossibile caricare le offerte di interesse",
          variant: "destructive",
        });
        return;
      }

      if (!interestsData || interestsData.length === 0) {
        setInterests([]);
        return;
      }

      // Poi prendo i dettagli delle job offers
      const jobOfferIds = interestsData.map(interest => interest.job_offer_id);
      const { data: jobOffersData, error: jobOffersError } = await supabase
        .from('job_offers')
        .select(`
          id,
          title,
          company_name,
          location,
          employment_type,
          salary_min,
          salary_max,
          description,
          requirements,
          benefits,
          contact_email
        `)
        .in('id', jobOfferIds);

      if (jobOffersError) {
        console.error('Error fetching job offers:', jobOffersError);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dettagli delle offerte",
          variant: "destructive",
        });
        return;
      }

      // Combino i dati
      const combinedData = interestsData.map(interest => ({
        ...interest,
        job_offers: jobOffersData?.find(job => job.id === interest.job_offer_id) || null
      }));

      setInterests(combinedData);
    } catch (error) {
      console.error('Error fetching job interests:', error);
      toast({
        title: "Errore",
        description: "Errore durante il caricamento delle offerte",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addInterest = async (jobOfferId: string, notes?: string) => {
    if (!user?.email) return false;

    try {
      // Prima controlla se esiste già un interesse
      const { data: existing } = await supabase
        .from('recruiter_job_interests')
        .select('id, status')
        .eq('recruiter_email', user.email)
        .eq('job_offer_id', jobOfferId)
        .maybeSingle();

      if (existing) {
        if (existing.status === 'interested') {
          toast({
            title: "Già preso in carico",
            description: "Hai già preso in carico questa offerta",
            variant: "destructive",
          });
          return false;
        } else {
          // Aggiorna se esisteva ma era rimosso
          const { error } = await supabase
            .from('recruiter_job_interests')
            .update({
              status: 'interested',
              notes: notes || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (error) throw error;
        }
      } else {
        // Inserisci nuovo
        const { error } = await supabase
          .from('recruiter_job_interests')
          .insert({
            recruiter_email: user.email,
            job_offer_id: jobOfferId,
            status: 'interested',
            notes: notes || null,
          });

        if (error) throw error;
      }

      toast({
        title: "Offerta presa in carico",
        description: "L'offerta è stata aggiunta alle tue offerte di interesse",
      });

      fetchInterests();
      return true;
    } catch (error) {
      console.error('Error adding job interest:', error);
      toast({
        title: "Errore",
        description: "Impossibile prendere in carico l'offerta",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeInterest = async (interestId: string) => {
    try {
      const { error } = await supabase
        .from('recruiter_job_interests')
        .update({ status: 'removed', updated_at: new Date().toISOString() })
        .eq('id', interestId);

      if (error) {
        console.error('Error removing job interest:', error);
        toast({
          title: "Errore",
          description: "Impossibile rimuovere l'interesse",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Interesse rimosso",
        description: "L'offerta è stata rimossa dalle tue offerte di interesse",
      });

      // Ricarica la lista
      fetchInterests();
      return true;
    } catch (error) {
      console.error('Error removing job interest:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'operazione",
        variant: "destructive",
      });
      return false;
    }
  };

  const checkIfInterested = async (jobOfferId: string): Promise<boolean> => {
    if (!user?.email) return false;

    try {
      const { data, error } = await supabase
        .from('recruiter_job_interests')
        .select('id')
        .eq('recruiter_email', user.email)
        .eq('job_offer_id', jobOfferId)
        .eq('status', 'interested')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking job interest:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking job interest:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchInterests();
  }, [user?.email]);

  return {
    interests,
    loading,
    addInterest,
    removeInterest,
    checkIfInterested,
    refetch: fetchInterests,
  };
};