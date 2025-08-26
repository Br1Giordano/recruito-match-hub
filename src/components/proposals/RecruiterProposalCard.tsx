import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Euro, 
  Calendar, 
  User, 
  Phone, 
  Linkedin, 
  MapPin, 
  Building2, 
  MessageCircle,
  Briefcase,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
  Star
} from "lucide-react";
import ProposalDetailsDialog from "./ProposalDetailsDialog";
import RecruiterAvatar from "../recruiter/RecruiterAvatar";
import { useRecruiterProfileByEmail } from "@/hooks/useRecruiterProfileByEmail";
import { useRecruiterRating } from "@/hooks/useRecruiterRating";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { StarRating } from "@/components/ui/star-rating";
import { MessageCenter } from "../messaging/MessageCenter";
import { toast } from "@/hooks/use-toast";

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
  const { profile: recruiterProfile, fetchProfileByEmail, loading: loadingRecruiter } = useRecruiterProfileByEmail();
  const { rating, fetchRatingByEmail } = useRecruiterRating();
  const { createConversation } = useMessages();
  const { user } = useAuth();
  const [showMessageCenter, setShowMessageCenter] = useState(false);

  // Carica il profilo del recruiter solo una volta quando il componente viene montato
  useEffect(() => {
    if (proposal.recruiter_email && !recruiterProfile) {
      fetchProfileByEmail(proposal.recruiter_email);
      fetchRatingByEmail(proposal.recruiter_email);
    }
  }, [proposal.recruiter_email, fetchProfileByEmail, recruiterProfile, fetchRatingByEmail]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusMap: { [key: string]: { label: string; variant: "approved" | "pending" | "rejected"; icon: any } } = {
    pending: { label: 'In Attesa', variant: 'pending', icon: Clock },
    under_review: { label: 'In Revisione', variant: 'pending', icon: Clock },
    approved: { label: 'Approvata', variant: 'approved', icon: CheckCircle2 },
    rejected: { label: 'Rifiutata', variant: 'rejected', icon: FileText },
    hired: { label: 'Assunto', variant: 'approved', icon: CheckCircle2 },
  };

  const currentStatus = statusMap[proposal.status] || { 
    label: proposal.status, 
    variant: 'pending' as const, 
    icon: Clock 
  };

  const StatusIcon = currentStatus.icon;

  return (
    <Card className="group">
      <CardHeader className="pb-4">
        {/* Header minimale */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Candidato
          </div>
          <Badge 
            variant={currentStatus.variant}
            className="flex items-center gap-1.5"
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {currentStatus.label}
          </Badge>
        </div>

        {/* Hero candidato pulito */}
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-muted text-muted-foreground text-lg font-medium">
              {getInitials(proposal.candidate_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              {proposal.candidate_name}
            </h2>
            {proposal.job_offers?.title && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium bg-muted px-3 py-1.5 rounded-lg">
                  {proposal.job_offers.title}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Info grid pulito */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {proposal.years_experience && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Esperienza</span>
              </div>
              <p className="text-lg font-semibold">{proposal.years_experience} anni</p>
            </div>
          )}
          
          {proposal.availability_weeks && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Disponibilità</span>
              </div>
              <p className="text-lg font-semibold">{proposal.availability_weeks} settimane</p>
            </div>
          )}
          
          {proposal.expected_salary && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Stipendio</span>
              </div>
              <p className="text-lg font-semibold">€{proposal.expected_salary.toLocaleString()}</p>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Email</span>
            </div>
            <p className="text-sm font-medium truncate">{proposal.candidate_email}</p>
          </div>
        </div>

        {/* Descrizione */}
        {proposal.proposal_description && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Descrizione
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{proposal.proposal_description}</p>
          </div>
        )}

        {/* Contatti aggiuntivi */}
        {(proposal.candidate_phone || proposal.candidate_linkedin) && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Contatti
            </h4>
            <div className="flex flex-wrap gap-2">
              {proposal.candidate_phone && (
                <a 
                  href={`tel:${proposal.candidate_phone}`} 
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-sm"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {proposal.candidate_phone}
                </a>
              )}
              {proposal.candidate_linkedin && (
                <a 
                  href={proposal.candidate_linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-sm"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        )}

        {/* Recruiter info minimal */}
        {proposal.recruiter_name && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RecruiterAvatar 
                  avatarUrl={recruiterProfile?.avatar_url}
                  name={`${recruiterProfile?.nome || ''} ${recruiterProfile?.cognome || ''}`}
                  size="sm"
                />
                <div>
                  <p className="text-sm font-medium">
                    {recruiterProfile ? `${recruiterProfile.nome} ${recruiterProfile.cognome}` : proposal.recruiter_name}
                  </p>
                  {!loadingRecruiter && rating && rating.totalReviews > 0 && (
                    <div className="flex items-center gap-1">
                      <StarRating rating={rating.averageRating} size={10} />
                      <span className="text-xs text-muted-foreground">({rating.totalReviews})</span>
                    </div>
                  )}
                </div>
              </div>
              {proposal.recruiter_fee_percentage && (
                <span className="text-sm text-muted-foreground">
                  Fee: <span className="font-medium">{proposal.recruiter_fee_percentage}%</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <ProposalDetailsDialog proposal={proposal} />
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground text-center pt-2">
          {new Date(proposal.created_at).toLocaleDateString('it-IT')}
        </div>
      </CardContent>
      
      {/* Message Center */}
      {showMessageCenter && (
        <MessageCenter
          isOpen={showMessageCenter}
          onClose={() => setShowMessageCenter(false)}
        />
      )}
    </Card>
  );
}
