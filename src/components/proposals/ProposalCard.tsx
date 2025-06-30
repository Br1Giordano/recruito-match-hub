
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Clock, Mail, Phone, Linkedin, Euro, Calendar, User, Trash2 } from "lucide-react";
import { useState } from "react";

interface ProposalCardProps {
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
    recruiter_name?: string;
    recruiter_email?: string;
    recruiter_phone?: string;
    job_offers?: {
      title: string;
    };
  };
  onStatusUpdate: (proposalId: string, status: string) => void;
  onSendResponse: (proposalId: string, status: string, message: string) => void;
  onDelete?: (proposalId: string) => void;
}

export default function ProposalCard({ proposal, onStatusUpdate, onSendResponse, onDelete }: ProposalCardProps) {
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-green-100 text-green-800"; // Changed to green for "interested" proposals
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
        return "Interessato"; // Changed to show "Interessato" for under_review status
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

  const handleSendResponse = (status: string) => {
    onSendResponse(proposal.id, status, responseMessage);
    setRespondingTo(null);
    setResponseMessage("");
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
            <CardDescription className="mt-1">
              {proposal.recruiter_name && (
                <>Proposto da {proposal.recruiter_name}</>
              )}
              {proposal.job_offers?.title && (
                <>
                  <span> • </span>
                  <span>{proposal.job_offers.title}</span>
                </>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(proposal.status)}>
              {getStatusText(proposal.status)}
            </Badge>
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(proposal.id)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Descrizione del candidato:</h4>
            <p className="text-sm text-muted-foreground">
              {proposal.proposal_description || "Nessuna descrizione fornita"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Contatti Candidato:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${proposal.candidate_email}`} className="text-blue-600 hover:underline">
                    {proposal.candidate_email}
                  </a>
                </div>
                {proposal.candidate_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${proposal.candidate_phone}`} className="text-blue-600 hover:underline">
                      {proposal.candidate_phone}
                    </a>
                  </div>
                )}
                {proposal.candidate_linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    <a href={proposal.candidate_linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Dettagli:</h4>
              <div className="space-y-1 text-sm">
                {proposal.years_experience && (
                  <div>Esperienza: {proposal.years_experience} anni</div>
                )}
                {proposal.expected_salary && (
                  <div className="flex items-center gap-1">
                    <Euro className="h-4 w-4" />
                    Salario desiderato: €{proposal.expected_salary.toLocaleString()}
                  </div>
                )}
                {proposal.availability_weeks && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Disponibile in: {proposal.availability_weeks} settimane
                  </div>
                )}
                {proposal.recruiter_fee_percentage && (
                  <div>Fee recruiter: {proposal.recruiter_fee_percentage}%</div>
                )}
              </div>
            </div>
          </div>

          {(proposal.recruiter_name || proposal.recruiter_email) && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Contatti Recruiter:</h4>
              <div className="flex items-center gap-4 text-sm">
                {proposal.recruiter_email && (
                  <a href={`mailto:${proposal.recruiter_email}`} className="text-blue-600 hover:underline">
                    {proposal.recruiter_email}
                  </a>
                )}
                {proposal.recruiter_phone && (
                  <a href={`tel:${proposal.recruiter_phone}`} className="text-blue-600 hover:underline">
                    {proposal.recruiter_phone}
                  </a>
                )}
              </div>
            </div>
          )}

          {proposal.status === "pending" && (
            <div className="flex items-center gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(proposal.id, "under_review")}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <Check className="h-4 w-4 mr-2" />
                Interessato
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(proposal.id, "rejected")}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Non Interessato
              </Button>
            </div>
          )}

          {respondingTo === proposal.id && (
            <div className="space-y-3 pt-4 border-t bg-gray-50 p-4 rounded">
              <Textarea
                placeholder="Scrivi una risposta al recruiter..."
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSendResponse("interested")}
                >
                  Invia Interesse
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendResponse("not_interested")}
                >
                  Declina
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRespondingTo(null);
                    setResponseMessage("");
                  }}
                >
                  Annulla
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Ricevuta il {new Date(proposal.created_at).toLocaleDateString('it-IT')} alle {new Date(proposal.created_at).toLocaleTimeString('it-IT')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
