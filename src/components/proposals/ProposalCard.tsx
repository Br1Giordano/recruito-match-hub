
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
    <Card className="w-full border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-6">
        {/* CANDIDATO Hero Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wide">
              Candidato
            </div>
            <Badge 
              variant={getStatusVariant(proposal.status)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
            >
              <StatusIcon className="h-4 w-4" />
              {getStatusLabel(proposal.status)}
            </Badge>
          </div>

          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border-2 border-gray-200">
              <AvatarFallback className="bg-gray-100 text-gray-700 text-xl font-semibold">
                {getInitials(proposal.candidate_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {proposal.candidate_name}
              </h1>
              <div className="flex items-center gap-2 mb-3 text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="font-medium">{proposal.candidate_email}</span>
              </div>
              {proposal.job_offers?.title && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span className="text-lg font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                    {proposal.job_offers.title}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Candidate Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {proposal.years_experience && (
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Esperienza</p>
                <p className="text-lg font-bold text-gray-900">{proposal.years_experience} anni</p>
              </div>
            </div>
          )}
          
          {proposal.availability_weeks && (
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Disponibilità</p>
                <p className="text-lg font-bold text-gray-900">{proposal.availability_weeks} settimane</p>
              </div>
            </div>
          )}
          
          {proposal.expected_salary && (
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Euro className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Stipendio</p>
                <p className="text-lg font-bold text-gray-900">€{proposal.expected_salary.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Descrizione della proposta */}
        {proposal.proposal_description && (
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Descrizione della Proposta
            </h4>
            <p className="text-gray-700 leading-relaxed">{proposal.proposal_description}</p>
          </div>
        )}

        {/* CV Viewer */}
        <CVViewer 
          proposal={proposal} 
          userType={userType}
        />

        {/* RECRUITER Section - Minimized */}
        {proposal.recruiter_name && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="bg-gray-50 rounded-md p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">
                  Recruiter
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-300 p-1 rounded">
                    <User className="h-3 w-3 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{proposal.recruiter_name}</p>
                    {proposal.recruiter_email && userType === 'company' && (
                      <p className="text-xs text-gray-500">{proposal.recruiter_email}</p>
                    )}
                  </div>
                </div>
                {proposal.recruiter_fee_percentage && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Fee</p>
                    <p className="text-sm font-semibold text-gray-700">{proposal.recruiter_fee_percentage}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions and Footer */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          {/* Azioni - solo per le aziende */}
          {userType === 'company' && onUpdateStatus && (
            <div className="flex gap-3">
              {proposal.status === 'pending' && (
                <>
                  <Button
                    variant="default"
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
                    <FileText className="h-4 w-4 mr-2" />
                    Rifiuta
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Azione eliminazione - solo per i recruiter */}
          {userType === 'recruiter' && onDelete && (
            <div className="flex justify-end">
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

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Inviata il {new Date(proposal.created_at).toLocaleDateString('it-IT')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
