import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { MapPin, Euro, Clock, Building2, Send, Briefcase, Trash2, Shield, Eye, Heart } from "lucide-react";
import ProposalFormModal from "./ProposalFormModal";
import JobOfferDetailsDialog from "./JobOfferDetailsDialog";
import CompanyProfileViewModal from "./company/CompanyProfileViewModal";
import { useRecruiterJobInterests } from "@/hooks/useRecruiterJobInterests";
import { useJobOfferInterestCounts } from "@/hooks/useJobOfferInterestCounts";
import { Database } from "@/integrations/supabase/types";
import AdvancedJobFilters from "./filters/AdvancedJobFilters";

type JobOfferWithCompany = Database['public']['Tables']['job_offers']['Row'] & {
  company_registrations?: {
    nome_azienda: string;
    id: string;
  } | null;
};

// Interest Button Component
interface InterestButtonProps {
  offer: JobOfferWithCompany;
  userEmail: string;
  interests: any[];
  onTakeInterest: (offer: JobOfferWithCompany) => void;
}

const InterestButton = ({ offer, userEmail, interests, onTakeInterest }: InterestButtonProps) => {
  const isAlreadyInterested = interests.some(interest => interest.job_offer_id === offer.id);
  
  if (isAlreadyInterested) {
    return (
      <Button 
        size="sm" 
        variant="outline"
        disabled
        className="text-green-600 border-green-600"
      >
        Già in Carico
      </Button>
    );
  }
  
  return (
    <Button 
      size="sm" 
      onClick={() => onTakeInterest(offer)}
    >
      Prendi in Carico
    </Button>
  );
};

