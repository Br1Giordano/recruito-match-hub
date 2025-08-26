import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  X,
  Mail,
  Phone,
  Linkedin,
  Calendar,
  Euro,
  Briefcase,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Building2
} from "lucide-react";
import { useRecruiterProfileByEmail } from "@/hooks/useRecruiterProfileByEmail";
import { useRecruiterRating } from "@/hooks/useRecruiterRating";
import RecruiterAvatar from "../recruiter/RecruiterAvatar";
import { StarRating } from "@/components/ui/star-rating";
import { useEffect } from "react";

interface ProposalDetailsDrawerProps {
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
  isOpen: boolean;
  onClose: () => void;
}

export default function ProposalDetailsDrawer({ proposal, isOpen, onClose }: ProposalDetailsDrawerProps) {
  const { profile: recruiterProfile, fetchProfileByEmail, loading: loadingRecruiter } = useRecruiterProfileByEmail();
  const { rating, fetchRatingByEmail } = useRecruiterRating();

  useEffect(() => {
    if (proposal.recruiter_email && isOpen) {
      fetchProfileByEmail(proposal.recruiter_email);
      fetchRatingByEmail(proposal.recruiter_email);
    }
  }, [proposal.recruiter_email, isOpen, fetchProfileByEmail, fetchRatingByEmail]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusMap: { [key: string]: { label: string; color: string; bgColor: string; icon: any } } = {
    pending: { label: 'In Attesa', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Clock },
    under_review: { label: 'In Revisione', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Clock },
    approved: { label: 'Approvata', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle2 },
    rejected: { label: 'Rifiutata', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
    hired: { label: 'Assunto', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle2 },
  };

  const currentStatus = statusMap[proposal.status] || { 
    label: proposal.status, 
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: Clock 
  };

  const StatusIcon = currentStatus.icon;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl">Dettagli Candidatura</DrawerTitle>
              <DrawerDescription>
                Informazioni complete sul candidato e la proposta
              </DrawerDescription>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${currentStatus.bgColor} ${currentStatus.color}`}>
              <StatusIcon className="h-4 w-4" />
              {currentStatus.label}
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Candidato Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {getInitials(proposal.candidate_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-navy mb-2">
                {proposal.candidate_name}
              </h2>
              {proposal.job_offers?.title && (
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span className="text-lg font-medium text-primary">
                    {proposal.job_offers.title}
                  </span>
                  {proposal.job_offers.company_name && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{proposal.job_offers.company_name}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Informazioni Principali */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proposal.years_experience && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Esperienza</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{proposal.years_experience} anni</p>
              </div>
            )}
            
            {proposal.availability_weeks && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Disponibilità</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{proposal.availability_weeks} settimane</p>
              </div>
            )}
            
            {proposal.expected_salary && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Stipendio</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">€{proposal.expected_salary.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Contatti */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-navy">Informazioni di Contatto</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="font-medium">Email:</span>
                <a 
                  href={`mailto:${proposal.candidate_email}`}
                  className="text-primary hover:text-primary/80 underline"
                >
                  {proposal.candidate_email}
                </a>
              </div>
              
              {proposal.candidate_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-medium">Telefono:</span>
                  <a 
                    href={`tel:${proposal.candidate_phone}`}
                    className="text-primary hover:text-primary/80 underline"
                  >
                    {proposal.candidate_phone}
                  </a>
                </div>
              )}
              
              {proposal.candidate_linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-primary" />
                  <span className="font-medium">LinkedIn:</span>
                  <a 
                    href={proposal.candidate_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    Profilo LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Descrizione Completa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-navy flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Descrizione Completa
            </h3>
            <div className="bg-white border rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {proposal.proposal_description}
              </p>
            </div>
          </div>

          {/* Informazioni Recruiter */}
          {proposal.recruiter_name && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy">Recruiter</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RecruiterAvatar 
                      avatarUrl={recruiterProfile?.avatar_url}
                      name={`${recruiterProfile?.nome || ''} ${recruiterProfile?.cognome || ''}`}
                      size="md"
                    />
                    <div>
                      <p className="font-medium text-navy">
                        {recruiterProfile ? `${recruiterProfile.nome} ${recruiterProfile.cognome}` : proposal.recruiter_name}
                      </p>
                      {!loadingRecruiter && rating && rating.totalReviews > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <StarRating rating={rating.averageRating} size={12} />
                          <span className="text-sm text-muted-foreground">({rating.totalReviews} recensioni)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {proposal.recruiter_fee_percentage && (
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">Fee Recruiter</span>
                      <p className="font-bold text-primary">{proposal.recruiter_fee_percentage}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CV Link */}
          {proposal.candidate_cv_url && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy">Curriculum Vitae</h3>
              <a 
                href={proposal.candidate_cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Visualizza CV
              </a>
            </div>
          )}

          {/* Data Creazione */}
          <div className="pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Candidatura inviata il {new Date(proposal.created_at).toLocaleDateString('it-IT', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              asChild
            >
              <a href={`mailto:${proposal.candidate_email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Contatta Candidato
              </a>
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">
                Chiudi
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}