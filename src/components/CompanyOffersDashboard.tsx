import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Search, Plus, Edit, MapPin, Euro, Clock, Briefcase } from "lucide-react";
import JobOfferForm from "./JobOfferForm";

interface JobOffer {
  id: string;
  title: string;
  description?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  requirements?: string;
  benefits?: string;
  employment_type?: string;
  status: string;
  created_at: string;
  updated_at: string;
  company_name?: string;
  contact_email?: string;
}

export default function CompanyOffersDashboard() {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<JobOffer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showNewOfferForm, setShowNewOfferForm] = useState(false);
  const { toast } = useToast();
  const { userProfile, user } = useAuth();

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

    // Se l'utente ha un profilo azienda, cerca anche per company_id
    if (userProfile && userProfile.user_type === 'company') {
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
  }, [userProfile, user]);

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
          <h1 className="text-3xl font-bold tracking-tight">Le Mie Offerte</h1>
          <p className="text-muted-foreground">
            Gestisci le tue offerte di lavoro pubblicate
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
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      {offer.company_name && (
                        <span>{offer.company_name}</span>
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
                  <Badge className={getStatusColor(offer.status)}>
                    {getStatusText(offer.status)}
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
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifica
                    </Button>
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
