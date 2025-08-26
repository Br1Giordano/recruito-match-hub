
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
    <Card className="group">
      <CardHeader className="pb-4">
        {/* Header minimale con status */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Candidato
          </div>
          <Badge 
            variant={getStatusVariant(proposal.status)}
            className="flex items-center gap-1.5"
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {getStatusLabel(proposal.status)}
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
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              {proposal.candidate_name}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{proposal.candidate_email}</span>
            </div>
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
        {/* Info cards grid pulito */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
