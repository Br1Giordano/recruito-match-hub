
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./useAuth";

interface Proposal {
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
  recruiter_name?: string;
  recruiter_email?: string;
  recruiter_phone?: string;
  job_offers?: {
    title: string;
    contact_email?: string;
  };
}

export function useProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProposals = async () => {
    setIsLoading(true);
    
    console.log('Fetching all proposals');

    try {
      const { data: proposalsData, error: proposalsError } = await supabase
        .from("proposals")
        .select(`
          *,
          job_offers(title, contact_email)
        `)
        .order("created_at", { ascending: false });

      if (proposalsError) {
        console.error('Error fetching proposals:', proposalsError);
        toast({
          title: "Errore",
          description: `Errore nel caricamento delle proposte: ${proposalsError.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('All proposals fetched:', proposalsData?.length);
      
      // Se l'utente è loggato, filtra per email
      let filteredProposals = proposalsData || [];
      if (user?.email) {
        filteredProposals = proposalsData?.filter(proposal => 
          proposal.job_offers?.contact_email === user.email
        ) || [];
        console.log('Filtered user proposals:', filteredProposals.length);
      }
      
      setProposals(filteredProposals);
      
      if (filteredProposals.length > 0) {
        toast({
          title: "Successo",
          description: `Trovate ${filteredProposals.length} proposte`,
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      toast({
        title: "Errore",
        description: `Si è verificato un errore imprevisto: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProposalStatus = async (proposalId: string, newStatus: string) => {
    console.log('Updating proposal status:', { proposalId, newStatus });
    
    try {
      const { data, error } = await supabase
        .from("proposals")
        .update({ status: newStatus })
        .eq("id", proposalId)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Errore",
          description: `Impossibile aggiornare lo stato della proposta: ${error.message}`,
          variant: "destructive",
        });
        return false;
      } else {
        console.log('Proposal status updated successfully');
        toast({
          title: "Successo",
          description: "Stato della proposta aggiornato",
        });
        fetchProposals();
        return true;
      }
    } catch (error) {
      console.error('Unexpected error during update:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      toast({
        title: "Errore",
        description: `Errore imprevisto: ${errorMessage}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const sendResponse = async (proposalId: string, status: string, responseMessage: string) => {
    if (!user) return;

    const companyIdentifier = user.email;

    const { error } = await supabase
      .from("proposal_responses")
      .insert([{
        proposal_id: proposalId,
        company_id: companyIdentifier,
        status: status,
        response_message: responseMessage,
      }]);

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile inviare la risposta",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Successo",
        description: "Risposta inviata al recruiter",
      });
      updateProposalStatus(proposalId, status === "interested" ? "under_review" : "rejected");
    }
  };

  const deleteProposal = async (proposalId: string) => {
    const { error } = await supabase
      .from("proposals")
      .delete()
      .eq("id", proposalId);

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile eliminare la proposta",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Successo",
        description: "Proposta eliminata con successo",
      });
      fetchProposals();
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [user?.email]);

  return {
    proposals,
    isLoading,
    fetchProposals,
    updateProposalStatus,
    sendResponse,
    deleteProposal
  };
}
