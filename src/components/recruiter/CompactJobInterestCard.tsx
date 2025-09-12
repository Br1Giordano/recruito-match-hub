import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Building2, MapPin, Euro, Clock, Trash2, Eye, StickyNote, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompactJobInterestCardProps {
  interest: any;
  onRemoveInterest: (interestId: string) => void;
  onViewDetails: (jobOffer: any) => void;
  onSendProposal: (jobOffer: any) => void;
  onCompanyClick: (companyEmail: string) => void;
}

export const CompactJobInterestCard = ({ 
  interest, 
  onRemoveInterest, 
  onViewDetails, 
  onSendProposal,
  onCompanyClick 
}: CompactJobInterestCardProps) => {
  const [notes, setNotes] = useState(interest.notes || "");
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const { toast } = useToast();

  const jobOffer = interest.job_offers;

  if (!jobOffer) {
    return (
      <Card className="border-dashed border-muted-foreground/50">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-sm">Offerta non trovata</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemoveInterest(interest.id)}
            className="mt-2"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Rimuovi
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleNotesChange = (value: string) => {
    setNotes(value);
    // In a real app, you would save this to the database
    toast({
      title: "Note salvate",
      description: "Le tue note sono state aggiornate",
    });
  };

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

  return (
    <Card className="group hover:shadow-startup transition-all duration-200 border-gray-100 overflow-hidden">
      <CardContent className="p-4">
        {/* Riga 1: Titolo, Azienda e Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-navy truncate mb-1">
              {jobOffer.title}
            </h3>
            {jobOffer.company_name && (
              <button
                onClick={() => onCompanyClick(jobOffer.contact_email)}
                className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors flex items-center gap-1"
              >
                <Building2 className="h-3 w-3" />
                {jobOffer.company_name}
              </button>
            )}
          </div>
          <Badge variant="outline" className="text-xs ml-2 shrink-0">
            <Clock className="h-3 w-3 mr-1" />
            {getEmploymentTypeText(jobOffer.employment_type || 'full-time')}
          </Badge>
        </div>

        {/* Riga 2: Informazioni principali */}
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground flex-wrap">
          {jobOffer.location && (
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate block max-w-full">{jobOffer.location}</span>
            </div>
          )}
          {(jobOffer.salary_min || jobOffer.salary_max) && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="truncate">
                {jobOffer.salary_min && jobOffer.salary_max
                  ? `€${jobOffer.salary_min.toLocaleString()} - €${jobOffer.salary_max.toLocaleString()}`
                  : jobOffer.salary_min
                  ? `Da €${jobOffer.salary_min.toLocaleString()}`
                  : `Fino a €${jobOffer.salary_max?.toLocaleString()}`}
              </span>
            </div>
          )}
        </div>

        {/* Riga 3: Azioni e Note */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {new Date(interest.created_at).toLocaleDateString('it-IT')}
          </div>
          
          <div className="flex items-center gap-1">
            <Popover open={isNotesOpen} onOpenChange={setIsNotesOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  <StickyNote className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-80 bg-white border border-gray-200 shadow-lg z-50"
                align="end"
              >
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Note personali</h4>
                  <Textarea
                    placeholder="Aggiungi le tue note..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={() => handleNotesChange(notes)}
                    className="min-h-20 text-sm resize-none"
                  />
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(jobOffer)}
              className="h-7 w-7 p-0"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveInterest(interest.id)}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>

            <Button
              onClick={() => onSendProposal(jobOffer)}
              size="sm"
              className="h-7 px-3 text-xs"
            >
              Candidato
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};