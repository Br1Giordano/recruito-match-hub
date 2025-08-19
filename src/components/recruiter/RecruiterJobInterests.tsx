import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecruiterJobInterests } from "@/hooks/useRecruiterJobInterests";
import { MapPin, Building2, Euro, Clock, Trash2, Eye } from "lucide-react";
import JobOfferDetailsDialog from "../JobOfferDetailsDialog";
import ProposalFormModal from "../ProposalFormModal";
import CompanyProfileViewModal from "../company/CompanyProfileViewModal";
import { Database } from "@/integrations/supabase/types";

type JobOfferWithCompany = Database['public']['Tables']['job_offers']['Row'] & {
  company_registrations?: {
    nome_azienda: string;
    id: string;
  } | null;
};

export const RecruiterJobInterests = () => {
  const { interests, loading, removeInterest, refetch } = useRecruiterJobInterests();
  const [selectedJobOffer, setSelectedJobOffer] = useState<JobOfferWithCompany | null>(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [selectedCompanyEmail, setSelectedCompanyEmail] = useState<string | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);

  const convertToJobOfferWithCompany = (jobOffer: any): JobOfferWithCompany => {
    return {
      ...jobOffer,
      company_id: '',
      created_at: new Date().toISOString(),
      status: 'active',
      updated_at: new Date().toISOString(),
      user_id: '',
      benefits: jobOffer.benefits || '',
      description: jobOffer.description || '',
      requirements: jobOffer.requirements || '',
      employment_type: jobOffer.employment_type || 'full-time',
      location: jobOffer.location || '',
      company_registrations: jobOffer.company_name ? {
        nome_azienda: jobOffer.company_name,
        id: ''
      } : null
    };
  };

  const handleSendProposal = (jobOffer: any) => {
    const convertedJobOffer = convertToJobOfferWithCompany(jobOffer);
    setSelectedJobOffer(convertedJobOffer);
    setShowProposalForm(true);
  };

  const handleShowJobDetails = (jobOffer: any) => {
    const convertedJobOffer = convertToJobOfferWithCompany(jobOffer);
    setSelectedJobOffer(convertedJobOffer);
    setShowJobDetails(true);
  };

  const handleRemoveInterest = async (interestId: string) => {
    await removeInterest(interestId);
  };

  const handleProposalSuccess = () => {
    setShowProposalForm(false);
    setSelectedJobOffer(null);
    refetch(); // Ricarica le offerte di interesse
  };

  const handleCompanyClick = (companyEmail: string) => {
    setSelectedCompanyEmail(companyEmail);
    setShowCompanyProfile(true);
  };

  const getEmploymentTypeText = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'Tempo pieno';
      case 'part-time':
        return 'Tempo parziale';
      case 'contract':
        return 'Contratto';
      case 'freelance':
        return 'Freelance';
      case 'internship':
        return 'Stage';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Le Mie Offerte di Interesse</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (interests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mb-6 mx-auto">
          <Building2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nessuna offerta di interesse</h3>
        <p className="text-muted-foreground mb-4">
          Non hai ancora preso in carico nessuna offerta di lavoro.
        </p>
        <p className="text-sm text-muted-foreground">
          Vai alla sezione "Offerte Aperte" per iniziare a prendere in carico le offerte che ti interessano.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Le Mie Offerte di Interesse</h2>
        <Badge variant="secondary" className="text-sm">
          {interests.length} offert{interests.length === 1 ? 'a' : 'e'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {interests.map((interest) => {
          const jobOffer = interest.job_offers;
          
          if (!jobOffer) {
            return (
              <Card key={interest.id} className="border-dashed border-muted-foreground/50">
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Offerta non trovata o non più disponibile</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveInterest(interest.id)}
                    className="mt-2"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Rimuovi
                  </Button>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card key={interest.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{jobOffer.title}</CardTitle>
                    {jobOffer.company_name && (
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Building2 className="h-4 w-4" />
                        <button
                          onClick={() => handleCompanyClick(jobOffer.contact_email)}
                          className="hover:text-primary hover:underline transition-colors"
                        >
                          {jobOffer.company_name}
                        </button>
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getEmploymentTypeText(jobOffer.employment_type || 'full-time')}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {jobOffer.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{jobOffer.location}</span>
                    </div>
                  )}
                  {(jobOffer.salary_min || jobOffer.salary_max) && (
                    <div className="flex items-center gap-1">
                      <Euro className="h-4 w-4" />
                      <span>
                        {jobOffer.salary_min && jobOffer.salary_max
                          ? `€${jobOffer.salary_min.toLocaleString()} - €${jobOffer.salary_max.toLocaleString()}`
                          : jobOffer.salary_min
                          ? `Da €${jobOffer.salary_min.toLocaleString()}`
                          : `Fino a €${jobOffer.salary_max?.toLocaleString()}`}
                      </span>
                    </div>
                  )}
                </div>

                {jobOffer.description && (
                  <div>
                    <h4 className="font-medium mb-2">Descrizione</h4>
                    <p className="text-sm text-muted-foreground">
                      {jobOffer.description.length > 200
                        ? `${jobOffer.description.substring(0, 200)}...`
                        : jobOffer.description}
                    </p>
                  </div>
                )}

                {interest.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Le mie note</h4>
                    <p className="text-sm text-muted-foreground italic">
                      {interest.notes}
                    </p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground border-t pt-2">
                  Presa in carico il {new Date(interest.created_at).toLocaleDateString('it-IT')} 
                  alle {new Date(interest.created_at).toLocaleTimeString('it-IT')}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowJobDetails(jobOffer)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Dettagli
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveInterest(interest.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Rimuovi Interesse
                    </Button>
                    <Button
                      onClick={() => handleSendProposal(jobOffer)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Invia Candidato
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal per visualizzare i dettagli dell'offerta */}
      {showJobDetails && selectedJobOffer && (
        <JobOfferDetailsDialog
          isOpen={showJobDetails}
          onClose={() => {
            setShowJobDetails(false);
            setSelectedJobOffer(null);
          }}
          jobOffer={selectedJobOffer}
          canSendProposal={false}
        />
      )}

      {/* Modal per inviare la proposta */}
      {showProposalForm && selectedJobOffer && (
        <ProposalFormModal
          isOpen={showProposalForm}
          onClose={() => {
            setShowProposalForm(false);
            setSelectedJobOffer(null);
          }}
          onSuccess={handleProposalSuccess}
          jobOffer={selectedJobOffer}
        />
      )}

      {/* Modal per visualizzare il profilo aziendale */}
      <CompanyProfileViewModal
        open={showCompanyProfile}
        onOpenChange={setShowCompanyProfile}
        companyEmail={selectedCompanyEmail || undefined}
      />
    </div>
  );
};
