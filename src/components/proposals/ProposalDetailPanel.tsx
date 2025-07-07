
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  Linkedin, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  FileText,
  Star,
  Target
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

interface ProposalDetailPanelProps {
  proposal: any;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onClose: () => void;
}

export default function ProposalDetailPanel({ 
  proposal, 
  onApprove, 
  onReject, 
  onClose 
}: ProposalDetailPanelProps) {
  if (!proposal) {
    return (
      <div className="w-96 border-l bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-500">Seleziona una proposta per vedere i dettagli</p>
      </div>
    );
  }

  const createdAt = formatDistanceToNow(new Date(proposal.created_at), { 
    addSuffix: true, 
    locale: it 
  });

  return (
    <div className="w-96 border-l bg-white overflow-y-auto">
      {/* Header con azioni */}
      <div className="sticky top-0 bg-white border-b p-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {proposal.candidate_name}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => onApprove(proposal.id)}
            disabled={proposal.status === 'accepted'}
          >
            Approva Candidato
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => onReject(proposal.id)}
            disabled={proposal.status === 'rejected'}
          >
            Rifiuta
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Candidato */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informazioni Candidato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{proposal.candidate_email}</span>
            </div>
            
            {proposal.candidate_phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{proposal.candidate_phone}</span>
              </div>
            )}
            
            {proposal.candidate_linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-gray-400" />
                <a 
                  href={proposal.candidate_linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Profilo LinkedIn
                </a>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{proposal.years_experience || 0} anni di esperienza</span>
            </div>

            {proposal.availability_weeks && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm">Disponibile in {proposal.availability_weeks} settimane</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aspettative Economiche */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Aspettative Economiche</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {proposal.current_salary && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Salario attuale:</span>
                <span className="text-sm font-medium">€{proposal.current_salary.toLocaleString()}</span>
              </div>
            )}
            
            {proposal.expected_salary && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Salario desiderato:</span>
                <span className="text-sm font-medium">€{proposal.expected_salary.toLocaleString()}</span>
              </div>
            )}

            {proposal.recruiter_fee_percentage && proposal.expected_salary && (
              <>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fee recruiter ({proposal.recruiter_fee_percentage}%):</span>
                  <span className="text-sm font-medium text-green-600">
                    €{Math.round((proposal.expected_salary * proposal.recruiter_fee_percentage) / 100).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Descrizione Proposta */}
        {proposal.proposal_description && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Descrizione del Candidato</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {proposal.proposal_description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Recruiter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recruiter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{proposal.recruiter_name}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span className="text-sm">4.8</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{proposal.recruiter_email}</span>
            </div>
            
            {proposal.recruiter_phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{proposal.recruiter_phone}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Posizioni chiuse:</span>
              <span className="text-green-600 font-medium">85%</span>
            </div>
          </CardContent>
        </Card>

        {/* CV Viewer */}
        {proposal.candidate_cv_url && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Curriculum Vitae
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">CV del candidato</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(proposal.candidate_cv_url, '_blank')}
                >
                  Apri CV
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meta info */}
        <div className="text-xs text-gray-500 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Ricevuta {createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
