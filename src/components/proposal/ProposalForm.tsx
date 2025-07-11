
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useRecruiterProfile } from "@/hooks/useRecruiterProfile";
import { Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import ProposalFormFields from "./ProposalFormFields";

type JobOfferWithCompany = Database['public']['Tables']['job_offers']['Row'] & {
  company_registrations?: {
    nome_azienda: string;
    id: string;
  } | null;
};

interface ProposalFormProps {
  jobOffer: JobOfferWithCompany;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProposalForm({ jobOffer, onClose, onSuccess }: ProposalFormProps) {
  const { user } = useAuth();
  const { profile } = useRecruiterProfile();
  const [formData, setFormData] = useState({
    candidate_name: "",
    candidate_email: "",
    candidate_phone: "",
    candidate_linkedin: "",
    years_experience: "",
    current_salary: "",
    expected_salary: "",
    availability_weeks: "",
    recruiter_fee_percentage: "15",
    proposal_description: "",
    recruiter_name: "",
    recruiter_email: "",
    recruiter_phone: "",
    candidate_cv_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Autocompila i campi del recruiter quando il profilo è disponibile
  useEffect(() => {
    if (profile && user) {
      setFormData(prev => ({
        ...prev,
        recruiter_name: `${profile.nome} ${profile.cognome}`,
        recruiter_email: profile.email,
        recruiter_phone: profile.telefono || "",
      }));
    } else if (user && !profile) {
      // Se abbiamo l'utente ma non il profilo, usa almeno l'email
      setFormData(prev => ({
        ...prev,
        recruiter_email: user.email || "",
      }));
    }
  }, [profile, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validazione campi obbligatori
    if (!formData.candidate_name || !formData.candidate_email || !formData.recruiter_name || !formData.recruiter_email) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Con RLS disabilitato, usiamo semplicemente l'email di contatto dalla job offer
      const targetCompanyId = jobOffer.contact_email || jobOffer.company_name || 'unknown';

      const proposalData = {
        company_id: targetCompanyId,
        job_offer_id: jobOffer.id,
        candidate_name: formData.candidate_name,
        candidate_email: formData.candidate_email,
        candidate_phone: formData.candidate_phone || null,
        candidate_linkedin: formData.candidate_linkedin || null,
        candidate_cv_url: formData.candidate_cv_url || null, // Aggiunto campo CV
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
        current_salary: formData.current_salary ? parseInt(formData.current_salary) : null,
        expected_salary: formData.expected_salary ? parseInt(formData.expected_salary) : null,
        availability_weeks: formData.availability_weeks ? parseInt(formData.availability_weeks) : null,
        recruiter_fee_percentage: parseInt(formData.recruiter_fee_percentage),
        proposal_description: formData.proposal_description || null,
        recruiter_name: formData.recruiter_name,
        recruiter_email: formData.recruiter_email,
        recruiter_phone: formData.recruiter_phone || null,
        submitted_by_user_id: null,
        recruiter_id: null,
      };

      console.log('Creando proposta con dati:', proposalData);

      const { error } = await supabase
        .from("proposals")
        .insert(proposalData);

      if (error) {
        console.error("Error creating proposal:", error);
        toast({
          title: "Errore",
          description: `Errore nell'invio: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Successo",
        description: "Proposta inviata con successo",
      });
      onSuccess();
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Si è verificato un errore imprevisto",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProposalFormFields formData={formData} onInputChange={handleInputChange} />
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Annulla
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Invia Proposta
        </Button>
      </DialogFooter>
    </form>
  );
}
