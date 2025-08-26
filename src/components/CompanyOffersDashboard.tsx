import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Search, Plus, Briefcase } from "lucide-react";
import JobOfferForm from "./JobOfferForm";
import JobOfferEditForm from "./JobOfferEditForm";
import CompactCompanyOfferCard from "./company/CompactCompanyOfferCard";
import { Database } from "@/integrations/supabase/types";

type CompanyJobOffer = Database['public']['Tables']['job_offers']['Row'];

export default function CompanyOffersDashboard() {
  const [jobOffers, setJobOffers] = useState<CompanyJobOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<CompanyJobOffer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showNewOfferForm, setShowNewOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<CompanyJobOffer | null>(null);
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
    console.log('isAdmin:', isAdmin);
    console.log('userProfile:', userProfile);

    // Query aggiornata per cercare offerte sia tramite company_id che contact_email
    let query = supabase.from("job_offers").select("*");

    // Se l'utente è admin, mostra tutte le offerte
    if (isAdmin) {
      console.log('Admin user - fetching all job offers');
      // Admin vede tutte le offerte
      query = query.order("created_at", { ascending: false });
    } else if (userProfile && userProfile.user_type === 'company') {
      console.log('Company user - fetching company job offers');
      query = query.or(`company_id.eq.${userProfile.registration_id},contact_email.eq.${user.email}`);
    } else {
      console.log('Regular user - fetching by email');
      // Altrimenti cerca solo per email
      query = query.eq("contact_email", user.email);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching job offers:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      toast({
        title: "Errore",
        description: `Impossibile caricare le offerte di lavoro: ${error.message}`,
        variant: "destructive",
      });
    } else {
      console.log('Job offers fetched successfully:', data);
      console.log('Number of offers:', data?.length || 0);
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

  const handleEditOfferSuccess = () => {
    setEditingOffer(null);
    fetchJobOffers(); // Refresh the list
  };

  const handleEditOffer = (offer: CompanyJobOffer) => {
    setEditingOffer(offer);
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
    const confirmed = window.confirm(`Sei sicuro di voler eliminare l'offerta "${offerTitle}"? Questa azione non può essere annullata e verranno rimosse anche tutte le proposte associate.`);
    
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


  if (showNewOfferForm) {
    return (
      <JobOfferForm 
        onBack={() => setShowNewOfferForm(false)}
        onSuccess={handleNewOfferSuccess}
      />
    );
  }

  if (editingOffer) {
    return (
      <JobOfferEditForm 
        offer={editingOffer}
        onBack={() => setEditingOffer(null)}
        onSuccess={handleEditOfferSuccess}
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

      {/* Job Offers List - Compact Layout */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredOffers.length === 0 ? (
          <div className="md:col-span-2">
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
          </div>
        ) : (
          filteredOffers.map((offer) => (
            <CompactCompanyOfferCard
              key={offer.id}
              offer={offer}
              onEdit={handleEditOffer}
              onDeactivate={handleDeactivateOffer}
              onReactivate={handleReactivateOffer}
              onDelete={handleDeleteOffer}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>
    </div>
  );
}
