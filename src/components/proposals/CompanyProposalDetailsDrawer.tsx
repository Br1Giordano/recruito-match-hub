import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Crown, 
  Star, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  FileText,
  MessageCircle
} from "lucide-react";
import { useRecruiterRanking } from "@/hooks/useRecruiterRanking";
import { useRecruiterRating } from "@/hooks/useRecruiterRating";
import { useRecruiterProfileByEmail } from "@/hooks/useRecruiterProfileByEmail";
import { StarRating } from "@/components/ui/star-rating";
import { useEffect } from "react";
import CVViewer from "@/components/cv/CVViewer";

interface CompanyProposalDetailsDrawerProps {
  proposal: {
    id: string;
    candidate_name: string;
    candidate_email: string;
    candidate_description?: string;
    candidate_cv_url?: string;
    candidate_cv_anonymized_url?: string;
    contact_data_protected?: boolean;
    company_access_level?: 'restricted' | 'partial' | 'full';
    years_experience?: number;
    expected_salary?: number;
    availability_weeks?: number;
    status: string;
    created_at: string;
    recruiter_email?: string;
    recruiter_name?: string;
    job_offers?: {
      title: string;
      company_name?: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (proposalId: string, status: string) => void;
  onContactRecruiter?: (proposalId: string, recruiterEmail: string, recruiterName: string) => void;
}

export default function CompanyProposalDetailsDrawer({ 
  proposal, 
  isOpen, 
  onClose,
  onStatusUpdate,
  onContactRecruiter
}: CompanyProposalDetailsDrawerProps) {
  const { rankingInfo } = useRecruiterRanking(proposal.recruiter_email);
  const { rating, fetchRatingByEmail } = useRecruiterRating();
  const { profile: recruiterProfile, fetchProfileByEmail } = useRecruiterProfileByEmail();

  useEffect(() => {
    if (proposal.recruiter_email) {
      fetchRatingByEmail(proposal.recruiter_email);
      fetchProfileByEmail(proposal.recruiter_email);
    }
  }, [proposal.recruiter_email, fetchRatingByEmail, fetchProfileByEmail]);

  const statusMap: { [key: string]: { label: string; color: string; bgColor: string; icon: any } } = {
    pending: { label: 'Da Visionare', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Clock },
    under_review: { label: 'In Esame', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Clock },
    approved: { label: 'Short-list', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle2 },
    rejected: { label: 'Scartata', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
    hired: { label: 'Assunta', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle2 },
  };

  const currentStatus = statusMap[proposal.status] || { 
    label: proposal.status, 
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: Clock 
  };

  const StatusIcon = currentStatus.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const hasCv = proposal.candidate_cv_url || proposal.candidate_cv_anonymized_url;
  const cvUrl = proposal.candidate_cv_url || proposal.candidate_cv_anonymized_url;

  // Format candidate name: Nome + Iniziale cognome
  const formatCandidateName = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length === 1) return parts[0];
    const firstName = parts[0];
    const lastNameInitial = parts[parts.length - 1].charAt(0);
    return `${firstName} ${lastNameInitial}.`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dettagli Proposta
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status */}
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${currentStatus.bgColor} ${currentStatus.color}`}>
              <StatusIcon className="h-4 w-4" />
              {currentStatus.label}
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(proposal.created_at)}
            </span>
          </div>

          {/* Job Position */}
          {proposal.job_offers?.title && (
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {proposal.job_offers.title}
              </h3>
            </div>
          )}

          {/* Candidate Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                  {formatCandidateName(proposal.candidate_name).split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-base">
                  {formatCandidateName(proposal.candidate_name)}
                </h4>
                <p className="text-sm text-gray-600">{proposal.candidate_email}</p>
              </div>
            </div>

            {/* Candidate Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {proposal.years_experience && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{proposal.years_experience} anni esperienza</span>
                </div>
              )}
              {proposal.expected_salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>€{(proposal.expected_salary/1000).toFixed(0)}k RAL</span>
                </div>
              )}
              {proposal.availability_weeks && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{proposal.availability_weeks} settimane disponibilità</span>
                </div>
              )}
              {hasCv && (
                <div className="col-span-2">
                  <CVViewer 
                    cvUrl={cvUrl}
                    candidateName={proposal.candidate_name}
                    trigger={
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Visualizza CV
                      </Button>
                    }
                  />
                </div>
              )}
            </div>

            {/* Candidate Description */}
            {proposal.candidate_description && (
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-2">Descrizione Candidato</h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {proposal.candidate_description}
                </p>
              </div>
            )}
          </div>

          {/* Recruiter Info */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {proposal.recruiter_name?.charAt(0) || "R"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-base">
                    {proposal.recruiter_name || "Recruiter"}
                  </h4>
                  {rankingInfo.ranking_label && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      {rankingInfo.ranking_label}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{proposal.recruiter_email}</p>
                {rating.totalReviews > 0 && (
                  <StarRating 
                    rating={rating.averageRating} 
                    totalReviews={rating.totalReviews}
                    showNumber={true}
                    size={14}
                  />
                )}
              </div>
            </div>

            {/* Recruiter Profile Info */}
            {recruiterProfile && (
              <div className="text-sm text-gray-600">
                {recruiterProfile.bio && (
                  <p className="mb-2">{recruiterProfile.bio}</p>
                )}
                {recruiterProfile.specializations && recruiterProfile.specializations.length > 0 && (
                  <div>
                    <span className="font-medium">Specializzazioni: </span>
                    {recruiterProfile.specializations.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {proposal.status === "pending" && onStatusUpdate && (
              <div className="flex gap-2">
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "under_review")}
                  variant="default"
                  className="flex-1"
                >
                  Valuta
                </Button>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "approved")}
                  variant="secondary"
                  className="flex-1"
                >
                  Short-lista
                </Button>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "rejected")}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                >
                  Scarta
                </Button>
              </div>
            )}

            {proposal.status === "under_review" && onStatusUpdate && (
              <div className="flex gap-2">
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "approved")}
                  variant="default"
                  className="flex-1"
                >
                  Short-lista
                </Button>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "rejected")}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                >
                  Scarta
                </Button>
              </div>
            )}

            {proposal.status === "approved" && onStatusUpdate && (
              <div className="flex gap-2">
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "hired")}
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Assumi
                </Button>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "rejected")}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                >
                  Scarta
                </Button>
              </div>
            )}

            {/* Contact Recruiter */}
            {proposal.status === "approved" && onContactRecruiter && proposal.recruiter_email && (
              <Button
                onClick={() => onContactRecruiter(proposal.id, proposal.recruiter_email!, proposal.recruiter_name || "Recruiter")}
                variant="outline"
                className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contatta Recruiter
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}