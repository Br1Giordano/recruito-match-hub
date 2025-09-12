import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase,
  Building2,
  Euro,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface ProposalRecord {
  id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  candidate_linkedin?: string;
  proposal_description?: string;
  years_experience?: number;
  current_salary?: number;
  expected_salary?: number;
  availability_weeks?: number;
  recruiter_fee_percentage?: number;
  status: string;
  created_at: string;
  updated_at: string;
  recruiter_name?: string;
  recruiter_email?: string;
  recruiter_phone?: string;
  company_id?: string;
  job_offers?: {
    title: string;
    company_name?: string;
  };
}

interface GroupedProposals {
  [recruiterEmail: string]: {
    recruiter_name?: string;
    proposals: ProposalRecord[];
  };
}

export default function AdminProposalsManagement() {
  const [proposals, setProposals] = useState<ProposalRecord[]>([]);
  const [groupedProposals, setGroupedProposals] = useState<GroupedProposals>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<ProposalRecord | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [expandedRecruiters, setExpandedRecruiters] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchProposals();
  }, []);

  useEffect(() => {
    // Group proposals by recruiter when proposals data changes
    const grouped = proposals.reduce((acc, proposal) => {
      const recruiterEmail = proposal.recruiter_email || 'unknown';
      if (!acc[recruiterEmail]) {
        acc[recruiterEmail] = {
          recruiter_name: proposal.recruiter_name,
          proposals: []
        };
      }
      acc[recruiterEmail].proposals.push(proposal);
      return acc;
    }, {} as GroupedProposals);

    setGroupedProposals(grouped);
  }, [proposals]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("proposals")
        .select(`
          *,
          job_offers(title, company_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProposals(data || []);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le proposte",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProposal = async (proposalId: string) => {
    try {
      const { error } = await supabase
        .from("proposals")
        .delete()
        .eq("id", proposalId);

      if (error) throw error;

      // Update local state
      setProposals(prev => prev.filter(p => p.id !== proposalId));
      setIsProposalModalOpen(false);
      setSelectedProposal(null);

      toast({
        title: "Successo",
        description: "Candidatura eliminata con successo",
      });
    } catch (error) {
      console.error("Error deleting proposal:", error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare la candidatura",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="pending">In Attesa</Badge>;
      case 'approved':
        return <Badge variant="approved">Approvata</Badge>;
      case 'rejected':
        return <Badge variant="rejected">Rifiutata</Badge>;
      case 'hired':
        return <Badge variant="default" className="bg-purple-100 text-purple-800 border-purple-200">Assunta</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filterProposals = (proposals: ProposalRecord[]) => {
    return proposals.filter(proposal => {
      const matchesSearch = !searchTerm || 
        proposal.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.candidate_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.recruiter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.recruiter_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.job_offers?.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const handleViewProposal = (proposal: ProposalRecord) => {
    setSelectedProposal(proposal);
    setIsProposalModalOpen(true);
  };

  const toggleRecruiterExpansion = (recruiterEmail: string) => {
    setExpandedRecruiters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recruiterEmail)) {
        newSet.delete(recruiterEmail);
      } else {
        newSet.add(recruiterEmail);
      }
      return newSet;
    });
  };

  const getAllFilteredProposals = () => {
    const allProposals = Object.values(groupedProposals).flatMap(group => group.proposals);
    return filterProposals(allProposals);
  };

  const getFilteredGroupedProposals = () => {
    const filtered = {} as GroupedProposals;
    Object.entries(groupedProposals).forEach(([recruiterEmail, group]) => {
      const filteredProposals = filterProposals(group.proposals);
      if (filteredProposals.length > 0) {
        filtered[recruiterEmail] = {
          ...group,
          proposals: filteredProposals
        };
      }
    });
    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Caricamento candidature...</div>
      </div>
    );
  }

  const filteredGroupedProposals = getFilteredGroupedProposals();
  const totalFilteredProposals = getAllFilteredProposals().length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestione Candidature</h2>
          <p className="text-muted-foreground">
            Visualizza e gestisci tutte le candidature raggruppate per recruiter
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidature Totali</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recruiter Attivi</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(groupedProposals).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risultati Filtro</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFilteredProposals}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtri Ricerca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cerca per candidato, recruiter, email o posizione..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtra per stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli Stati</SelectItem>
                <SelectItem value="pending">In Attesa</SelectItem>
                <SelectItem value="approved">Approvata</SelectItem>
                <SelectItem value="rejected">Rifiutata</SelectItem>
                <SelectItem value="hired">Assunta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grouped Proposals */}
      <Card>
        <CardHeader>
          <CardTitle>Candidature per Recruiter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(filteredGroupedProposals).length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nessuna candidatura trovata</h3>
                <p className="text-muted-foreground">
                  {proposals.length === 0 
                    ? "Non ci sono candidature nel sistema"
                    : "Nessuna candidatura corrisponde ai filtri selezionati"}
                </p>
              </div>
            ) : (
              Object.entries(filteredGroupedProposals)
                .sort(([, a], [, b]) => b.proposals.length - a.proposals.length)
                .map(([recruiterEmail, group]) => {
                  const isExpanded = expandedRecruiters.has(recruiterEmail);
                  
                  return (
                    <div key={recruiterEmail} className="border rounded-lg">
                      {/* Recruiter Header */}
                      <div 
                        className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleRecruiterExpansion(recruiterEmail)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {group.recruiter_name || recruiterEmail}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {recruiterEmail}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {group.proposals.length} candidature
                          </Badge>
                        </div>
                      </div>

                      {/* Proposals List */}
                      {isExpanded && (
                        <div className="divide-y">
                          {group.proposals.map((proposal) => (
                            <div key={proposal.id} className="p-4 hover:bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getStatusBadge(proposal.status)}
                                    <span className="text-xs text-muted-foreground">
                                      {format(new Date(proposal.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                                    </span>
                                  </div>
                                  
                                  <div className="font-medium mb-1">
                                    {proposal.candidate_name}
                                  </div>
                                  
                                  <div className="text-sm text-muted-foreground mb-1">
                                    {proposal.candidate_email}
                                  </div>
                                  
                                  {proposal.job_offers?.title && (
                                    <div className="text-sm text-muted-foreground">
                                      <Briefcase className="h-3 w-3 inline mr-1" />
                                      {proposal.job_offers.title}
                                      {proposal.job_offers.company_name && ` - ${proposal.job_offers.company_name}`}
                                    </div>
                                  )}
                                  
                                  {proposal.expected_salary && (
                                    <div className="text-sm text-muted-foreground">
                                      <Euro className="h-3 w-3 inline mr-1" />
                                      Salario atteso: €{proposal.expected_salary.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewProposal(proposal)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Dettagli
                                  </Button>
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="sm">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Elimina
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Elimina Candidatura</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Sei sicuro di voler eliminare la candidatura di {proposal.candidate_name}? 
                                          Questa azione non può essere annullata.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteProposal(proposal.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Elimina
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Proposal Details Modal */}
      <Dialog open={isProposalModalOpen} onOpenChange={setIsProposalModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Dettagli Candidatura
            </DialogTitle>
            <DialogDescription>
              Informazioni complete della candidatura
            </DialogDescription>
          </DialogHeader>

          {selectedProposal && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm border-b pb-2">Informazioni Candidato</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Nome:</span>
                      <span>{selectedProposal.candidate_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span>{selectedProposal.candidate_email}</span>
                    </div>

                    {selectedProposal.candidate_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Telefono:</span>
                        <span>{selectedProposal.candidate_phone}</span>
                      </div>
                    )}

                    {selectedProposal.candidate_linkedin && (
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="font-medium">LinkedIn:</span>
                        <a 
                          href={selectedProposal.candidate_linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline break-all"
                        >
                          {selectedProposal.candidate_linkedin}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm border-b pb-2">Informazioni Recruiter</h4>
                  
                  <div className="space-y-3">
                    {selectedProposal.recruiter_name && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Nome:</span>
                        <span>{selectedProposal.recruiter_name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span>{selectedProposal.recruiter_email}</span>
                    </div>

                    {selectedProposal.recruiter_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Telefono:</span>
                        <span>{selectedProposal.recruiter_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm border-b pb-2">Dettagli Professionali</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProposal.years_experience && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Esperienza:</span>
                      <span>{selectedProposal.years_experience} anni</span>
                    </div>
                  )}

                  {selectedProposal.current_salary && (
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Salario attuale:</span>
                      <span>€{selectedProposal.current_salary.toLocaleString()}</span>
                    </div>
                  )}

                  {selectedProposal.expected_salary && (
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Salario atteso:</span>
                      <span>€{selectedProposal.expected_salary.toLocaleString()}</span>
                    </div>
                  )}

                  {selectedProposal.availability_weeks && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Disponibilità:</span>
                      <span>{selectedProposal.availability_weeks} settimane</span>
                    </div>
                  )}

                  {selectedProposal.recruiter_fee_percentage && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Fee recruiter:</span>
                      <span>{selectedProposal.recruiter_fee_percentage}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Details */}
              {selectedProposal.job_offers && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm border-b pb-2">Posizione</h4>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedProposal.job_offers.title}</span>
                    {selectedProposal.job_offers.company_name && (
                      <span className="text-muted-foreground">- {selectedProposal.job_offers.company_name}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedProposal.proposal_description && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm border-b pb-2">Descrizione Proposta</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedProposal.proposal_description}
                  </p>
                </div>
              )}

              {/* Status and Dates */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm border-b pb-2">Stato e Date</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Stato:</span>
                    {getStatusBadge(selectedProposal.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Creata:</span>
                    <span>{format(new Date(selectedProposal.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedProposal && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Elimina Candidatura
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Elimina Candidatura</AlertDialogTitle>
                    <AlertDialogDescription>
                      Sei sicuro di voler eliminare questa candidatura? Questa azione non può essere annullata.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annulla</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteProposal(selectedProposal.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Elimina
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}