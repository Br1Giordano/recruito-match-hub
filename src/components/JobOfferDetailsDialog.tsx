import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, MapPin, Clock, Euro, Send, Calendar, User, FileText, Award } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type JobOfferWithCompany = Database['public']['Tables']['job_offers']['Row'] & {
  company_registrations?: {
    nome_azienda: string;
    id: string;
  } | null;
};

interface JobOfferDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobOffer: JobOfferWithCompany;
  onSendProposal?: (offer: JobOfferWithCompany) => void;
  canSendProposal?: boolean;
}

export default function JobOfferDetailsDialog({ 
  isOpen, 
  onClose, 
  jobOffer, 
  onSendProposal, 
  canSendProposal = false 
}: JobOfferDetailsDialogProps) {
  const getCompanyName = (offer: JobOfferWithCompany): string => {
    return offer.company_name || offer.company_registrations?.nome_azienda || "Azienda non specificata";
  };

  const getEmploymentTypeText = (type?: string) => {
    switch (type) {
      case "full-time":
        return "Tempo Pieno";
      case "part-time":
        return "Part-time";
      case "contract":
        return "Contratto";
      case "internship":
        return "Stage";
      default:
        return type || "Non specificato";
    }
  };

  const formatDescription = (description: string | null) => {
    if (!description) return null;
    return description.split('\n').map((line, index) => (
      <p key={index} className="mb-2">
        {line}
      </p>
    ));
  };

  const formatRequirements = (requirements: string | null) => {
    if (!requirements) return null;
    return requirements.split('\n').filter(req => req.trim()).map((requirement, index) => (
      <li key={index} className="mb-1">
        {requirement.trim()}
      </li>
    ));
  };

  const formatBenefits = (benefits: string | null) => {
    if (!benefits) return null;
    return benefits.split('\n').filter(benefit => benefit.trim()).map((benefit, index) => (
      <li key={index} className="mb-1">
        {benefit.trim()}
      </li>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                {jobOffer.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {getCompanyName(jobOffer)}
                  </span>
                  {jobOffer.location && (
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {jobOffer.location}
                    </span>
                  )}
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {getEmploymentTypeText(jobOffer.employment_type)}
                  </Badge>
                </div>
              </DialogDescription>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Attiva
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informazioni principali */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(jobOffer.salary_min || jobOffer.salary_max) && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Euro className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Retribuzione annuale</p>
                  <p className="text-lg font-semibold">
                    {jobOffer.salary_min && jobOffer.salary_max
                      ? `€${jobOffer.salary_min.toLocaleString()} - €${jobOffer.salary_max.toLocaleString()}`
                      : jobOffer.salary_min
                      ? `Da €${jobOffer.salary_min.toLocaleString()}`
                      : `Fino a €${jobOffer.salary_max?.toLocaleString()}`}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Data pubblicazione</p>
                <p className="text-lg font-semibold">
                  {new Date(jobOffer.created_at).toLocaleDateString('it-IT')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Descrizione */}
          {jobOffer.description && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Descrizione del ruolo
              </h3>
              <div className="text-muted-foreground leading-relaxed">
                {formatDescription(jobOffer.description)}
              </div>
            </div>
          )}

          {/* Requisiti */}
          {jobOffer.requirements && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-5 w-5" />
                Requisiti richiesti
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                {formatRequirements(jobOffer.requirements)}
              </ul>
            </div>
          )}

          {/* Benefit */}
          {jobOffer.benefits && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-5 w-5" />
                Benefit e vantaggi
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                {formatBenefits(jobOffer.benefits)}
              </ul>
            </div>
          )}

          {/* Azioni */}
          {canSendProposal && onSendProposal && (
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Hai il candidato perfetto per questa posizione?
                </p>
                <Button 
                  onClick={() => onSendProposal(jobOffer)}
                  className="bg-recruito-blue hover:bg-recruito-blue/90"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Invia Candidato
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}