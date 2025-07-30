import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Crown } from "lucide-react";
import { useRecruiterRanking } from "@/hooks/useRecruiterRanking";

interface CompactProposalCardProps {
  proposal: {
    id: string;
    candidate_name: string;
    candidate_email: string;
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
}

export default function CompactProposalCard({ 
  proposal, 
  onStatusUpdate, 
  onRequestAccess 
}: CompactProposalCardProps) {
  const { rankingInfo } = useRecruiterRanking(proposal.recruiter_email);

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

  return (
    <TooltipProvider>
      <Card className={`w-full border-l-4 ${statusInfo.borderColor} hover:shadow-md transition-shadow`}>
        <CardContent className="p-4 space-y-3">
          {/* Header: Status + Job Title */}
          <div className="flex items-center justify-between">
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
            <div className="text-sm font-medium text-right">
              {proposal.job_offers?.title || "Posizione non specificata"}
            </div>
          </div>

          {/* Recruiter Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                {proposal.recruiter_name?.charAt(0) || "R"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">
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
            </div>
          </div>

          {/* Highlights - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            {proposal.years_experience && (
              <span>Esp: {proposal.years_experience}a</span>
            )}
            {proposal.expected_salary && (
              <span>RAL: €{(proposal.expected_salary/1000).toFixed(0)}k</span>
            )}
            {proposal.availability_weeks && (
              <span>Disp: {proposal.availability_weeks}sett</span>
            )}
          </div>

          {/* CV Badge */}
          <div className="flex items-center justify-between">
            <Badge variant={hasCv ? "default" : "outline"} className="text-xs">
              {hasCv ? "📄 CV" : "🔒 Nessun CV"}
            </Badge>
          </div>

          {/* Actions Footer */}
          <div className="flex flex-wrap gap-2 pt-2">
            {proposal.status === "pending" && onStatusUpdate && (
              <>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "under_review")}
                  variant="default"
                  size="sm"
                  className="flex-1 sm:flex-initial text-xs"
                >
                  Valuta
                </Button>
                <div className="hidden sm:flex gap-2">
                  <Button
                    onClick={() => onStatusUpdate(proposal.id, "approved")}
                    variant="outline"
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
                </div>
              </>
            )}

            {proposal.status === "under_review" && onStatusUpdate && (
              <>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "approved")}
                  variant="default"
                  size="sm"
                  className="flex-1 sm:flex-initial text-xs"
                >
                  Short-lista
                </Button>
                <div className="hidden sm:block">
                  <Button
                    onClick={() => onStatusUpdate(proposal.id, "rejected")}
                    variant="outline"
                    size="sm"
                    className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Scarta
                  </Button>
                </div>
              </>
            )}

            {/* Unlock contacts - Text link */}
            {proposal.contact_data_protected && onRequestAccess && (
              <button
                onClick={() => onRequestAccess(proposal.id)}
                className="text-xs text-primary hover:underline ml-auto"
              >
                Sblocca contatti
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}