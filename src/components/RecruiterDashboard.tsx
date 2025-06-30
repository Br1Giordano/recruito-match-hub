
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Search, Eye, FileText, Calendar, Euro, User, Building2 } from "lucide-react";

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
  company_registrations?: {
    nome_azienda: string;
  } | null;
  job_offers?: {
    title: string;
  };
}

export default function RecruiterDashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { userProfile, user } = useAuth();

  const fetchProposals = async () => {
    if (!user) {
      console.log('No user found');
      setIsLoading(false);
      return;
    }

    console.log('User profile:', userProfile);
    console.log('Current user:', user);

    setIsLoading(true);

    // Per la demo, usiamo il primo recruiter disponibile se non abbiamo un profilo collegato
    let recruiterId = null;
    
    if (userProfile && userProfile.user_type === 'recruiter') {
      recruiterId = userProfile.registration_id;
      console.log('Using recruiter ID from profile:', recruiterId);
    } else {
      // Fallback: usa il primo recruiter disponibile per la demo
      const { data: recruiterData, error: recruiterError } = await supabase
        .from("recruiter_registrations")
        .select("id")
        .limit(1)
        .maybeSingle();

      console.log('Fallback recruiter data:', recruiterData);
      console.log('Fallback recruiter error:', recruiterError);

      if (recruiterError) {
        console.error('Error fetching recruiter:', recruiterError);
        toast({
          title: "Info Demo",
          description: "Modalità demo: utilizzo dati di esempio per mostrare le funzionalità",
        });
        setIsLoading(false);
        return;
      }
      
      if (!recruiterData) {
        toast({
          title: "Demo",
          description: "Nessun dato di esempio disponibile. Questa è una demo delle funzionalità.",
        });
        setIsLoading(false);
        return;
      }
      
      recruiterId = recruiterData.id;
    }

    const { data, error } = await supabase
      .from("proposals")
      .select(`
        *,
        company_registrations(nome_azienda),
        job_offers(title)
      `)
      .eq("recruiter_id", recruiterId)
      .order("created_at", { ascending: false });

    console.log('Proposals data:', data);
    console.log('Proposals error:', error);

    if (error) {
      console.error("Error fetching proposals:", error);
      toast({
        title: "Demo",
        description: "Questa è una demo - in produzione vedrai qui le tue proposte reali",
      });
      // Per la demo, mostriamo comunque l'interfaccia vuota
      setProposals([]);
      setFilteredProposals([]);
    } else {
      setProposals(data || []);
      setFilteredProposals(data || []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, [user, userProfile]);

  useEffect(() => {
    let filtered = proposals;

    if (searchTerm) {
      filtered = filtered.filter(
        (proposal) =>
          proposal.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.company_registrations?.nome_azienda?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.job_offers?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((proposal) => proposal.status === statusFilter);
    }

    setFilteredProposals(filtered);
  }, [searchTerm, statusFilter, proposals]);

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
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Devi essere autenticato per visualizzare le proposte</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Le Mie Candidature</h1>
        <p className="text-muted-foreground">
          Gestisci e monitora le proposte che hai inviato alle aziende
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
                  placeholder="Cerca per candidato, azienda o posizione..."
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
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Modalità Demo</h3>
                <p className="text-muted-foreground">
                  Questa è una demo del sistema. In produzione vedrai qui le tue proposte reali.
                  <br />
                  Prova a inviare una nuova proposta per testare le funzionalità!
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
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4" />
                      {proposal.company_registrations?.nome_azienda || "Azienda"}
                      {proposal.job_offers?.title && (
                        <>
                          <span>•</span>
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
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {proposal.proposal_description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {proposal.years_experience && (
                      <div>
                        <span className="font-medium">Esperienza:</span>
                        <p>{proposal.years_experience} anni</p>
                      </div>
                    )}
                    {proposal.expected_salary && (
                      <div className="flex items-center gap-1">
                        <Euro className="h-4 w-4" />
                        <span className="font-medium">Salario:</span>
                        <p>€{proposal.expected_salary.toLocaleString()}</p>
                      </div>
                    )}
                    {proposal.availability_weeks && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Disponibile:</span>
                        <p>{proposal.availability_weeks} settimane</p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Fee:</span>
                      <p>{proposal.recruiter_fee_percentage}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Inviata il {new Date(proposal.created_at).toLocaleDateString('it-IT')}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Dettagli
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
