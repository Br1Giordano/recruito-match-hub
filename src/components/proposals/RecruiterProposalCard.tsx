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

  const statusMap: { [key: string]: { label: string; color: string; icon: any } } = {
    pending: { label: 'In Attesa', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
    under_review: { label: 'In Revisione', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
    approved: { label: 'Approvata', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
    rejected: { label: 'Rifiutata', color: 'bg-red-100 text-red-800 border-red-200', icon: FileText },
    hired: { label: 'Assunto', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: CheckCircle2 },
  };

  const currentStatus = statusMap[proposal.status] || { 
    label: proposal.status, 
    color: 'bg-gray-100 text-gray-800 border-gray-200', 
    icon: Clock 
  };

  const StatusIcon = currentStatus.icon;

  return (
    <Card className="w-full border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-4">
        {/* CANDIDATO Label */}
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            👤 CANDIDATO
          </div>
          <Badge 
            className={`px-3 py-2 text-sm font-medium border ${currentStatus.color} flex items-center gap-2 ml-auto`}
          >
            <StatusIcon className="h-4 w-4" />
            {currentStatus.label}
          </Badge>
        </div>

        {/* Candidate Hero Section */}
        <div className="flex items-start gap-4 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
          <Avatar className="h-24 w-24 ring-3 ring-blue-200">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
              {getInitials(proposal.candidate_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
              {proposal.candidate_name}
            </h2>
            {proposal.job_offers?.title && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-semibold text-blue-700 bg-blue-100 px-4 py-2 rounded-lg">
                  {proposal.job_offers.title}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Candidate Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Mail className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Contatto</p>
              <p className="text-sm font-medium text-gray-900 truncate">{proposal.candidate_email}</p>
            </div>
          </div>
        </div>

        {/* Candidate Description */}
        {proposal.proposal_description && (
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Descrizione Candidato
            </h4>
            <p className="text-gray-700 leading-relaxed">{proposal.proposal_description}</p>
          </div>
        )}

        {/* Additional Contact Information */}
        {(proposal.candidate_phone || proposal.candidate_linkedin) && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-600" />
              Contatti Aggiuntivi
            </h4>
            <div className="flex flex-wrap gap-3">
              {proposal.candidate_phone && (
                <a 
                  href={`tel:${proposal.candidate_phone}`} 
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 text-green-600" />
                  {proposal.candidate_phone}
                </a>
              )}
              {proposal.candidate_linkedin && (
                <a 
                  href={proposal.candidate_linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-sm"
                >
                  <Linkedin className="h-4 w-4 text-blue-600" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        )}

        {/* RECRUITER Section */}
        {proposal.recruiter_name && (
          <div className="border-t-2 border-gray-200 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                🎯 RECRUITER
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
              <RecruiterAvatar 
                avatarUrl={recruiterProfile?.avatar_url}
                name={`${recruiterProfile?.nome || ''} ${recruiterProfile?.cognome || ''}`}
                size="sm"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {recruiterProfile ? `${recruiterProfile.nome} ${recruiterProfile.cognome}` : proposal.recruiter_name}
                </p>
                {!loadingRecruiter && rating && rating.totalReviews > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={rating.averageRating} size={12} />
                    <span className="text-xs text-gray-600">({rating.totalReviews} recensioni)</span>
                  </div>
                )}
              </div>
              {proposal.recruiter_fee_percentage && (
                <div className="text-right bg-white px-3 py-2 rounded-lg border border-orange-200">
                  <p className="text-xs text-orange-600 font-medium">Commissione</p>
                  <p className="text-lg font-bold text-orange-700">{proposal.recruiter_fee_percentage}%</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <ProposalDetailsDialog proposal={proposal} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Ricevuta il {new Date(proposal.created_at).toLocaleDateString('it-IT')} alle {new Date(proposal.created_at).toLocaleTimeString('it-IT')}</span>
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
