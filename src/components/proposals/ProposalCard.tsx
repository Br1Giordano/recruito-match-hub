
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CVViewer from '@/components/cv/CVViewer';
import {
  CheckCircle2,
  Clock4,
  FileText,
  LucideIcon,
  Mail,
  User,
} from "lucide-react";

const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "outline"; icon: LucideIcon } } = {
  pending: { label: "In Attesa", variant: "outline", icon: Clock4 },
  approved: { label: "Approvata", variant: "default", icon: CheckCircle2 },
  rejected: { label: "Rifiutata", variant: "outline", icon: FileText },
  under_review: { label: "In Revisione", variant: "secondary", icon: Clock4 },
  contacted: { label: "Contattato", variant: "secondary", icon: Mail },
  interview_scheduled: { label: "Colloquio", variant: "secondary", icon: User },
  hired: { label: "Assunto", variant: "default", icon: CheckCircle2 },
};

const getStatusLabel = (status: string) => {
  return statusMap[status]?.label || "Sconosciuto";
};

const getStatusVariant = (status: string) => {
  return statusMap[status]?.variant || "outline";
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{proposal.candidate_name}</h3>
            <p className="text-sm text-gray-600">{proposal.candidate_email}</p>
            {proposal.job_offers?.title && (
              <p className="text-sm font-medium text-blue-600 mt-1">
                Posizione: {proposal.job_offers.title}
              </p>
            )}
          </div>
          <Badge variant={getStatusVariant(proposal.status)}>
            {getStatusLabel(proposal.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* CV Viewer con controllo degli accessi */}
        <CVViewer 
          proposal={proposal} 
          userType={userType}
        />

        {/* Descrizione della proposta */}
        {proposal.proposal_description && (
          <div>
            <h4 className="font-medium mb-2">Descrizione della Proposta</h4>
            <p className="text-sm text-gray-700">{proposal.proposal_description}</p>
          </div>
        )}

        {/* Dettagli del candidato - visibili solo secondo il livello di accesso */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {proposal.years_experience && (
            <div>
              <span className="font-medium">Esperienza:</span>
              <span className="ml-1">{proposal.years_experience} anni</span>
            </div>
          )}
          
          {proposal.availability_weeks && (
            <div>
              <span className="font-medium">Disponibilità:</span>
              <span className="ml-1">{proposal.availability_weeks} settimane</span>
            </div>
          )}
          
          {proposal.expected_salary && (
            <div>
              <span className="font-medium">Stipendio Desiderato:</span>
              <span className="ml-1">€{proposal.expected_salary.toLocaleString()}</span>
            </div>
          )}
          
          {proposal.recruiter_fee_percentage && (
            <div>
              <span className="font-medium">Commissione:</span>
              <span className="ml-1">{proposal.recruiter_fee_percentage}%</span>
            </div>
          )}
        </div>

        {/* Informazioni del recruiter */}
        {proposal.recruiter_name && (
          <div className="pt-2 border-t">
            <p className="text-sm">
              <span className="font-medium">Recruiter:</span> {proposal.recruiter_name}
            </p>
            {proposal.recruiter_email && userType === 'company' && (
              <p className="text-sm text-gray-600">{proposal.recruiter_email}</p>
            )}
          </div>
        )}

        {/* Azioni - solo per le aziende */}
        {userType === 'company' && onUpdateStatus && (
          <div className="flex gap-2 pt-2">
            {proposal.status === 'pending' && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onUpdateStatus(proposal.id, 'approved')}
                >
                  Approva
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateStatus(proposal.id, 'rejected')}
                >
                  Rifiuta
                </Button>
              </>
            )}
          </div>
        )}

        {/* Azione eliminazione - solo per i recruiter */}
        {userType === 'recruiter' && onDelete && (
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(proposal.id)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Elimina Proposta
            </Button>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Inviata il {new Date(proposal.created_at).toLocaleDateString('it-IT')}
        </p>
      </CardContent>
    </Card>
  );
};
