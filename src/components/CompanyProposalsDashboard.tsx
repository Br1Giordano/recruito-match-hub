
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProposals } from "@/hooks/useProposals";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import ProposalFilters from "./proposals/ProposalFilters";
import ProposalCard from "./proposals/ProposalCard";
import EmptyProposalsState from "./proposals/EmptyProposalsState";
import ProposalTabs from "./proposals/ProposalTabs";

export default function CompanyProposalsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("pending");
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);
  const { user } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { proposals, isLoading, updateProposalStatus, sendResponse, deleteProposal } = useProposals();

  // Raggruppa le proposte per stato - under_review ora rappresenta "interessato"
  const pendingProposals = proposals.filter(p => p.status === "pending");
  const interestedProposals = proposals.filter(p => p.status === "under_review");
  const otherProposals = proposals.filter(p => !["pending", "under_review"].includes(p.status));

  useEffect(() => {
    let currentProposals = [];
    
    // Seleziona le proposte in base alla tab attiva
    switch (activeTab) {
      case "pending":
        currentProposals = pendingProposals;
        break;
      case "interested":
        currentProposals = interestedProposals;
        break;
      case "other":
        currentProposals = otherProposals;
        break;
      default:
        currentProposals = proposals;
    }

    let filtered = currentProposals;

    // Applica i filtri di ricerca con sanitizzazione
    if (searchTerm) {
      const sanitizedSearchTerm = searchTerm.toLowerCase().replace(/[<>\"']/g, '');
      filtered = filtered.filter(
        (proposal) =>
          proposal.candidate_name.toLowerCase().includes(sanitizedSearchTerm) ||
          proposal.recruiter_name?.toLowerCase().includes(sanitizedSearchTerm) ||
          proposal.job_offers?.title?.toLowerCase().includes(sanitizedSearchTerm)
      );
    }

    // Applica i filtri di stato solo se non siamo in una tab specifica
    if (statusFilter !== "all" && activeTab === "pending") {
      filtered = filtered.filter((proposal) => proposal.status === statusFilter);
    }

    setFilteredProposals(filtered);
  }, [searchTerm, statusFilter, proposals, activeTab, pendingProposals, interestedProposals, otherProposals]);

  const handleDeleteProposal = async (proposalId: string) => {
    if (!isAdmin) {
      return;
    }
    
    const confirmed = window.confirm("Sei sicuro di voler eliminare questa proposta? Questa azione non può essere annullata.");
    if (confirmed && deleteProposal) {
      await deleteProposal(proposalId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Caricamento proposte sicure...</div>
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
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <Shield className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                <p className="text-sm text-blue-700">
                  Sistema di sicurezza attivo: Row Level Security (RLS) abilitato
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderProposals = (proposalsToRender: any[], tabStatus: string) => {
    if (proposalsToRender.length === 0) {
      let emptyMessage = "";
      switch (tabStatus) {
        case "pending":
          emptyMessage = "Non ci sono nuove proposte in attesa";
          break;
        case "interested":
          emptyMessage = "Non hai ancora mostrato interesse per nessuna proposta";
          break;
        case "other":
          emptyMessage = "Non ci sono altre proposte";
          break;
      }
      
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">{emptyMessage}</p>
              <div className="mt-2 p-2 bg-green-50 rounded-lg">
                <Shield className="mx-auto h-5 w-5 text-green-600 mb-1" />
                <p className="text-xs text-green-700">
                  I dati sono protetti da Row Level Security
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-6">
        {proposalsToRender.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onStatusUpdate={updateProposalStatus}
            onSendResponse={sendResponse}
            onDelete={isAdmin ? handleDeleteProposal : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Proposte Ricevute
          {isAdmin && (
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Admin
            </span>
          )}
        </h1>
        <p className="text-muted-foreground">
          Revisiona e gestisci le proposte inviate dai recruiter per le tue offerte di lavoro
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm text-green-700">
          <Shield className="h-4 w-4" />
          <span>Sistema sicuro - Row Level Security attivo</span>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ProposalFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
          />
        </CardContent>
      </Card>

      <ProposalTabs
        pendingProposals={pendingProposals}
        interestedProposals={interestedProposals}
        otherProposals={otherProposals}
        onTabChange={setActiveTab}
      >
        {renderProposals}
      </ProposalTabs>
    </div>
  );
}
