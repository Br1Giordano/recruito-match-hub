
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type JobOfferWithCompany = Database['public']['Tables']['job_offers']['Row'] & {
  company_registrations?: {
    nome_azienda: string;
    id: string;
  } | null;
};

interface ProposalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jobOffer: JobOfferWithCompany;
}

export default function ProposalFormModal({ isOpen, onClose, onSuccess, jobOffer }: ProposalFormModalProps) {
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { userProfile, user } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const ensureRecruiterExists = async () => {
    if (!user?.email || !userProfile) {
      throw new Error('Utente non autenticato');
    }

    console.log('Verificando esistenza recruiter per:', user.email);

    // Prima verifica se esiste già un recruiter con l'ID del profilo
    let { data: recruiterData, error: recruiterError } = await supabase
      .from('recruiter_registrations')
      .select('id, email')
      .eq('id', userProfile.registration_id)
      .maybeSingle();

    console.log('Recruiter by registration_id:', recruiterData);

    // Se non trovato, cerca per email
    if (!recruiterData) {
      const { data: recruiterByEmail } = await supabase
        .from('recruiter_registrations')
        .select('id, email')
        .eq('email', user.email)
        .maybeSingle();

      console.log('Recruiter by email:', recruiterByEmail);

      if (recruiterByEmail) {
        // Aggiorna il profilo utente con l'ID corretto
        await supabase
          .from('user_profiles')
          .update({ registration_id: recruiterByEmail.id })
          .eq('id', userProfile.id);
        
        recruiterData = recruiterByEmail;
        console.log('Profilo utente aggiornato con registration_id corretto');
      } else {
        // Crea un nuovo record recruiter
        console.log('Creando nuovo record recruiter');
        
        const { data: newRecruiter, error: createError } = await supabase
          .from('recruiter_registrations')
          .insert({
            email: user.email,
            nome: user.user_metadata?.first_name || 'Nome',
            cognome: user.user_metadata?.last_name || 'Cognome',
            status: 'active'
          })
          .select('id, email')
          .single();

        if (createError) {
          console.error('Errore creazione recruiter:', createError);
          throw new Error('Impossibile creare il profilo recruiter');
        }

        // Aggiorna il profilo utente con il nuovo ID
        await supabase
          .from('user_profiles')
          .update({ registration_id: newRecruiter.id })
          .eq('id', userProfile.id);

        recruiterData = newRecruiter;
        console.log('Nuovo recruiter creato e profilo aggiornato');
      }
    }

    return recruiterData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per inviare proposte",
        variant: "destructive",
      });
      return;
    }

    if (!userProfile || userProfile.user_type !== 'recruiter') {
      toast({
        title: "Errore",
        description: "Devi avere un profilo recruiter per inviare proposte",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Assicurati che esista un record recruiter
      const recruiterData = await ensureRecruiterExists();

      console.log('Recruiter verificato:', recruiterData);

      // Ora procediamo con la creazione della proposta
      let targetCompanyId = null;

      // Se l'offerta ha un company_id, lo usiamo
      if (jobOffer.company_id) {
        targetCompanyId = jobOffer.company_id;
      } 
      // Altrimenti creiamo una proposta usando l'email dell'azienda
      else if (jobOffer.contact_email) {
        // Creiamo un UUID temporaneo per l'azienda
        const tempCompanyId = crypto.randomUUID();
        targetCompanyId = tempCompanyId;
        
        // Prima creiamo il record temporaneo dell'azienda
        const { error: companyError } = await supabase
          .from("company_registrations")
          .insert({
            id: tempCompanyId,
            nome_azienda: jobOffer.company_name || "Azienda",
            email: jobOffer.contact_email,
            status: 'temp_for_proposal'
          });

        if (companyError) {
          console.error('Errore creazione azienda temporanea:', companyError);
        }
      }

      if (!targetCompanyId) {
        toast({
          title: "Errore",
          description: "Impossibile identificare l'azienda per questa offerta",
          variant: "destructive",
        });
        return;
      }

      const proposalData = {
        recruiter_id: recruiterData.id,
        company_id: targetCompanyId,
        job_offer_id: jobOffer.id,
        candidate_name: formData.candidate_name,
        candidate_email: formData.candidate_email,
        candidate_phone: formData.candidate_phone || null,
        candidate_linkedin: formData.candidate_linkedin || null,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
        current_salary: formData.current_salary ? parseInt(formData.current_salary) : null,
        expected_salary: formData.expected_salary ? parseInt(formData.expected_salary) : null,
        availability_weeks: formData.availability_weeks ? parseInt(formData.availability_weeks) : null,
        recruiter_fee_percentage: parseInt(formData.recruiter_fee_percentage),
        proposal_description: formData.proposal_description || null,
      };

      console.log('Creando proposta con dati:', proposalData);

      const { error } = await supabase
        .from("proposals")
        .insert(proposalData);

      if (error) {
        console.error("Error creating proposal:", error);
        toast({
          title: "Errore",
          description: "Impossibile inviare la proposta. Riprova più tardi.",
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

  const getCompanyName = (): string => {
    return jobOffer.company_name || jobOffer.company_registrations?.nome_azienda || "Azienda non specificata";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invia Candidato</DialogTitle>
          <DialogDescription>
            Proponi un candidato per la posizione "{jobOffer.title}" presso {getCompanyName()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidate_name">Nome Candidato *</Label>
              <Input
                id="candidate_name"
                value={formData.candidate_name}
                onChange={(e) => handleInputChange("candidate_name", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="candidate_email">Email Candidato *</Label>
              <Input
                id="candidate_email"
                type="email"
                value={formData.candidate_email}
                onChange={(e) => handleInputChange("candidate_email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidate_phone">Telefono</Label>
              <Input
                id="candidate_phone"
                value={formData.candidate_phone}
                onChange={(e) => handleInputChange("candidate_phone", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="candidate_linkedin">LinkedIn</Label>
              <Input
                id="candidate_linkedin"
                value={formData.candidate_linkedin}
                onChange={(e) => handleInputChange("candidate_linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="years_experience">Anni di Esperienza</Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                value={formData.years_experience}
                onChange={(e) => handleInputChange("years_experience", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="current_salary">Stipendio Attuale (€)</Label>
              <Input
                id="current_salary"
                type="number"
                min="0"
                value={formData.current_salary}
                onChange={(e) => handleInputChange("current_salary", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expected_salary">Stipendio Richiesto (€)</Label>
              <Input
                id="expected_salary"
                type="number"
                min="0"
                value={formData.expected_salary}
                onChange={(e) => handleInputChange("expected_salary", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availability_weeks">Disponibilità (settimane)</Label>
              <Input
                id="availability_weeks"
                type="number"
                min="0"
                value={formData.availability_weeks}
                onChange={(e) => handleInputChange("availability_weeks", e.target.value)}
                placeholder="Es. 4"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recruiter_fee_percentage">Commissione (%)</Label>
              <Input
                id="recruiter_fee_percentage"
                type="number"
                min="0"
                max="50"
                value={formData.recruiter_fee_percentage}
                onChange={(e) => handleInputChange("recruiter_fee_percentage", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal_description">Descrizione della Proposta</Label>
            <Textarea
              id="proposal_description"
              value={formData.proposal_description}
              onChange={(e) => handleInputChange("proposal_description", e.target.value)}
              placeholder="Descrivi perché questo candidato è perfetto per la posizione..."
              rows={4}
            />
          </div>

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
      </DialogContent>
    </Dialog>
  );
}
