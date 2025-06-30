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

// Funzione per validare e sanitizzare input
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>\"']/g, '');
};

export function useProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProposals = async () => {
    if (!user?.email) {
      console.log('User email not available - authentication required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    console.log('Fetching proposals for company user:', user.email);

    try {
      // Prima verifica se l'utente ha offerte di lavoro
      const { data: userJobOffers, error: jobOffersError } = await supabase
        .from("job_offers")
        .select("id, title, contact_email")
        .eq("contact_email", user.email);

      if (jobOffersError) {
        console.error('Error fetching job offers:', jobOffersError);
        toast({
          title: "Errore",
          description: "Errore nel caricamento delle offerte di lavoro",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log('User job offers:', userJobOffers);

      if (!userJobOffers || userJobOffers.length === 0) {
        console.log('No job offers found for user');
        setProposals([]);
        setIsLoading(false);
        return;
      }

      // Ora cerca le proposte per queste offerte
      const jobOfferIds = userJobOffers.map(offer => offer.id);
      
      const { data: proposalsData, error: proposalsError } = await supabase
        .from("proposals")
        .select(`
          *,
          job_offers(title, contact_email)
        `)
        .in("job_offer_id", jobOfferIds)
        .order("created_at", { ascending: false });

      if (proposalsError) {
        console.error('Error fetching proposals:', proposalsError);
        toast({
          title: "Errore",
          description: `Errore nel caricamento delle proposte: ${proposalsError.message}`,
          variant: "destructive",
        });
        setProposals([]);
      } else {
        const userProposals = proposalsData || [];
        console.log('Loaded proposals:', userProposals.length);
        setProposals(userProposals);
        
        if (userProposals.length > 0) {
          toast({
            title: "Successo",
            description: `Trovate ${userProposals.length} proposte`,
          });
        }
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
    if (!user?.email) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per aggiornare le proposte",
        variant: "destructive",
      });
      return false;
    }

    // Validazione input
    const sanitizedStatus = sanitizeInput(newStatus);
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected', 'hired'];
    
    if (!validStatuses.includes(sanitizedStatus)) {
      toast({
        title: "Errore",
        description: "Stato non valido",
        variant: "destructive",
      });
      return false;
    }

    console.log('Updating proposal status:', { proposalId, newStatus: sanitizedStatus, userEmail: user.email });
    
    try {
      const { data, error } = await supabase
        .from("proposals")
        .update({ status: sanitizedStatus })
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
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per inviare risposte",
        variant: "destructive",
      });
      return;
    }

    // Validazione e sanitizzazione input
    const sanitizedStatus = sanitizeInput(status);
    const sanitizedMessage = sanitizeInput(responseMessage);
    
    if (!sanitizedStatus || !sanitizedMessage.trim()) {
      toast({
        title: "Errore",
        description: "Tutti i campi sono obbligatori",
        variant: "destructive",
      });
      return;
    }

    const companyIdentifier = user.email;

    try {
      const { error } = await supabase
        .from("proposal_responses")
        .insert([{
          proposal_id: proposalId,
          company_id: companyIdentifier,
          status: sanitizedStatus,
          response_message: sanitizedMessage,
        }]);

      if (error) {
        console.error('Error sending response:', error);
        toast({
          title: "Errore",
          description: "Impossibile inviare la risposta",
          variant: "destructive",
        });
      } else {
        console.log('Response sent successfully');
        toast({
          title: "Successo",
          description: "Risposta inviata al recruiter",
        });
        // Aggiorna lo stato della proposta
        updateProposalStatus(proposalId, sanitizedStatus === "interested" ? "under_review" : "rejected");
      }
    } catch (error) {
      console.error('Unexpected error sending response:', error);
      toast({
        title: "Errore",
        description: "Errore imprevisto durante l'invio della risposta",
        variant: "destructive",
      });
    }
  };

  const deleteProposal = async (proposalId: string) => {
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per eliminare proposte",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("proposals")
        .delete()
        .eq("id", proposalId);

      if (error) {
        console.error('Error deleting proposal:', error);
        toast({
          title: "Errore",
          description: "Impossibile eliminare la proposta",
          variant: "destructive",
        });
      } else {
        console.log('Proposal deleted successfully');
        toast({
          title: "Successo",
          description: "Proposta eliminata con successo",
        });
        fetchProposals();
      }
    } catch (error) {
      console.error('Unexpected error deleting proposal:', error);
      toast({
        title: "Errore",
        description: "Errore imprevisto durante l'eliminazione",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchProposals();
    } else {
      setIsLoading(false);
    }
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
