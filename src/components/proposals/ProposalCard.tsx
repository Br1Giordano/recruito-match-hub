
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Euro, Calendar, User, Building2, Phone, Linkedin, UserCircle, Star, CheckCircle } from "lucide-react";
import ProposalDetailsDialog from "./ProposalDetailsDialog";
import RecruiterProfileViewModal from "../recruiter/RecruiterProfileViewModal";
import RecruiterReviewModal from "../recruiter/RecruiterReviewModal";
import { useRecruiterProfileByEmail } from "@/hooks/useRecruiterProfileByEmail";

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
  const [showRecruiterProfile, setShowRecruiterProfile] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { profile: recruiterProfile, fetchProfileByEmail, loading: loadingRecruiter } = useRecruiterProfileByEmail();

  const handleShowRecruiterProfile = async () => {
    if (proposal.recruiter_email) {
      console.log('Fetching recruiter profile for:', proposal.recruiter_email);
      const profile = await fetchProfileByEmail(proposal.recruiter_email);
      console.log('Fetched profile:', profile);
      setShowRecruiterProfile(true);
    }
  };

  const handleApprove = () => {
    if (onStatusUpdate) {
      onStatusUpdate(proposal.id, 'approved');
    }
  };

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
    <>
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
              Proposto da {proposal.recruiter_name || proposal.recruiter_email} • {proposal.job_offers.title}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Informazioni Recruiter */}
          {(proposal.recruiter_email || proposal.recruiter_name) && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-blue-900">Recruiter</h4>
                <div className="flex gap-2">
                  <Button
                    onClick={handleShowRecruiterProfile}
                    disabled={loadingRecruiter}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-300 hover:bg-blue-100"
                  >
                    <UserCircle className="h-4 w-4 mr-2" />
                    {loadingRecruiter ? "Caricamento..." : "Visualizza Profilo"}
                  </Button>
                  
                  {/* Pulsante Recensione - Solo per proposte approvate/assunto */}
                  {(proposal.status === 'approved' || proposal.status === 'hired') && (
                    <Button
                      onClick={() => setShowReviewModal(true)}
                      variant="outline"
                      size="sm"
                      className="text-yellow-600 border-yellow-300 hover:bg-yellow-100"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Recensisci
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {proposal.recruiter_name || 'Recruiter'}
                </div>
                <div className="text-gray-600">
                  {proposal.recruiter_email}
                </div>
              </div>
            </div>
          )}

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
            {/* Pulsante Approva - Solo per proposte in revisione */}
            {proposal.status === 'under_review' && (
              <Button
                onClick={handleApprove}
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approva
              </Button>
            )}
            
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

      {/* Modal Profilo Recruiter */}
      <RecruiterProfileViewModal
        open={showRecruiterProfile}
        onOpenChange={setShowRecruiterProfile}
        profile={recruiterProfile}
      />

      {/* Modal Recensione */}
      {proposal.recruiter_email && (
        <RecruiterReviewModal
          open={showReviewModal}
          onOpenChange={setShowReviewModal}
          recruiterEmail={proposal.recruiter_email}
          proposalId={proposal.id}
        />
      )}
    </>
  );
}
