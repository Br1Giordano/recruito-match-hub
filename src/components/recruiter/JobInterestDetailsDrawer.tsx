import { useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, MapPin, Euro, Clock, Calendar, Eye, Trash2, X } from "lucide-react";

interface JobInterestDetailsDrawerProps {
  interest: any;
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (jobOffer: any) => void;
  onSendProposal: (jobOffer: any) => void;
  onRemoveInterest: (interestId: string) => void;
  onCompanyClick: (companyEmail: string) => void;
}

export const JobInterestDetailsDrawer = ({
  interest,
  isOpen,
  onClose,
  onViewDetails,
  onSendProposal,
  onRemoveInterest,
  onCompanyClick,
}: JobInterestDetailsDrawerProps) => {
  if (!interest) return null;

  const jobOffer = interest.job_offers;

  if (!jobOffer) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Offerta non trovata</DrawerTitle>
            <DrawerDescription>
              Questa offerta non è più disponibile
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6">
            <Button
              variant="outline"
              onClick={() => onRemoveInterest(interest.id)}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Rimuovi interesse
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  const getEmploymentTypeText = (type: string) => {
    switch (type) {
      case 'full-time': return 'Tempo pieno';
      case 'part-time': return 'Tempo parziale';
      case 'contract': return 'Contratto';
      case 'freelance': return 'Freelance';
      case 'internship': return 'Stage';
      default: return type;
    }
  };

  // Emergency escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        {/* Emergency close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50 bg-background"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <DrawerHeader>
          <DrawerTitle className="text-left">{jobOffer.title}</DrawerTitle>
          {jobOffer.company_name && (
            <DrawerDescription className="text-left">
              <button
                onClick={() => onCompanyClick(jobOffer.contact_email)}
                className="hover:text-primary hover:underline transition-colors flex items-center gap-1"
              >
                <Building2 className="h-4 w-4" />
                {jobOffer.company_name}
              </button>
            </DrawerDescription>
          )}
        </DrawerHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Informazioni principali */}
          <div className="grid grid-cols-2 gap-4">
            {jobOffer.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{jobOffer.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{getEmploymentTypeText(jobOffer.employment_type || 'full-time')}</span>
            </div>

            {(jobOffer.salary_min || jobOffer.salary_max) && (
              <div className="flex items-center gap-2 text-sm col-span-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span>
                  {jobOffer.salary_min && jobOffer.salary_max
                    ? `€${jobOffer.salary_min.toLocaleString()} - €${jobOffer.salary_max.toLocaleString()}`
                    : jobOffer.salary_min
                    ? `Da €${jobOffer.salary_min.toLocaleString()}`
                    : `Fino a €${jobOffer.salary_max?.toLocaleString()}`}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Descrizione */}
          {jobOffer.description && (
            <div className="space-y-2">
              <h3 className="font-semibold">Descrizione</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {jobOffer.description}
              </p>
            </div>
          )}

          {/* Requisiti */}
          {jobOffer.requirements && (
            <div className="space-y-2">
              <h3 className="font-semibold">Requisiti</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {jobOffer.requirements}
              </p>
            </div>
          )}

          {/* Benefici */}
          {jobOffer.benefits && (
            <div className="space-y-2">
              <h3 className="font-semibold">Benefici</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {jobOffer.benefits}
              </p>
            </div>
          )}

          {/* Note personali */}
          {interest.notes && (
            <div className="space-y-2">
              <h3 className="font-semibold">Le mie note</h3>
              <p className="text-sm text-muted-foreground italic bg-muted/50 p-3 rounded-lg">
                {interest.notes}
              </p>
            </div>
          )}

          <Separator />

          {/* Data interesse */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              Presa in carico il {new Date(interest.created_at).toLocaleDateString('it-IT')} 
              alle {new Date(interest.created_at).toLocaleTimeString('it-IT')}
            </span>
          </div>

          {/* Azioni */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onViewDetails(jobOffer)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Dettagli completi
            </Button>
            <Button
              variant="outline"
              onClick={() => onRemoveInterest(interest.id)}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Rimuovi interesse
            </Button>
            <Button
              onClick={() => onSendProposal(jobOffer)}
              className="flex-1"
            >
              Invia Candidato
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};