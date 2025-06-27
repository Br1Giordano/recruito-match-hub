
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Database } from "@/integrations/supabase/types";
import ProposalForm from "./proposal/ProposalForm";

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

        <ProposalForm jobOffer={jobOffer} onClose={onClose} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
