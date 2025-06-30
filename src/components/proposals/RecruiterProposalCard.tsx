
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro, Calendar, User, Building2 } from "lucide-react";
import ProposalDetailsDialog from "./ProposalDetailsDialog";

interface RecruiterProposalCardProps {
  proposal: {
    id: string;
    candidate_name: string;
    candidate_email: string;
    candidate_phone?: string;
    candidate_linkedin?: string;
    proposal_description: string;
    years_experience?: number;
    expected_salary?: number;
    availability_weeks?: number;
    recruiter_fee_percentage?: number;
    status: string;
    created_at: string;
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {proposal.candidate_name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Building2 className="h-4 w-4" />
              {proposal.job_offers?.company_name || "Azienda"}
              {proposal.job_offers?.title && (
                <>
                  <span>•</span>
                  <span>{proposal.job_offers.title}</span>
                </>
              )}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(proposal.status)}>
            {getStatusText(proposal.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {proposal.proposal_description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {proposal.years_experience && (
              <div>
                <span className="font-medium">Esperienza:</span>
                <p>{proposal.years_experience} anni</p>
              </div>
            )}
            {proposal.expected_salary && (
              <div className="flex items-center gap-1">
                <Euro className="h-4 w-4" />
                <span className="font-medium">Salario:</span>
                <p>€{proposal.expected_salary.toLocaleString()}</p>
              </div>
            )}
            {proposal.availability_weeks && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Disponibile:</span>
                <p>{proposal.availability_weeks} settimane</p>
              </div>
            )}
            <div>
              <span className="font-medium">Fee:</span>
              <p>{proposal.recruiter_fee_percentage}%</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Inviata il {new Date(proposal.created_at).toLocaleDateString('it-IT')}
            </div>
            <ProposalDetailsDialog proposal={proposal} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
