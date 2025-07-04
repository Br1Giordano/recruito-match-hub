
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Euro, Calendar, User, Building2, Phone, Linkedin, FileText, MapPin, Briefcase, UserCircle } from "lucide-react";
import ProposalDetailsDialog from "./ProposalDetailsDialog";
import RecruiterAvatar from "../recruiter/RecruiterAvatar";
import RecruiterProfileViewModal from "../recruiter/RecruiterProfileViewModal";
import { useRecruiterProfileByEmail } from "@/hooks/useRecruiterProfileByEmail";
import { useState } from "react";

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
  const [showRecruiterProfile, setShowRecruiterProfile] = useState(false);

  // Carica il profilo del recruiter quando il componente viene montato
  useEffect(() => {
    if (proposal.recruiter_email) {
      fetchProfileByEmail(proposal.recruiter_email);
    }
  }, [proposal.recruiter_email, fetchProfileByEmail]);

  const handleShowRecruiterProfile = async () => {
    if (proposal.recruiter_email) {
      console.log('Fetching recruiter profile for:', proposal.recruiter_email);
      const profile = await fetchProfileByEmail(proposal.recruiter_email);
      console.log('Fetched profile:', profile);
      setShowRecruiterProfile(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "In Attesa";
      case "under_review":
        return "In Revisione";
      case "approved":
        return "Approvata";
      case "rejected":
        return "Rifiutata";
      case "hired":
        return "Assunto";
      default:
        return status;
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle className="text-lg">{proposal.candidate_name}</CardTitle>
            </div>
            <Badge className={getStatusColor(proposal.status)}>
              {getStatusText(proposal.status)}
            </Badge>
          </div>
          {proposal.job_offers?.title && (
            <div className="text-sm text-muted-foreground">
              Proposto da {recruiterProfile ? `${recruiterProfile.nome} ${recruiterProfile.cognome}` : (proposal.recruiter_name || proposal.recruiter_email)} • {proposal.job_offers.title}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Profilo Recruiter - Aggiornato con dati completi */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-blue-900">Profilo Recruiter</h4>
              <Button
                onClick={handleShowRecruiterProfile}
                disabled={loadingRecruiter}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-100"
              >
                <UserCircle className="h-4 w-4 mr-2" />
                {loadingRecruiter ? "Caricamento..." : "Visualizza Profilo"}
              </Button>
            </div>
            
            <div className="flex items-start gap-3">
              <RecruiterAvatar
                avatarUrl={recruiterProfile?.avatar_url}
                name={recruiterProfile ? `${recruiterProfile.nome} ${recruiterProfile.cognome}` : (proposal.recruiter_name || 'Recruiter')}
                size="md"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {recruiterProfile ? `${recruiterProfile.nome} ${recruiterProfile.cognome}` : (proposal.recruiter_name || 'Recruiter')}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {proposal.recruiter_email}
                </div>
                
                {/* Informazioni aggiuntive del recruiter */}
                <div className="space-y-1">
                  {recruiterProfile?.azienda && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Building2 className="h-3 w-3" />
                      <span>{recruiterProfile.azienda}</span>
                    </div>
                  )}
                  
                  {recruiterProfile?.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{recruiterProfile.location}</span>
                    </div>
                  )}
                  
                  {recruiterProfile?.years_of_experience && (
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                      <Briefcase className="h-3 w-3" />
                      <span className="font-medium">{recruiterProfile.years_of_experience} anni di esperienza</span>
                    </div>
                  )}
                  
                  {recruiterProfile?.specializations && recruiterProfile.specializations.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">Specializzazioni:</div>
                      <div className="flex flex-wrap gap-1">
                        {recruiterProfile.specializations.slice(0, 3).map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                            {spec}
                          </Badge>
                        ))}
                        {recruiterProfile.specializations.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            +{recruiterProfile.specializations.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                  
                {/* Bio breve se presente */}
                {recruiterProfile?.bio && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="line-clamp-2">
                      {recruiterProfile.bio.length > 100 
                        ? `${recruiterProfile.bio.substring(0, 100)}...` 
                        : recruiterProfile.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Descrizione del candidato */}
          {proposal.proposal_description ? (
            <div>
              <h4 className="font-medium mb-2">Descrizione del candidato:</h4>
              <p className="text-sm text-muted-foreground">
                {proposal.proposal_description.length > 150
                  ? `${proposal.proposal_description.substring(0, 150)}...`
                  : proposal.proposal_description}
              </p>
            </div>
          ) : (
            <div>
              <h4 className="font-medium mb-2">Descrizione del candidato:</h4>
              <p className="text-sm text-muted-foreground">Nessuna descrizione fornita</p>
            </div>
          )}

          {/* Contatti Candidato */}
          <div>
            <h4 className="font-medium mb-2">Contatti Candidato:</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <a href={`mailto:${proposal.candidate_email}`} className="text-blue-600 hover:underline">
                  {proposal.candidate_email}
                </a>
              </div>
              {proposal.candidate_phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${proposal.candidate_phone}`} className="text-blue-600 hover:underline">
                    {proposal.candidate_phone}
                  </a>
                </div>
              )}
              {proposal.candidate_linkedin && (
                <div className="flex items-center gap-2 text-sm">
                  <Linkedin className="h-4 w-4" />
                  <a href={proposal.candidate_linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Visualizza CV
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Dettagli */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Fee recruiter: </span>
              <span>{proposal.recruiter_fee_percentage}%</span>
            </div>
            {proposal.years_experience && (
              <div>
                <span className="font-medium">Esperienza: </span>
                <span>{proposal.years_experience} anni</span>
              </div>
            )}
            {proposal.expected_salary && (
              <div className="flex items-center gap-1">
                <Euro className="h-4 w-4" />
                <span>€{proposal.expected_salary.toLocaleString()}</span>
              </div>
            )}
            {proposal.availability_weeks && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{proposal.availability_weeks} settimane</span>
              </div>
            )}
          </div>

          {/* Data di ricezione */}
          <div className="text-xs text-muted-foreground border-t pt-2">
            Ricevuta il {new Date(proposal.created_at).toLocaleDateString('it-IT')} alle {new Date(proposal.created_at).toLocaleTimeString('it-IT')}
          </div>

          {/* Pulsante Dettagli */}
          <div className="flex justify-end pt-2">
            <ProposalDetailsDialog proposal={proposal} />
          </div>
        </CardContent>
      </Card>

      {/* Modal Profilo Recruiter */}
      <RecruiterProfileViewModal
        open={showRecruiterProfile}
        onOpenChange={setShowRecruiterProfile}
        profile={recruiterProfile}
      />
    </>
  );
}
