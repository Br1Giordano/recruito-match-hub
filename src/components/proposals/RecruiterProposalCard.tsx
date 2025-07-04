
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Euro, Calendar, User, Phone, Linkedin, FileText } from "lucide-react";
import ProposalDetailsDialog from "./ProposalDetailsDialog";
import RecruiterProfileCard from "../recruiter/RecruiterProfileCard";

interface RecruiterProposalCardProps {
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
}

export default function RecruiterProposalCard({ proposal }: RecruiterProposalCardProps) {
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
              Proposta per la posizione: <span className="font-medium">{proposal.job_offers.title}</span>
              {proposal.job_offers.company_name && (
                <span> presso {proposal.job_offers.company_name}</span>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Descrizione del candidato */}
          <div>
            <h4 className="font-medium mb-3 text-gray-900">Descrizione del candidato</h4>
            {proposal.proposal_description ? (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {proposal.proposal_description}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm text-gray-500 italic">Nessuna descrizione fornita</p>
              </div>
            )}
          </div>

          {/* Contatti Candidato */}
          <div>
            <h4 className="font-medium mb-3 text-gray-900">Contatti del candidato</h4>
            <div className="bg-white border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <a 
                  href={`mailto:${proposal.candidate_email}`} 
                  className="text-blue-600 hover:underline font-medium"
                >
                  {proposal.candidate_email}
                </a>
              </div>
              
              {proposal.candidate_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a 
                    href={`tel:${proposal.candidate_phone}`} 
                    className="text-blue-600 hover:underline"
                  >
                    {proposal.candidate_phone}
                  </a>
                </div>
              )}
              
              {proposal.candidate_linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin className="h-4 w-4 text-gray-500" />
                  <a 
                    href={proposal.candidate_linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    Profilo LinkedIn
                  </a>
                </div>
              )}
              
              {proposal.candidate_cv_url && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <a 
                    href={proposal.candidate_cv_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    Visualizza CV
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Dettagli proposta */}
          <div>
            <h4 className="font-medium mb-3 text-gray-900">Dettagli della proposta</h4>
            <div className="grid grid-cols-2 gap-4">
              {proposal.years_experience && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Esperienza</div>
                  <div className="font-semibold text-gray-900">{proposal.years_experience} anni</div>
                </div>
              )}
              
              {proposal.expected_salary && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Euro className="h-4 w-4" />
                    Salario desiderato
                  </div>
                  <div className="font-semibold text-gray-900">
                    €{proposal.expected_salary.toLocaleString()}
                  </div>
                </div>
              )}
              
              {proposal.availability_weeks && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Disponibilità
                  </div>
                  <div className="font-semibold text-gray-900">
                    {proposal.availability_weeks} settimane
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Fee recruiter</div>
                <div className="font-semibold text-gray-900">
                  {proposal.recruiter_fee_percentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Data di ricezione */}
          <div className="text-xs text-gray-500 border-t pt-4">
            Proposta ricevuta il {new Date(proposal.created_at).toLocaleDateString('it-IT')} 
            alle {new Date(proposal.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* Pulsante Dettagli */}
          <div className="flex justify-end">
            <ProposalDetailsDialog proposal={proposal} />
          </div>
        </CardContent>
      </Card>

      {/* Profilo Recruiter - Componente separato */}
      <RecruiterProfileCard 
        recruiterEmail={proposal.recruiter_email}
        recruiterName={proposal.recruiter_name}
      />
    </div>
  );
}
