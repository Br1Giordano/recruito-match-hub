
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./useAuth";

interface RecruiterProposal {
  id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  candidate_linkedin?: string;
  proposal_description: string;
  years_experience?: number;
  current_salary?: number;
  expected_salary?: number;
  availability_weeks?: number;
  recruiter_fee_percentage?: number;
  status: string;
  created_at: string;
  company_registrations?: {
    nome_azienda: string;
  } | null;
  job_offers?: {
    title: string;
  };
}

export function useRecruiterProposals() {
  const [proposals, setProposals] = useState<RecruiterProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { userProfile, user } = useAuth();

  const fetchProposals = async () => {
    if (!user) {
      console.log('No user found - authentication required');
      setIsLoading(false);
      return;
    }

    console.log('User profile:', userProfile);
    console.log('Current user:', user);

    setIsLoading(true);

    try {
      // Con le nuove RLS policy, la query ora filtra automaticamente
      // le proposte del recruiter autenticato
      const { data, error } = await supabase
        .from("proposals")
        .select(`
          *,
          company_registrations(nome_azienda),
          job_offers(title)
        `)
        .order("created_at", { ascending: false });

      console.log('Proposals data with RLS security:', data);
      console.log('Proposals error:', error);

      if (error) {
        console.error("Error fetching proposals:", error);
        
        if (error.message.includes('RLS') || error.message.includes('policy')) {
          toast({
            title: "Accesso Limitato",
            description: "Puoi vedere solo le tue proposte. Assicurati di aver effettuato l'accesso come recruiter.",
          });
        } else {
          toast({
            title: "Errore",
            description: "Errore nel caricamento delle proposte",
            variant: "destructive",
          });
        }
        setProposals([]);
      } else {
        // Le RLS policy filtrano automaticamente per il recruiter corrente
        const transformedData = (data || []).map(proposal => ({
          ...proposal,
          company_registrations: Array.isArray(proposal.company_registrations) 
            ? proposal.company_registrations[0] || null
            : proposal.company_registrations
        }));
        
        console.log(`Loaded ${transformedData.length} proposals with security filtering`);
        setProposals(transformedData);
        
        if (transformedData.length > 0) {
          toast({
            title: "Successo",
            description: `Caricate ${transformedData.length} tue proposte`,
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error fetching proposals:', error);
      toast({
        title: "Errore",
        description: "Errore imprevisto nel caricamento",
        variant: "destructive",
      });
      setProposals([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchProposals();
    } else {
      setIsLoading(false);
    }
  }, [user, userProfile]);

  return {
    proposals,
    isLoading,
    fetchProposals
  };
}
