
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
      console.log('No user found');
      setIsLoading(false);
      return;
    }

    console.log('User profile:', userProfile);
    console.log('Current user:', user);

    setIsLoading(true);

    let recruiterId = null;
    
    if (userProfile && userProfile.user_type === 'recruiter') {
      recruiterId = userProfile.registration_id;
      console.log('Using recruiter ID from profile:', recruiterId);
    } else {
      const { data: recruiterData, error: recruiterError } = await supabase
        .from("recruiter_registrations")
        .select("id")
        .limit(1)
        .maybeSingle();

      console.log('Fallback recruiter data:', recruiterData);
      console.log('Fallback recruiter error:', recruiterError);

      if (recruiterError) {
        console.error('Error fetching recruiter:', recruiterError);
        toast({
          title: "Info Demo",
          description: "Modalità demo: utilizzo dati di esempio per mostrare le funzionalità",
        });
        setIsLoading(false);
        return;
      }
      
      if (!recruiterData) {
        toast({
          title: "Demo",
          description: "Nessun dato di esempio disponibile. Questa è una demo delle funzionalità.",
        });
        setIsLoading(false);
        return;
      }
      
      recruiterId = recruiterData.id;
    }

    const { data, error } = await supabase
      .from("proposals")
      .select(`
        *,
        company_registrations(nome_azienda),
        job_offers(title)
      `)
      .eq("recruiter_id", recruiterId)
      .order("created_at", { ascending: false });

    console.log('Proposals data:', data);
    console.log('Proposals error:', error);

    if (error) {
      console.error("Error fetching proposals:", error);
      toast({
        title: "Demo",
        description: "Questa è una demo - in produzione vedrai qui le tue proposte reali",
      });
      setProposals([]);
    } else {
      const transformedData = (data || []).map(proposal => ({
        ...proposal,
        company_registrations: Array.isArray(proposal.company_registrations) 
          ? proposal.company_registrations[0] || null
          : proposal.company_registrations
      }));
      setProposals(transformedData);
    }

    setIsLoading(false);
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
