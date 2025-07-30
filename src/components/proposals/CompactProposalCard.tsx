import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Crown, FileText, User, MessageCircle } from "lucide-react";
import { useRecruiterRanking } from "@/hooks/useRecruiterRanking";
import { useRecruiterRating } from "@/hooks/useRecruiterRating";
import { StarRating } from "@/components/ui/star-rating";
import CVViewer from "@/components/cv/CVViewer";

interface CompactProposalCardProps {
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
    recruiter_email?: string;
    recruiter_name?: string;
    job_offers?: {
      title: string;
      company_name?: string;
    };
  };
  onStatusUpdate?: (proposalId: string, status: string) => void;
  onRequestAccess?: (proposalId: string) => void;
  onContactRecruiter?: (proposalId: string, recruiterEmail: string, recruiterName: string) => void;
}

export default function CompactProposalCard({ 
  proposal, 
  onStatusUpdate, 
  onRequestAccess,
  onContactRecruiter
}: CompactProposalCardProps) {
  const { rankingInfo } = useRecruiterRanking(proposal.recruiter_email);
  const { rating, fetchRatingByEmail } = useRecruiterRating();
  
  // Fetch rating when recruiter email is available
  React.useEffect(() => {
    if (proposal.recruiter_email) {
      fetchRatingByEmail(proposal.recruiter_email);
    }
  }, [proposal.recruiter_email, fetchRatingByEmail]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { 
          color: "bg-indigo-100 text-indigo-800", 
          text: "Da visionare",
          borderColor: "border-l-indigo-600",
          tooltip: "Candidatura mai aperta"
        };
      case "under_review":
        return { 
          color: "bg-amber-100 text-amber-800", 
          text: "In esame",
          borderColor: "border-l-amber-600",
          tooltip: "Screening in corso"
        };
      case "approved":
        return { 
          color: "bg-emerald-100 text-emerald-800", 
          text: "Short-list",
          borderColor: "border-l-emerald-600",
          tooltip: "Pronti al colloquio"
        };
      default:
        return { 
          color: "bg-gray-100 text-gray-800", 
          text: "Chiuse",
          borderColor: "border-l-gray-400",
          tooltip: "Rifiutate o ritirate"
        };
    }
  };

  const statusInfo = getStatusInfo(proposal.status);
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
    <TooltipProvider>
      <Card className={`w-full border-l-4 ${statusInfo.borderColor} hover:shadow-md transition-shadow`}>
        <CardContent className="p-4 space-y-4">
          {/* Header: Status Chip + Job Title */}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={`${statusInfo.color} cursor-help`}>
                  {statusInfo.text}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {statusInfo.tooltip}
              </TooltipContent>
            </Tooltip>
            <h3 className="font-bold text-base leading-tight">
              {proposal.job_offers?.title || "Posizione non specificata"}
            </h3>
          </div>

          {/* Body: Two Columns */}
          <div className="flex items-start justify-between gap-4">
            {/* Left Column: Recruiter + Candidate */}
            <div className="flex-1 space-y-3">
              {/* Recruiter Info */}
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                    {proposal.recruiter_name?.charAt(0) || "R"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {proposal.recruiter_name || "Recruiter"}
                    </span>
                    {rankingInfo.ranking_label && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1 cursor-help text-xs px-1 py-0">
                            <Crown className="h-2 w-2" />
                            {rankingInfo.ranking_label}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs max-w-[200px]">
                          Tra i migliori {rankingInfo.ranking_label === 'Top 5' ? '5' : rankingInfo.ranking_label === 'Top 10' ? '10' : '25'} recruiter
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {rating.totalReviews > 0 && (
                    <StarRating 
                      rating={rating.averageRating} 
                      totalReviews={rating.totalReviews}
                      showNumber={true}
                      size={12}
                    />
                  )}
                </div>
              </div>
              
              {/* Candidate Info */}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {formatCandidateName(proposal.candidate_name)}
                </span>
                {hasCv ? (
                  <CVViewer 
                    cvUrl={cvUrl}
                    candidateName={proposal.candidate_name}
                    trigger={
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 cursor-pointer hover:bg-blue-200 text-xs">
                        📄 CV
                      </Badge>
                    }
                  />
                ) : (
                  <Badge variant="outline" className="text-xs text-gray-600">
                    Nessun CV
                  </Badge>
                )}
              </div>
              
              {/* Candidate Details - Show when approved */}
              {proposal.status === "approved" && (
                <div className="mt-2 p-2 bg-muted/20 rounded-md space-y-1">
                  {proposal.candidate_description && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Profilo:</strong> {proposal.candidate_description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {proposal.years_experience && (
                      <span><strong>Esperienza:</strong> {proposal.years_experience} anni</span>
                    )}
                    {proposal.expected_salary && (
                      <span><strong>RAL:</strong> €{(proposal.expected_salary/1000).toFixed(0)}k</span>
                    )}
                    {proposal.availability_weeks && (
                      <span><strong>Disponibilità:</strong> {proposal.availability_weeks} settimane</span>
                    )}
                  </div>
                  {!proposal.contact_data_protected && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Email:</strong> {proposal.candidate_email}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Unlock Contacts */}
            <div className="flex-shrink-0">
              {proposal.contact_data_protected && onRequestAccess && (
                <button
                  onClick={() => onRequestAccess(proposal.id)}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  🔒 Sblocca contatti
                </button>
              )}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex gap-2 pt-2">
            {proposal.status === "pending" && onStatusUpdate && (
              <>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "under_review")}
                  variant="default"
                  size="sm"
                  className="text-xs"
                >
                  Valuta
                </Button>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "approved")}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  Short-lista
                </Button>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "rejected")}
                  variant="outline"
                  size="sm"
                  className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                >
                  Scarta
                </Button>
              </>
            )}

            {proposal.status === "under_review" && onStatusUpdate && (
              <>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "approved")}
                  variant="default"
                  size="sm"
                  className="text-xs"
                >
                  Short-lista
                </Button>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "rejected")}
                  variant="outline"
                  size="sm"
                  className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                >
                  Scarta
                </Button>
              </>
            )}

            {/* Message recruiter button for approved proposals */}
            {proposal.status === "approved" && onContactRecruiter && proposal.recruiter_email && (
              <Button
                onClick={() => onContactRecruiter(proposal.id, proposal.recruiter_email, proposal.recruiter_name || "Recruiter")}
                variant="outline"
                size="sm"
                className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Contatta recruiter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}