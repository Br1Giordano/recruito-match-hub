
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useRecruiterProposals } from "@/hooks/useRecruiterProposals";
import ProposalFilters from "./proposals/ProposalFilters";
import RecruiterProposalCard from "./proposals/RecruiterProposalCard";
import EmptyProposalsState from "./proposals/EmptyProposalsState";

export default function RecruiterDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);
  const { user } = useAuth();
  const { proposals, isLoading } = useRecruiterProposals();

  useEffect(() => {
    let filtered = proposals;

    if (searchTerm) {
      filtered = filtered.filter(
        (proposal) =>
          proposal.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.job_offers?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <EmptyProposalsState type="recruiter" hasProposals={proposals.length > 0} />
        ) : (
          filteredProposals.map((proposal) => (
            <RecruiterProposalCard key={proposal.id} proposal={proposal} />
          ))
        )}
      </div>
    </div>
  );
}
