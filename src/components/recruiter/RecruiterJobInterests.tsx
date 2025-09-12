import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecruiterJobInterests } from "@/hooks/useRecruiterJobInterests";
import { Building2 } from "lucide-react";
import JobOfferDetailsDialog from "../JobOfferDetailsDialog";
import ProposalFormModal from "../ProposalFormModal";
import CompanyProfileViewModal from "../company/CompanyProfileViewModal";
import { CompactJobInterestCard } from "./CompactJobInterestCard";
import { JobInterestDetailsDrawer } from "./JobInterestDetailsDrawer";
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
  const [selectedInterest, setSelectedInterest] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    
    // Trigger a custom event to refresh recruiter proposals
    window.dispatchEvent(new CustomEvent('proposalCreated'));
    
    refetch(); // Ricarica le offerte di interesse
  };

  const handleCompanyClick = (companyEmail: string) => {
    setSelectedCompanyEmail(companyEmail);
    setShowCompanyProfile(true);
  };

  const handleCardClick = (interest: any) => {
    setSelectedInterest(interest);
    setIsDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Le Mie Offerte di Interesse</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ))}
        </div>
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

      <div className="grid md:grid-cols-2 gap-4">
        {interests.map((interest) => (
          <div key={interest.id} onClick={() => handleCardClick(interest)} className="cursor-pointer">
            <CompactJobInterestCard
              interest={interest}
              onRemoveInterest={removeInterest}
              onViewDetails={handleShowJobDetails}
              onSendProposal={handleSendProposal}
              onCompanyClick={handleCompanyClick}
            />
          </div>
        ))}
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

      {/* Drawer per i dettagli dell'interesse */}
      <JobInterestDetailsDrawer
        interest={selectedInterest}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedInterest(null);
        }}
        onViewDetails={handleShowJobDetails}
        onSendProposal={handleSendProposal}
        onRemoveInterest={removeInterest}
        onCompanyClick={handleCompanyClick}
      />
    </div>
  );
};
