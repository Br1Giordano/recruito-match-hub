import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Eye, X, Play, MoreHorizontal } from "lucide-react";

interface Proposal {
  id: string;
  candidate_name: string; 
  candidate_email: string;
  candidate_phone?: string;
  proposal_description?: string;
  status: string;
  created_at: string;
  recruiter_name?: string;
  recruiter_email?: string;
  recruiter_fee_percentage?: number;
  job_offers?: {
    title: string;
  };
}

interface ProposalSimpleViewProps {
  proposal: Proposal;
  onApprove: () => void;
  onReject: () => void;
  onStartReview: () => void;
  onViewRecruiterProfile: () => void;
}

export default function ProposalSimpleView({ 
  proposal, 
  onApprove, 
  onReject, 
  onStartReview,
  onViewRecruiterProfile 
}: ProposalSimpleViewProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Attesa</Badge>;
      case "under_review":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Valutazione</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approvata</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rifiutata</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Ricevuta il ${date.toLocaleDateString('it-IT')} alle ${date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{proposal.candidate_name}</h2>
              <p className="text-sm text-muted-foreground">
                Proposto da {proposal.recruiter_name || "Recruiter"} • {proposal.job_offers?.title || "Posizione"}
              </p>
            </div>
          </div>
          {getStatusBadge(proposal.status)}
        </div>

        {/* Recruiter Section */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-1">Recruiter</h3>
              <p className="font-semibold text-foreground">{proposal.recruiter_name || "Nome non disponibile"}</p>
              <p className="text-sm text-muted-foreground">{proposal.recruiter_email || "Email non disponibile"}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onViewRecruiterProfile}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualizza Profilo
            </Button>
          </div>
        </div>

        {/* Candidate Description */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Descrizione del candidato:</h3>
          <p className="text-muted-foreground">
            {proposal.proposal_description || "Nessuna descrizione fornita"}
          </p>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Contatti Candidato:</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <a 
                href={`mailto:${proposal.candidate_email}`}
                className="text-blue-600 hover:underline"
              >
                {proposal.candidate_email}
              </a>
            </div>
            {proposal.candidate_phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a 
                  href={`tel:${proposal.candidate_phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {proposal.candidate_phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Fee Information */}
        <div>
          <p className="text-sm">
            <span className="font-medium">Fee recruiter: </span>
            <span>{proposal.recruiter_fee_percentage || 15}%</span>
          </p>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          {formatDate(proposal.created_at)}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onReject}
            className="text-red-600 border-red-200 hover:bg-red-50"
            disabled={proposal.status === "rejected"}
          >
            <X className="w-4 h-4 mr-2" />
            Rifiuta
          </Button>
          <Button
            onClick={onStartReview}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={proposal.status !== "pending"}
          >
            <Play className="w-4 h-4 mr-2" />
            Avvia Valutazione
          </Button>
          <Button
            variant="ghost"
            onClick={() => {}} // Handle details view
            className="text-muted-foreground"
          >
            <MoreHorizontal className="w-4 h-4 mr-2" />
            Dettagli
          </Button>
        </div>
      </Card>
    </div>
  );
}