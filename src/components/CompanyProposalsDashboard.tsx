
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProposals } from "@/hooks/useProposals";
import ProposalFilters from "./proposals/ProposalFilters";
import ProposalCard from "./proposals/ProposalCard";
import EmptyProposalsState from "./proposals/EmptyProposalsState";

export default function CompanyProposalsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);
  const { user } = useAuth();
  const { proposals, isLoading, updateProposalStatus, sendResponse } = useProposals();

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

      <div className="grid gap-6">
        {filteredProposals.length === 0 ? (
          <EmptyProposalsState type="company" hasProposals={proposals.length > 0} />
        ) : (
          filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onStatusUpdate={updateProposalStatus}
              onSendResponse={sendResponse}
            />
          ))
        )}
      </div>
    </div>
  );
}
