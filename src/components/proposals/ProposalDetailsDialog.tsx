import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Euro, Calendar, User, Building2, Phone, Linkedin, UserCircle } from "lucide-react";
import { useRecruiterProfileByEmail } from "@/hooks/useRecruiterProfileByEmail";
import RecruiterProfileViewModal from "../recruiter/RecruiterProfileViewModal";

interface ProposalDetailsDialogProps {
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
    recruiter_email?: string;
    recruiter_name?: string;
    job_offers?: {
      title: string;
      company_name?: string;
    };
  };
}

export default function ProposalDetailsDialog({ proposal }: ProposalDetailsDialogProps) {
  const [showRecruiterProfile, setShowRecruiterProfile] = useState(false);
  const { profile: recruiterProfile, fetchProfileByEmail, loading: loadingRecruiter } = useRecruiterProfileByEmail();

  const handleShowRecruiterProfile = async () => {
    if (proposal.recruiter_email) {
      console.log('Fetching recruiter profile for:', proposal.recruiter_email);
      const profile = await fetchProfileByEmail(proposal.recruiter_email);
      console.log('Fetched profile:', profile);
      setShowRecruiterProfile(true);
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
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Dettagli
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {proposal.candidate_name}
              </div>
              <Badge className={getStatusColor(proposal.status)}>
                {getStatusText(proposal.status)}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Job Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Informazioni Offerta</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{proposal.job_offers?.company_name || "Azienda"}</span>
                </div>
                {proposal.job_offers?.title && (
                  <div className="text-sm text-muted-foreground">
                    Posizione: {proposal.job_offers.title}
                  </div>
                )}
              </div>
            </div>

            {/* Recruiter Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Informazioni Recruiter</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {proposal.recruiter_name && (
                  <div className="mb-2">
                    <span className="font-medium">Nome: </span>
                    <span>{proposal.recruiter_name}</span>
                  </div>
                )}
                {proposal.recruiter_email && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleShowRecruiterProfile}
                      disabled={loadingRecruiter}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <UserCircle className="h-4 w-4" />
                      {loadingRecruiter ? "Caricamento..." : "Visualizza Profilo Recruiter"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Candidate Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Dettagli Candidato</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
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
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Informazioni Professionali</h3>
              <div className="grid grid-cols-2 gap-4">
                {proposal.years_experience && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Esperienza</div>
                    <div className="font-medium">{proposal.years_experience} anni</div>
                  </div>
                )}
                {proposal.expected_salary && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Euro className="h-4 w-4" />
                      Salario Desiderato
                    </div>
                    <div className="font-medium">€{proposal.expected_salary.toLocaleString()}</div>
                  </div>
                )}
                {proposal.availability_weeks && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Disponibilità
                    </div>
                    <div className="font-medium">{proposal.availability_weeks} settimane</div>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Fee Recruiter</div>
                  <div className="font-medium">{proposal.recruiter_fee_percentage}%</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {proposal.proposal_description && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Descrizione Candidato</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{proposal.proposal_description}</p>
                </div>
              </div>
            )}

            {/* Submission Info */}
            <div className="border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Proposta inviata il {new Date(proposal.created_at).toLocaleDateString('it-IT')} alle {new Date(proposal.created_at).toLocaleTimeString('it-IT')}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recruiter Profile Modal */}
      <RecruiterProfileViewModal
        open={showRecruiterProfile}
        onOpenChange={setShowRecruiterProfile}
        profile={recruiterProfile}
      />
    </>
  );
}
