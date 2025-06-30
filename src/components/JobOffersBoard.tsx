import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Search, MapPin, Euro, Clock, Building2, Send, Briefcase, Trash2 } from "lucide-react";
import ProposalFormModal from "./ProposalFormModal";
import { Database } from "@/integrations/supabase/types";

type JobOfferWithCompany = Database['public']['Tables']['job_offers']['Row'] & {
  company_registrations?: {
    nome_azienda: string;
    id: string;
  } | null;
};

export default function JobOffersBoard() {
  const [jobOffers, setJobOffers] = useState<JobOfferWithCompany[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<JobOfferWithCompany[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [employmentFilter, setEmploymentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<JobOfferWithCompany | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const { isAdmin } = useAdminCheck();

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
      setFilteredOffers(data || []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobOffers();
  }, []);

  useEffect(() => {
    let filtered = jobOffers;

    if (searchTerm) {
      filtered = filtered.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getCompanyName(offer).toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((offer) => 
        offer.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (employmentFilter !== "all") {
      filtered = filtered.filter((offer) => offer.employment_type === employmentFilter);
    }

    setFilteredOffers(filtered);
  }, [searchTerm, locationFilter, employmentFilter, jobOffers]);

  const getCompanyName = (offer: JobOfferWithCompany): string => {
    // Usa company_name se disponibile, altrimenti nome_azienda da company_registrations
    return offer.company_name || offer.company_registrations?.nome_azienda || "Azienda non specificata";
  };

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

  // Get unique locations for filter
  const uniqueLocations = [...new Set(jobOffers.map(offer => offer.location).filter(Boolean))];

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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca per titolo, azienda o descrizione..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Filtra per sede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le sedi</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location!}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={employmentFilter} onValueChange={setEmploymentFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Tipo contratto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i tipi</SelectItem>
                <SelectItem value="full-time">Tempo Pieno</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contratto</SelectItem>
                <SelectItem value="internship">Stage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

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
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-5 w-5" />
                      {offer.title}
                      {isAdmin && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Admin
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {getCompanyName(offer)}
                      </span>
                      {isAdmin && offer.contact_email && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {offer.contact_email}
                        </span>
                      )}
                      {offer.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {offer.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getEmploymentTypeText(offer.employment_type)}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
                      <Euro className="h-4 w-4 text-muted-foreground" />
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
                        onClick={() => handleSendProposal(offer)}
                        disabled={!userProfile || userProfile.user_type !== 'recruiter'}
                        className="bg-recruito-blue hover:bg-recruito-blue/90"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Invia Candidato
                      </Button>
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
    </div>
  );
}
