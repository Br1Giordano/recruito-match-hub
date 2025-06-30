
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
  company_id?: string;
  job_offers?: {
    title: string;
    company_name?: string;
  };
}

export function useRecruiterProposals() {
  const [proposals, setProposals] = useState<RecruiterProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { userProfile, user } = useAuth();

  const fetchProposals = async () => {
    setIsLoading(true);

    console.log('Fetching proposals for recruiter:', user?.email);

    try {
      const { data, error } = await supabase
        .from("proposals")
        .select(`
          *,
          job_offers(title, company_name)
        `)
        .eq("recruiter_email", user?.email)
        .order("created_at", { ascending: false });

      console.log('Recruiter proposals data:', data);
      console.log('Recruiter proposals error:', error);

      if (error) {
        console.error("Error fetching recruiter proposals:", error);
        toast({
          title: "Errore",
          description: `Errore nel caricamento delle proposte: ${error.message}`,
          variant: "destructive",
        });
        setProposals([]);
      } else {
        setProposals(data || []);
        console.log(`Trovate ${data?.length || 0} proposte per il recruiter`);
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
    if (user?.email) {
      fetchProposals();
    }
  }, [user?.email]);

  return {
    proposals,
    isLoading,
    fetchProposals
  };
}
