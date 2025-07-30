import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Search, MapPin, Clock, Briefcase, Trash2, Shield, Eye, Edit } from "lucide-react";
import JobOfferDetailsDialog from "../JobOfferDetailsDialog";
import { Database } from "@/integrations/supabase/types";

type AdminJobOffer = Database['public']['Tables']['job_offers']['Row'] & {
  company_registrations?: {
    nome_azienda: string;
    id: string;
  } | null;
};

export default function AdminJobOffersManagement() {
  const [jobOffers, setJobOffers] = useState<AdminJobOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<AdminJobOffer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOfferForDetails, setSelectedOfferForDetails] = useState<AdminJobOffer | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();

  const fetchAllJobOffers = async () => {
    setIsLoading(true);

    // Query per ottenere tutte le offerte (admin può vedere tutto)
    const { data, error } = await supabase
      .from("job_offers")
      .select(`
        *,
        company_registrations(nome_azienda, id)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching job offers:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le offerte di lavoro",
        variant: "destructive",
      });
    } else {
      console.log("All job offers fetched for admin:", data);
      setJobOffers(data || []);
      setFilteredOffers(data || []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllJobOffers();
  }, []);

  useEffect(() => {
    let filtered = jobOffers;

    if (searchTerm) {
      filtered = filtered.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getCompanyName(offer).toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((offer) => offer.status === statusFilter);
    }

    setFilteredOffers(filtered);
  }, [searchTerm, statusFilter, jobOffers]);

  const getCompanyName = (offer: AdminJobOffer): string => {
    return offer.company_name || offer.company_registrations?.nome_azienda || "Azienda non specificata";
  };

  const handleShowDetails = (offer: AdminJobOffer) => {
    setSelectedOfferForDetails(offer);
    setShowDetailsDialog(true);
  };

  const handleDeleteOffer = async (offerId: string, offerTitle: string) => {
    const confirmed = window.confirm(
      `Sei sicuro di voler eliminare l'offerta "${offerTitle}"? Questa azione non può essere annullata e verranno rimosse anche tutte le proposte associate.`
    );
    
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
        fetchAllJobOffers(); // Refresh the list
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

  const handleUpdateStatus = async (offerId: string, newStatus: string, offerTitle: string) => {
    try {
      const { error } = await supabase
        .from('job_offers')
        .update({ status: newStatus })
        .eq('id', offerId);

      if (error) {
        console.error('Error updating job offer status:', error);
        toast({
          title: "Errore",
          description: "Impossibile aggiornare lo stato dell'offerta",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Successo",
          description: `Stato dell'offerta "${offerTitle}" aggiornato con successo`,
        });
        fetchAllJobOffers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating job offer status:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'aggiornamento dello stato",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Attiva";
      case "paused":
        return "In Pausa";
      case "closed":
        return "Chiusa";
      default:
        return status;
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
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-8 w-8 text-red-600" />
          Gestione Offerte di Lavoro (Admin)
        </h1>
        <p className="text-muted-foreground">
          Visualizza, modifica ed elimina tutte le offerte di lavoro pubblicate dalle aziende
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca per titolo, azienda, email o descrizione..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtra per stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="active">Attive</SelectItem>
                <SelectItem value="paused">In Pausa</SelectItem>
                <SelectItem value="closed">Chiuse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{jobOffers.length}</div>
            <p className="text-xs text-muted-foreground">Totale Offerte</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {jobOffers.filter(offer => offer.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Offerte Attive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {jobOffers.filter(offer => offer.status === 'paused').length}
            </div>
            <p className="text-xs text-muted-foreground">In Pausa</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {jobOffers.filter(offer => offer.status === 'closed').length}
            </div>
            <p className="text-xs text-muted-foreground">Chiuse</p>
          </CardContent>
        </Card>
      </div>

      {/* Job Offers List */}
      <div className="grid gap-6">
        {filteredOffers.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nessuna offerta trovata</h3>
                <p className="text-muted-foreground">
                  {jobOffers.length === 0
                    ? "Non ci sono offerte di lavoro nel sistema"
                    : "Nessuna offerta corrisponde ai filtri selezionati"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-md transition-shadow border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-5 w-5" />
                      {offer.title}
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin View
                      </Badge>
                    </CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{getCompanyName(offer)}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {offer.contact_email}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
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
                      </div>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(offer.status || 'active')}>
                    {getStatusText(offer.status || 'active')}
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

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Pubblicata il {new Date(offer.created_at).toLocaleDateString('it-IT')}
                      {offer.updated_at !== offer.created_at && (
                        <span> • Aggiornata il {new Date(offer.updated_at).toLocaleDateString('it-IT')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowDetails(offer)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Dettagli
                      </Button>
                      <Select
                        value={offer.status || 'active'}
                        onValueChange={(newStatus) => handleUpdateStatus(offer.id, newStatus, offer.title)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Attiva</SelectItem>
                          <SelectItem value="paused">In Pausa</SelectItem>
                          <SelectItem value="closed">Chiusa</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteOffer(offer.id, offer.title)}
                        className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Elimina
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Details Dialog */}
      {showDetailsDialog && selectedOfferForDetails && (
        <JobOfferDetailsDialog
          isOpen={showDetailsDialog}
          onClose={() => {
            setShowDetailsDialog(false);
            setSelectedOfferForDetails(null);
          }}
          jobOffer={selectedOfferForDetails}
          onSendProposal={() => {}} // Admin non invia proposte
          canSendProposal={false}
        />
      )}
    </div>
  );
}