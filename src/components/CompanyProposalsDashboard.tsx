
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
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

  // Raggruppa le proposte per stato
  const pendingProposals = proposals.filter(p => p.status === "pending");
  const evaluatingProposals = proposals.filter(p => p.status === "under_review");
  const approvedProposals = proposals.filter(p => p.status === "approved");
  const otherProposals = proposals.filter(p => !["pending", "under_review", "approved"].includes(p.status));

  useEffect(() => {
    let currentProposals = [];
    
    // Seleziona le proposte in base alla tab attiva
    switch (activeTab) {
      case "pending":
        currentProposals = pendingProposals;
        break;
      case "interested":
        currentProposals = evaluatingProposals;
        break;
      case "approved":
        currentProposals = approvedProposals;
        break;
      case "other":
        currentProposals = otherProposals;
        break;
      default:
        currentProposals = proposals;
    }

    let filtered = currentProposals;

    // Applica i filtri di ricerca
    if (searchTerm) {
      filtered = filtered.filter(
        (proposal) =>
          proposal.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.recruiter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.job_offers?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Applica i filtri di stato solo se non siamo in una tab specifica
    if (statusFilter !== "all" && activeTab === "pending") {
      filtered = filtered.filter((proposal) => proposal.status === statusFilter);
    }

    setFilteredProposals(filtered);
  }, [searchTerm, statusFilter, proposals, activeTab, pendingProposals, evaluatingProposals, approvedProposals, otherProposals]);

  const handleDeleteProposal = async (proposalId: string) => {
    if (!isAdmin) return;
    
    const confirmed = window.confirm("Sei sicuro di voler eliminare questa proposta? Questa azione non può essere annullata.");
    if (confirmed && deleteProposal) {
      await deleteProposal(proposalId);
    }
  };

  // Fix: Simplified sendResponse handler to match the expected signature
  const handleSendResponse = async (proposalId: string, response: any) => {
    if (sendResponse) {
      await sendResponse(proposalId, response.status, response.message);
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

  const renderProposals = (proposalsToRender: any[], tabStatus: string) => {
    if (proposalsToRender.length === 0) {
      let emptyMessage = "";
      switch (tabStatus) {
        case "pending":
          emptyMessage = "Non ci sono nuove proposte in attesa";
          break;
        case "interested":
          emptyMessage = "Non hai ancora avviato nessuna valutazione";
          break;
        case "approved":
          emptyMessage = "Non hai ancora approvato nessuna proposta";
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
            onSendResponse={handleSendResponse}
            onDelete={isAdmin ? handleDeleteProposal : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proposte Ricevute</h1>
        <p className="text-muted-foreground">
          Revisiona e gestisci le proposte inviate dai recruiter per le tue offerte di lavoro
        </p>
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
        interestedProposals={evaluatingProposals}
        approvedProposals={approvedProposals}
        otherProposals={otherProposals}
        onTabChange={setActiveTab}
      >
        {renderProposals}
      </ProposalTabs>
    </div>
  );
}