export default function JobOffersBoard() {
  const [jobOffers, setJobOffers] = useState<JobOfferWithCompany[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [employmentFilter, setEmploymentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<JobOfferWithCompany | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedOfferForDetails, setSelectedOfferForDetails] = useState<JobOfferWithCompany | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [selectedCompanyEmail, setSelectedCompanyEmail] = useState<string | null>(null);
  const [selectedCompanyRegistrationId, setSelectedCompanyRegistrationId] = useState<string | null>(null);
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { addInterest, checkIfInterested, interests } = useRecruiterJobInterests();
  
  // Get job offer IDs for interest counting
  const jobOfferIds = jobOffers?.map(offer => offer.id) || [];
  const { getInterestCount } = useJobOfferInterestCounts(jobOfferIds);

  const fetchJobOffers = async () => {
    setIsLoading(true);

    // Query per ottenere tutte le offerte attive, sia con che senza company_registrations
    const { data, error } = await supabase
      .from("job_offers")
      .select(`
        *,
        company_registrations(nome_azienda, id)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching job offers:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le offerte di lavoro",
        variant: "destructive",
      });
    } else {
      console.log("Job offers fetched:", data);
      setJobOffers(data || []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobOffers();
  }, []);

  // Function to extract city name from location - simplified
  const extractCityName = useCallback((location: string | null): string => {
    if (!location) return "";
    
    // Simple extraction: get first word before parentheses, slashes, or commas
    return location
      .split('(')[0]        // Remove parentheses content
      .split('/')[0]        // Remove everything after /
      .split(',')[0]        // Remove everything after comma
      .trim()
      .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter
  }, []);

  const getCompanyName = useCallback((offer: JobOfferWithCompany): string => {
    // Usa company_name se disponibile, altrimenti nome_azienda da company_registrations
    return offer.company_name || offer.company_registrations?.nome_azienda || "Azienda non specificata";
  }, []);

  // Simplified filtering logic - REMOVED EXCLUSIVITY
  const filteredOffers = useMemo(() => {
    let filtered = jobOffers;

    // Simple search in title, company, description
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(offer =>
        offer.title?.toLowerCase().includes(searchLower) ||
        getCompanyName(offer).toLowerCase().includes(searchLower) ||
        offer.description?.toLowerCase().includes(searchLower) ||
        offer.location?.toLowerCase().includes(searchLower)
      );
    }

    // Simple location filter by city
    if (locationFilter !== "all") {
      filtered = filtered.filter(offer => {
        const cityName = extractCityName(offer.location);
        return cityName.toLowerCase() === locationFilter.toLowerCase();
      });
    }

    // Simple employment type filter - exact match
    if (employmentFilter !== "all") {
      filtered = filtered.filter(offer => offer.employment_type === employmentFilter);
    }

    return filtered;
  }, [searchTerm, locationFilter, employmentFilter, jobOffers, extractCityName, getCompanyName]);

  const handleSendProposal = (offer: JobOfferWithCompany) => {
    if (!userProfile || userProfile.user_type !== 'recruiter') {
      toast({
        title: "Errore",
        description: "Devi essere autenticato come recruiter per inviare proposte",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedOffer(offer);
    setShowProposalModal(true);
  };

  const handleProposalSuccess = () => {
    setShowProposalModal(false);
    setSelectedOffer(null);
    toast({
      title: "Successo",
      description: "Proposta inviata con successo!",
    });
  };

  const handleTakeInterest = async (offer: JobOfferWithCompany) => {
    if (!userProfile || userProfile.user_type !== 'recruiter') {
      toast({
        title: "Errore",
        description: "Devi essere autenticato come recruiter per prendere in carico un'offerta",
        variant: "destructive",
      });
      return;
    }

    const success = await addInterest(offer.id);
    if (success) {
      toast({
        title: "Offerta presa in carico",
        description: "L'offerta è stata aggiunta alle tue offerte di interesse. Ora puoi inviarle candidati dalla sezione dedicata.",
      });
    }
  };

  const handleShowDetails = (offer: JobOfferWithCompany) => {
    setSelectedOfferForDetails(offer);
    setShowDetailsDialog(true);
  };

  const handleShowCompanyProfile = (offer: JobOfferWithCompany) => {
    if (offer.contact_email) {
      setSelectedCompanyEmail(offer.contact_email);
      setSelectedCompanyRegistrationId(offer.company_registrations?.id || null);
      setShowCompanyProfile(true);
    }
  };

  const handleDeleteOffer = async (offerId: string, offerTitle: string) => {
    if (!isAdmin) {
      toast({
        title: "Errore",
        description: "Solo gli amministratori possono eliminare le offerte",
        variant: "destructive",
      });
      return;
    }

    const confirmed = window.confirm(`Sei sicuro di voler eliminare l'offerta "${offerTitle}"? Questa azione non può essere annullata.`);
    
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('job_offers')
        .delete()
        .eq('id', offerId);

      if (error) {
        console.error('Error deleting job offer:', error);
        toast({
          title: "Errore",
          description: "Impossibile eliminare l'offerta di lavoro",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Successo",
          description: "Offerta di lavoro eliminata con successo",
        });
        fetchJobOffers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting job offer:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione dell'offerta",
        variant: "destructive",
      });
    }
  };

  const getEmploymentTypeText = (type?: string) => {
    switch (type) {
      case "full-time":
        return "Tempo Pieno";
      case "part-time":
        return "Part-time";
      case "contract":
        return "Contratto";
      case "internship":
        return "Stage";
      default:
        return type || "Non specificato";
    }
  };

  // Get unique locations for filters - simplified
  const uniqueLocations = useMemo(() => {
    const cities = jobOffers
      .map(offer => extractCityName(offer.location))
      .filter(city => city && city.length > 0)
      .map(city => city.charAt(0).toUpperCase() + city.slice(1).toLowerCase());
    
    return [...new Set(cities)].sort();
  }, [jobOffers, extractCityName]);

  // Simple clear filters
  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setLocationFilter("all");
    setEmploymentFilter("all");
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Caricamento offerte...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Posizioni Aperte
          {isAdmin && <span className="text-lg font-normal text-blue-600 ml-2">(Admin)</span>}
        </h1>
        <p className="text-muted-foreground">
          {isAdmin 
            ? "Scopri le opportunità disponibili e gestisci tutte le offerte (modalità amministratore)"
            : "Scopri le opportunità disponibili e invia proposte per i tuoi candidati"
          }
        </p>
      </div>

      {/* Simplified Filters */}
      <AdvancedJobFilters
        searchTerm={searchTerm}
        locationFilter={locationFilter}
        employmentFilter={employmentFilter}
        uniqueLocations={uniqueLocations}
        onSearchChange={setSearchTerm}
        onLocationChange={setLocationFilter}
        onEmploymentChange={setEmploymentFilter}
        onClearFilters={handleClearFilters}
        totalOffers={jobOffers.length}
        filteredCount={filteredOffers.length}
      />

      {/* Job Offers Grid */}
      <div className="grid gap-6">
        {filteredOffers.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nessuna posizione trovata</h3>
                <p className="text-muted-foreground">
                  {jobOffers.length === 0
                    ? "Non ci sono posizioni aperte al momento"
                    : "Nessuna posizione corrisponde ai filtri selezionati"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-start gap-2 mb-2 flex-wrap">
                      <Briefcase className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span className="text-base md:text-lg leading-tight break-words">{offer.title}</span>
                      {isAdmin && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium flex-shrink-0">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="space-y-2">
                      {/* Company info on its own line */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleShowCompanyProfile(offer)}
                          className="flex items-center gap-1 text-primary hover:text-primary/80 hover:underline transition-colors cursor-pointer min-w-0"
                        >
                          <Building2 className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{getCompanyName(offer)}</span>
                        </button>
                        {isAdmin && offer.contact_email && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded truncate">
                            {offer.contact_email}
                          </span>
                        )}
                      </div>
                      
                      {/* Location and employment type on separate line */}
                      <div className="flex items-center gap-4 flex-wrap">
                        {offer.location && (
                          <span className="flex items-center gap-1 min-w-0">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm truncate max-w-[200px]">{offer.location}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{getEmploymentTypeText(offer.employment_type)}</span>
                        </span>
                        {getInterestCount(offer.id) > 0 && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex-shrink-0">
                            {getInterestCount(offer.id)} recruiter{getInterestCount(offer.id) !== 1 ? 's' : ''} interessati
                          </Badge>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex-shrink-0">
                    Attiva
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offer.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {offer.description}
                    </p>
                  )}

                  {(offer.salary_min || offer.salary_max) && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {offer.salary_min && offer.salary_max
                          ? `€${offer.salary_min.toLocaleString()} - €${offer.salary_max.toLocaleString()}`
                          : offer.salary_min
                          ? `Da €${offer.salary_min.toLocaleString()}`
                          : `Fino a €${offer.salary_max?.toLocaleString()}`}
                      </span>
                    </div>
                  )}

                  {offer.requirements && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Requisiti:</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {offer.requirements}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Pubblicata il {new Date(offer.created_at).toLocaleDateString('it-IT')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => handleShowDetails(offer)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Vedi Dettagli
                      </Button>
                      {!isAdmin && userProfile && userProfile.user_type === 'recruiter' && (
                        <InterestButton 
                          offer={offer}
                          userEmail=""
                          interests={interests}
                          onTakeInterest={handleTakeInterest}
                        />
                      )}
                      {!isAdmin && userProfile && userProfile.user_type === 'recruiter' && (
                        <Button 
                          onClick={() => handleSendProposal(offer)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Invia Candidato
                        </Button>
                      )}
                      {isAdmin && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteOffer(offer.id, offer.title)}
                          className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Elimina
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Company Profile Modal */}
      <CompanyProfileViewModal
        open={showCompanyProfile}
        onOpenChange={setShowCompanyProfile}
        companyEmail={selectedCompanyEmail || undefined}
        companyRegistrationId={selectedCompanyRegistrationId || undefined}
      />

      {/* Proposal Modal */}
      {showProposalModal && selectedOffer && (
        <ProposalFormModal
          isOpen={showProposalModal}
          onClose={() => {
            setShowProposalModal(false);
            setSelectedOffer(null);
          }}
          onSuccess={handleProposalSuccess}
          jobOffer={selectedOffer}
        />
      )}

      {/* Details Dialog */}
      {showDetailsDialog && selectedOfferForDetails && (
        <JobOfferDetailsDialog
          isOpen={showDetailsDialog}
          onClose={() => {
            setShowDetailsDialog(false);
            setSelectedOfferForDetails(null);
          }}
          jobOffer={selectedOfferForDetails}
          onSendProposal={handleSendProposal}
          canSendProposal={false}
        />
      )}
    </div>
  );
}
