
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
import { Search, Plus, Edit, MapPin, Euro, Clock, Briefcase, Trash2, Pause, Play } from "lucide-react";
import JobOfferForm from "./JobOfferForm";
import { Database } from "@/integrations/supabase/types";

type CompanyJobOffer = Database['public']['Tables']['job_offers']['Row'];

export default function CompanyOffersDashboard() {
  const [jobOffers, setJobOffers] = useState<CompanyJobOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<CompanyJobOffer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showNewOfferForm, setShowNewOfferForm] = useState(false);
  const { toast } = useToast();
  const { userProfile, user } = useAuth();
  const { isAdmin } = useAdminCheck();

  const fetchJobOffers = async () => {
    setIsLoading(true);

    // Controlla se l'utente è autenticato
    if (!user) {
      console.log('User not authenticated');
      setIsLoading(false);
      return;
    }

    console.log('Fetching job offers for user:', user.email);

    // Query aggiornata per cercare offerte sia tramite company_id che contact_email
    let query = supabase.from("job_offers").select("*");

    // Se l'utente è admin, mostra tutte le offerte
    if (isAdmin) {
      // Admin vede tutte le offerte
      query = query.order("created_at", { ascending: false });
    } else if (userProfile && userProfile.user_type === 'company') {
      query = query.or(`company_id.eq.${userProfile.registration_id},contact_email.eq.${user.email}`);
    } else {
      // Altrimenti cerca solo per email
      query = query.eq("contact_email", user.email);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching job offers:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le offerte di lavoro",
        variant: "destructive",
      });
    } else {
      console.log('Job offers fetched:', data);
      setJobOffers(data || []);
      setFilteredOffers(data || []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchJobOffers();
    }
  }, [userProfile, user, isAdmin]);

  useEffect(() => {
    let filtered = jobOffers;

    if (searchTerm) {
      filtered = filtered.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((offer) => offer.status === statusFilter);
    }

    setFilteredOffers(filtered);
  }, [searchTerm, statusFilter, jobOffers]);

  const handleNewOfferSuccess = () => {
    setShowNewOfferForm(false);
    fetchJobOffers(); // Refresh the list
  };

  const handleDeactivateOffer = async (offerId: string, offerTitle: string) => {
    try {
      const { error } = await supabase
        .from('job_offers')
        .update({ status: 'paused' })
        .eq('id', offerId);

      if (error) {
        console.error('Error deactivating job offer:', error);
        toast({
          title: "Errore",
          description: "Impossibile disattivare l'offerta di lavoro",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Successo",
          description: `Offerta "${offerTitle}" disattivata con successo`,
        });
        fetchJobOffers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deactivating job offer:', error);
      toast({
        title: "Errore",
        description: "Errore durante la disattivazione dell'offerta",
        variant: "destructive",
      });
    }
  };

  const handleReactivateOffer = async (offerId: string, offerTitle: string) => {
    try {
      const { error } = await supabase
        .from('job_offers')
        .update({ status: 'active' })
        .eq('id', offerId);

      if (error) {
        console.error('Error reactivating job offer:', error);
        toast({
          title: "Errore",
          description: "Impossibile riattivare l'offerta di lavoro",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Successo",
          description: `Offerta "${offerTitle}" riattivata con successo`,
        });
        fetchJobOffers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error reactivating job offer:', error);
      toast({
        title: "Errore",
        description: "Errore durante la riattivazione dell'offerta",
        variant: "destructive",
      });
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

  if (showNewOfferForm) {
    return (
      <JobOfferForm 
        onBack={() => setShowNewOfferForm(false)}
        onSuccess={handleNewOfferSuccess}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Caricamento offerte...</div>
      </div>
    );
  }

  // Se l'utente non è autenticato, mostra messaggio appropriato
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Le Mie Offerte</h1>
            <p className="text-muted-foreground">
              Gestisci le tue offerte di lavoro pubblicate
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-red-600">Accesso Negato</h3>
              <p className="text-muted-foreground">
                Devi essere autenticato per visualizzare le offerte di lavoro.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? "Tutte le Offerte (Admin)" : "Le Mie Offerte"}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Gestisci tutte le offerte di lavoro (modalità amministratore)" : "Gestisci le tue offerte di lavoro pubblicate"}
          </p>
        </div>
        <Button onClick={() => setShowNewOfferForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuova Offerta
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca per titolo, posizione o descrizione..."
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
                    ? "Non hai ancora pubblicato offerte di lavoro"
                    : "Nessuna offerta corrisponde ai filtri selezionati"}
                </p>
                {jobOffers.length === 0 && (
                  <Button 
                    onClick={() => setShowNewOfferForm(true)}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crea la tua prima offerta
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      {offer.title}
                      {isAdmin && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Admin View
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      {offer.company_name && (
                        <span>{offer.company_name}</span>
                      )}
                      {offer.contact_email && isAdmin && (
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
                      {offer.updated_at !== offer.created_at && (
                        <span> • Aggiornata il {new Date(offer.updated_at).toLocaleDateString('it-IT')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifica
                      </Button>
                      {offer.status === 'active' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeactivateOffer(offer.id, offer.title)}
                          className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Disattiva
                        </Button>
                      )}
                      {offer.status === 'paused' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReactivateOffer(offer.id, offer.title)}
                          className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Riattiva
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
    </div>
  );
}
