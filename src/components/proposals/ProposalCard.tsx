
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Euro, Calendar, User, Phone, Linkedin } from "lucide-react";
import ProposalDetailsDialog from "./ProposalDetailsDialog";
import RecruiterProfileCard from "../recruiter/RecruiterProfileCard";

interface ProposalCardProps {
  proposal: {
    id: string;
    candidate_name: string;
    candidate_email: string;
    candidate_phone?: string;
    candidate_linkedin?: string;
    candidate_cv_url?: string;
    proposal_description: string;
    years_experience?: number;
    expected_salary?: number;
    availability_weeks?: number;
    recruiter_fee_percentage?: number;
    status: string;
    created_at: string;
    recruiter_email?: string;
    recruiter_name?: string;
    job_offers?: {
      title: string;
      company_name?: string;
    };
  };
  onStatusUpdate?: (proposalId: string, status: string) => void;
  onSendResponse?: (proposalId: string, response: any) => void;
  onDelete?: (proposalId: string) => void;
}

export default function ProposalCard({ proposal, onStatusUpdate, onSendResponse, onDelete }: ProposalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "In Attesa";
      case "under_review":
        return "In Revisione";
      case "approved":
        return "Approvata";
      case "rejected":
        return "Rifiutata";
      case "hired":
        return "Assunto";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle className="text-lg">{proposal.candidate_name}</CardTitle>
            </div>
            <Badge className={getStatusColor(proposal.status)}>
              {getStatusText(proposal.status)}
            </Badge>
          </div>
          {proposal.job_offers?.title && (
            <div className="text-sm text-muted-foreground">
              Proposta per: <span className="font-medium">{proposal.job_offers.title}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Descrizione del candidato */}
          {proposal.proposal_description ? (
            <div>
              <h4 className="font-medium mb-2">Descrizione del candidato:</h4>
              <p className="text-sm text-muted-foreground">
                {proposal.proposal_description.length > 150
                  ? `${proposal.proposal_description.substring(0, 150)}...`
                  : proposal.proposal_description}
              </p>
            </div>
          ) : (
            <div>
              <h4 className="font-medium mb-2">Descrizione del candidato:</h4>
              <p className="text-sm text-muted-foreground">Nessuna descrizione fornita</p>
            </div>
          )}

          {/* Contatti Candidato */}
          <div>
            <h4 className="font-medium mb-2">Contatti Candidato:</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <a href={`mailto:${proposal.candidate_email}`} className="text-blue-600 hover:underline">
                  {proposal.candidate_email}
                </a>
              </div>
              {proposal.candidate_phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${proposal.candidate_phone}`} className="text-blue-600 hover:underline">
                    {proposal.candidate_phone}
                  </a>
                </div>
              )}
              {proposal.candidate_linkedin && (
                <div className="flex items-center gap-2 text-sm">
                  <Linkedin className="h-4 w-4" />
                  <a href={proposal.candidate_linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Profilo LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Dettagli */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Fee recruiter: </span>
              <span>{proposal.recruiter_fee_percentage}%</span>
            </div>
            {proposal.years_experience && (
              <div>
                <span className="font-medium">Esperienza: </span>
                <span>{proposal.years_experience} anni</span>
              </div>
            )}
            {proposal.expected_salary && (
              <div className="flex items-center gap-1">
                <Euro className="h-4 w-4" />
                <span>€{proposal.expected_salary.toLocaleString()}</span>
              </div>
            )}
            {proposal.availability_weeks && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{proposal.availability_weeks} settimane</span>
              </div>
            )}
          </div>

          {/* Data di ricezione */}
          <div className="text-xs text-muted-foreground border-t pt-2">
            Ricevuta il {new Date(proposal.created_at).toLocaleDateString('it-IT')} alle {new Date(proposal.created_at).toLocaleTimeString('it-IT')}
          </div>

          {/* Pulsanti azione */}
          <div className="flex justify-end gap-2 pt-2">
            <ProposalDetailsDialog proposal={proposal} />
            {onDelete && (
              <Button
                onClick={() => onDelete(proposal.id)}
                variant="destructive"
                size="sm"
              >
                Elimina
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profilo Recruiter - Versione compatta */}
      {(proposal.recruiter_email || proposal.recruiter_name) && (
        <RecruiterProfileCard 
          recruiterEmail={proposal.recruiter_email}
          recruiterName={proposal.recruiter_name}
          compact={true}
        />
      )}
    </div>
  );
}
