
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import CVViewer from '@/components/cv/CVViewer';
import {
  CheckCircle2,
  Clock4,
  FileText,
  LucideIcon,
  Mail,
  User,
  Briefcase,
  Calendar,
  Euro,
  Star,
  MapPin,
} from "lucide-react";

const statusMap: { [key: string]: { label: string; variant: "approved" | "pending" | "rejected"; icon: LucideIcon } } = {
  pending: { label: "In Attesa", variant: "pending", icon: Clock4 },
  approved: { label: "Approvata", variant: "approved", icon: CheckCircle2 },
  rejected: { label: "Rifiutata", variant: "rejected", icon: FileText },
  under_review: { label: "In Revisione", variant: "pending", icon: Clock4 },
  contacted: { label: "Contattato", variant: "approved", icon: Mail },
  interview_scheduled: { label: "Colloquio", variant: "approved", icon: User },
  hired: { label: "Assunto", variant: "approved", icon: CheckCircle2 },
};

const getStatusLabel = (status: string) => {
  return statusMap[status]?.label || "Sconosciuto";
};

const getStatusVariant = (status: string) => {
  return statusMap[status]?.variant || "pending";
};

interface ProposalCardProps {
  proposal: any;
  onUpdateStatus?: (proposalId: string, newStatus: string) => void;
  onDelete?: (proposalId: string) => void;
  userType: 'company' | 'recruiter';
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onUpdateStatus,
  onDelete,
  userType
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const StatusIcon = statusMap[proposal.status]?.icon || Clock4;

  return (
    <Card className="group border-l-4 border-l-electric-teal bg-gradient-to-r from-electric-teal/[0.03] via-primary/[0.02] to-transparent hover:shadow-lg hover:border-l-primary transition-all duration-300 backdrop-blur-sm">
      <CardHeader className="pb-4">
        {/* Header minimale con status */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Candidato
          </div>
          <Badge 
            variant={getStatusVariant(proposal.status)}
            className="flex items-center gap-1.5 shadow-sm"
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {getStatusLabel(proposal.status)}
          </Badge>
        </div>

        {/* Hero candidato pulito */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-14 w-14 ring-2 ring-electric-teal/30 group-hover:ring-primary/40 transition-all duration-300">
              <AvatarFallback className="bg-gradient-to-br from-electric-teal/20 to-primary/20 text-navy text-lg font-semibold border border-electric-teal/20">
                {getInitials(proposal.candidate_name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-primary to-electric-teal rounded-full border-2 border-background shadow-sm"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold text-navy group-hover:text-primary transition-colors mb-1">
              {proposal.candidate_name}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{proposal.candidate_email}</span>
            </div>
            {proposal.job_offers?.title && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-confidence" />
                <span className="text-sm font-semibold bg-gradient-to-r from-confidence/10 to-primary/10 text-navy px-3 py-1.5 rounded-lg border border-confidence/20">
                  {proposal.job_offers.title}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Info cards grid pulito */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {proposal.years_experience && (
            <div className="bg-gradient-to-br from-warm-amber/5 to-warm-amber/10 rounded-xl p-4 space-y-2 border border-warm-amber/20 hover:border-warm-amber/30 transition-colors">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-warm-amber" />
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Esperienza</span>
              </div>
              <p className="text-lg font-semibold text-navy">{proposal.years_experience} anni</p>
            </div>
          )}
          
          {proposal.availability_weeks && (
            <div className="bg-gradient-to-br from-electric-teal/5 to-electric-teal/10 rounded-xl p-4 space-y-2 border border-electric-teal/20 hover:border-electric-teal/30 transition-colors">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-electric-teal" />
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Disponibilità</span>
              </div>
              <p className="text-lg font-semibold text-navy">{proposal.availability_weeks} settimane</p>
            </div>
          )}
          
          {proposal.expected_salary && (
            <div className="bg-gradient-to-br from-confidence/5 to-confidence/10 rounded-xl p-4 space-y-2 border border-confidence/20 hover:border-confidence/30 transition-colors">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-confidence" />
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Stipendio</span>
              </div>
              <p className="text-lg font-semibold text-navy">€{proposal.expected_salary.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Descrizione proposta */}
        {proposal.proposal_description && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Descrizione
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{proposal.proposal_description}</p>
          </div>
        )}

        {/* CV Viewer */}
        <CVViewer 
          proposal={proposal} 
          userType={userType}
        />

        {/* Recruiter info minimal */}
        {proposal.recruiter_name && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Recruiter:</span>
                <span className="font-medium">{proposal.recruiter_name}</span>
              </div>
              {proposal.recruiter_fee_percentage && (
                <span className="text-muted-foreground">
                  Fee: <span className="font-medium">{proposal.recruiter_fee_percentage}%</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions pulite */}
        <div className="space-y-4 pt-4 border-t">
          {userType === 'company' && onUpdateStatus && proposal.status === 'pending' && (
            <div className="flex gap-3">
              <Button
                size="sm"
                onClick={() => onUpdateStatus(proposal.id, 'approved')}
                className="flex-1"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approva
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(proposal.id, 'rejected')}
                className="flex-1"
              >
                Rifiuta
              </Button>
            </div>
          )}

          {userType === 'recruiter' && onDelete && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(proposal.id)}
                className="text-destructive border-destructive/20 hover:bg-destructive/10"
              >
                Elimina
              </Button>
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            {new Date(proposal.created_at).toLocaleDateString('it-IT')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
