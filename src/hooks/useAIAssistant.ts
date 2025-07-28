import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CVAnalysis {
  skills: string[];
  experience_years: number;
  sectors: string[];
  seniority_level: string;
  key_strengths: string[];
}

interface MatchScore {
  score: number;
  reasoning: string;
}

interface ProposalSuggestion {
  suggestion: string;
}

interface CompanyInsights {
  insights: Array<{
    proposal_id: string;
    summary: string;
    strengths: string[];
    interview_questions: string[];
  }>;
}

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const callAIFunction = async (action: string, data: any) => {
    try {
      setIsLoading(true);
      
      const { data: result, error } = await supabase.functions.invoke('ai-proposal-assistant', {
        body: { action, data }
      });

      if (error) {
        console.error('AI Assistant error:', error);
        toast({
          title: "Errore AI",
          description: "Servizio temporaneamente non disponibile",
          variant: "destructive",
        });
        return null;
      }

      return result;
    } catch (error) {
      console.error('AI call failed:', error);
      toast({
        title: "Errore",
        description: "Impossibile contattare il servizio AI",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCVContent = async (cvText: string): Promise<CVAnalysis | null> => {
    const result = await callAIFunction('analyze_cv', { cvText });
    return result?.analysis || null;
  };

  const generateProposalSuggestion = async (
    jobOffer: any, 
    candidateAnalysis: CVAnalysis, 
    recruiterContext: any
  ): Promise<ProposalSuggestion | null> => {
    const result = await callAIFunction('generate_proposal', {
      jobOffer,
      candidateAnalysis,
      recruiterContext
    });
    return result;
  };

  const calculateMatchScore = async (
    jobOffer: any, 
    candidateAnalysis: CVAnalysis
  ): Promise<MatchScore | null> => {
    const result = await callAIFunction('calculate_match_score', {
      jobOffer,
      candidateAnalysis
    });
    return result;
  };

  const generateCompanyInsights = async (proposals: any[]): Promise<CompanyInsights | null> => {
    const result = await callAIFunction('generate_company_insights', { proposals });
    return result;
  };

  const anonymizeCV = async (cvText: string): Promise<string | null> => {
    const result = await callAIFunction('anonymize_cv', { cvText });
    return result;
  };

  return {
    isLoading,
    analyzeCVContent,
    generateProposalSuggestion,
    calculateMatchScore,
    generateCompanyInsights,
    anonymizeCV,
  };
};