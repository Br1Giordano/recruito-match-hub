
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
    setIsLoading(true);

    console.log('Fetching all proposals for recruiter view');

    try {
      const { data, error } = await supabase
        .from("proposals")
        .select(`
          *,
          company_registrations(nome_azienda),
          job_offers(title)
        `)
        .order("created_at", { ascending: false });

      console.log('Proposals data:', data);
      console.log('Proposals error:', error);

      if (error) {
        console.error("Error fetching proposals:", error);
        toast({
          title: "Errore",
          description: `Errore nel caricamento delle proposte: ${error.message}`,
          variant: "destructive",
        });
        setProposals([]);
      } else {
        const transformedData = (data || []).map(proposal => ({
          ...proposal,
          company_registrations: Array.isArray(proposal.company_registrations) 
            ? proposal.company_registrations[0] || null
            : proposal.company_registrations
        }));
        
        // Se l'utente è un recruiter autenticato, filtra per le sue proposte
        let filteredProposals = transformedData;
        if (user && userProfile?.user_type === 'recruiter') {
          // Qui potresti filtrare per recruiter_id se necessario
          // filteredProposals = transformedData.filter(p => p.recruiter_id === userProfile.registration_id);
        }
        
        setProposals(filteredProposals);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Errore",
        description: "Errore imprevisto nel caricamento delle proposte",
        variant: "destructive",
      });
      setProposals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [user, userProfile]);

  return {
    proposals,
    isLoading,
    fetchProposals
  };
}
