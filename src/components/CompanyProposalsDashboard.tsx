import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Search, User, Mail, Phone, Linkedin, Euro, Calendar, MessageSquare, Check, X, Clock } from "lucide-react";

interface Proposal {
  id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  candidate_linkedin?: string;
  proposal_description: string;
  years_experience?: number;
  current_salary?: number;
  expected_salary?: number;
  availability_weeks?: number;
  recruiter_fee_percentage?: number;
  status: string;
  created_at: string;
  recruiter_name?: string;
  recruiter_email?: string;
  recruiter_phone?: string;
  job_offers?: {
    title: string;
    contact_email?: string;
  };
}

export default function CompanyProposalsDashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProposals = async () => {
    if (!user?.email) {
      console.log('User email not available');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    console.log('Fetching proposals for user email:', user.email);

    try {
      // Ora possiamo fare una query diretta con join senza problemi di RLS
      const { data: proposalsData, error: proposalsError } = await supabase
        .from("proposals")
        .select(`
          *,
          job_offers(title, contact_email)
        `)
        .order("created_at", { ascending: false });

      if (proposalsError) {
        console.error('Error fetching proposals:', proposalsError);
        toast({
          title: "Errore",
          description: `Errore nel caricamento delle proposte: ${proposalsError.message}`,
          variant: "destructive",
        });
        return;
      }

      // Filtra le proposte per le job offers dell'utente
      const userProposals = (proposalsData || []).filter(proposal => 
        proposal.job_offers?.contact_email === user.email
      );
      
      console.log('Filtered user proposals:', userProposals);
      setProposals(userProposals);
      setFilteredProposals(userProposals);
      
      if (userProposals.length > 0) {
        toast({
          title: "Successo",
          description: `Trovate ${userProposals.length} proposte`,
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      toast({
        title: "Errore",
        description: `Si è verificato un errore imprevisto: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchProposals();
    }
  }, [user?.email]);

  useEffect(() => {
    let filtered = proposals;

    if (searchTerm) {
      filtered = filtered.filter(
        (proposal) =>
          proposal.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.recruiter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.job_offers?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((proposal) => proposal.status === statusFilter);
    }

    setFilteredProposals(filtered);
  }, [searchTerm, statusFilter, proposals]);

  const updateProposalStatus = async (proposalId: string, newStatus: string) => {
    const { error } = await supabase
      .from("proposals")
      .update({ status: newStatus })
      .eq("id", proposalId);

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato della proposta",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Successo",
        description: "Stato della proposta aggiornato",
      });
      fetchProposals();
    }
  };

  const sendResponse = async (proposalId: string, status: string) => {
    if (!user) return;

    const companyIdentifier = user.email;

    const { error } = await supabase
      .from("proposal_responses")
      .insert([{
        proposal_id: proposalId,
        company_id: companyIdentifier,
        status: status,
        response_message: responseMessage,
      }]);

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile inviare la risposta",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Successo",
        description: "Risposta inviata al recruiter",
      });
      setRespondingTo(null);
      setResponseMessage("");
      updateProposalStatus(proposalId, status === "interested" ? "under_review" : "rejected");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Caricamento proposte...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proposte Ricevute</h1>
          <p className="text-muted-foreground">
            Revisiona e gestisci le proposte inviate dai recruiter
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-red-600">Accesso Negato</h3>
              <p className="text-muted-foreground">
                Devi essere autenticato come azienda per visualizzare le proposte.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proposte Ricevute</h1>
        <p className="text-muted-foreground">
          Revisiona e gestisci le proposte inviate dai recruiter per le tue offerte di lavoro
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
                  placeholder="Cerca per candidato, recruiter o posizione..."
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
                <SelectItem value="pending">In Attesa</SelectItem>
                <SelectItem value="under_review">In Revisione</SelectItem>
                <SelectItem value="approved">Approvata</SelectItem>
                <SelectItem value="rejected">Rifiutata</SelectItem>
                <SelectItem value="hired">Assunto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Proposals List */}
      <div className="grid gap-6">
        {filteredProposals.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nessuna proposta trovata</h3>
                <p className="text-muted-foreground">
                  {proposals.length === 0
                    ? "Non hai ancora ricevuto proposte per le tue offerte di lavoro"
                    : "Nessuna proposta corrisponde ai filtri selezionati"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {proposal.candidate_name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {proposal.recruiter_name && (
                        <>Proposto da {proposal.recruiter_name}</>
                      )}
                      {proposal.job_offers?.title && (
                        <>
                          <span> • </span>
                          <span>{proposal.job_offers.title}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(proposal.status)}>
                    {getStatusText(proposal.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Descrizione del candidato:</h4>
                    <p className="text-sm text-muted-foreground">
                      {proposal.proposal_description || "Nessuna descrizione fornita"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Contatti Candidato:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${proposal.candidate_email}`} className="text-blue-600 hover:underline">
                            {proposal.candidate_email}
                          </a>
                        </div>
                        {proposal.candidate_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${proposal.candidate_phone}`} className="text-blue-600 hover:underline">
                              {proposal.candidate_phone}
                            </a>
                          </div>
                        )}
                        {proposal.candidate_linkedin && (
                          <div className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4" />
                            <a href={proposal.candidate_linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              LinkedIn
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Dettagli:</h4>
                      <div className="space-y-1 text-sm">
                        {proposal.years_experience && (
                          <div>Esperienza: {proposal.years_experience} anni</div>
                        )}
                        {proposal.expected_salary && (
                          <div className="flex items-center gap-1">
                            <Euro className="h-4 w-4" />
                            Salario desiderato: €{proposal.expected_salary.toLocaleString()}
                          </div>
                        )}
                        {proposal.availability_weeks && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Disponibile in: {proposal.availability_weeks} settimane
                          </div>
                        )}
                        {proposal.recruiter_fee_percentage && (
                          <div>Fee recruiter: {proposal.recruiter_fee_percentage}%</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {(proposal.recruiter_name || proposal.recruiter_email) && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">Contatti Recruiter:</h4>
                      <div className="flex items-center gap-4 text-sm">
                        {proposal.recruiter_email && (
                          <a href={`mailto:${proposal.recruiter_email}`} className="text-blue-600 hover:underline">
                            {proposal.recruiter_email}
                          </a>
                        )}
                        {proposal.recruiter_phone && (
                          <a href={`tel:${proposal.recruiter_phone}`} className="text-blue-600 hover:underline">
                            {proposal.recruiter_phone}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {proposal.status === "pending" && (
                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRespondingTo(proposal.id)}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Interessato
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProposalStatus(proposal.id, "rejected")}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Non Interessato
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProposalStatus(proposal.id, "under_review")}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        In Revisione
                      </Button>
                    </div>
                  )}

                  {respondingTo === proposal.id && (
                    <div className="space-y-3 pt-4 border-t bg-gray-50 p-4 rounded">
                      <Textarea
                        placeholder="Scrivi una risposta al recruiter..."
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => sendResponse(proposal.id, "interested")}
                        >
                          Invia Interesse
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendResponse(proposal.id, "not_interested")}
                        >
                          Declina
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRespondingTo(null);
                            setResponseMessage("");
                          }}
                        >
                          Annulla
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Ricevuta il {new Date(proposal.created_at).toLocaleDateString('it-IT')} alle {new Date(proposal.created_at).toLocaleTimeString('it-IT')}
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
