
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProposals } from "@/hooks/useProposals";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import ATSKPIHeader from "./proposals/ATSKPIHeader";
import ProposalFiltersBar from "./proposals/ProposalFiltersBar";
import ProposalCard from "./proposals/ProposalCard";
import ProposalDetailPanel from "./proposals/ProposalDetailPanel";

export default function CompanyProposalsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [matchScoreFilter, setMatchScoreFilter] = useState([0]);
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null);
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);

  const { user } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { proposals, isLoading, updateProposalStatus, deleteProposal } = useProposals();

  // Calculate KPIs
  const totalProposals = proposals.length;
  const activeProposals = proposals.filter(p => ["pending", "under_review"].includes(p.status)).length;
  const approvedProposals = proposals.filter(p => p.status === "approved").length;
  const conversionRate = totalProposals > 0 ? (approvedProposals / totalProposals) * 100 : 0;
  
  // Calculate average response time (simulated)
  const avgResponseTime = proposals.length > 0 
    ? proposals.reduce((acc, proposal) => {
        const createdAt = new Date(proposal.created_at);
        const now = new Date();
        const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        return acc + hoursDiff;
      }, 0) / proposals.length
    : 0;

  // Apply filters
  useEffect(() => {
    let filtered = [...proposals];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (proposal) =>
          proposal.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.recruiter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.job_offers?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.proposal_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((proposal) => proposal.status === statusFilter);
    }

    // Show only new filter
    if (showOnlyNew) {
      filtered = filtered.filter((proposal) => proposal.status === "pending");
    }

    // Match score filter (simulated)
    filtered = filtered.filter(() => Math.random() * 100 >= matchScoreFilter[0]);

    setFilteredProposals(filtered);
  }, [searchTerm, statusFilter, matchScoreFilter, showOnlyNew, proposals]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!activeProposalId) return;

      const currentIndex = filteredProposals.findIndex(p => p.id === activeProposalId);
      
      switch (event.key.toLowerCase()) {
        case "a":
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            handleApprove();
          }
          break;
        case "r":
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            handleReject();
          }
          break;
        case "arrowup":
          event.preventDefault();
          if (currentIndex > 0) {
            setActiveProposalId(filteredProposals[currentIndex - 1].id);
          }
          break;
        case "arrowdown":
          event.preventDefault();
          if (currentIndex < filteredProposals.length - 1) {
            setActiveProposalId(filteredProposals[currentIndex + 1].id);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProposalId, filteredProposals]);

  const handleProposalSelect = (proposalId: string, checked: boolean) => {
    setSelectedProposals(prev => 
      checked 
        ? [...prev, proposalId]
        : prev.filter(id => id !== proposalId)
    );
  };

  const handleProposalClick = (proposalId: string) => {
    setActiveProposalId(proposalId);
  };

  const handleApprove = async () => {
    if (activeProposalId && updateProposalStatus) {
      await updateProposalStatus(activeProposalId, 'approved');
    }
  };

  const handleReject = async () => {
    if (activeProposalId && updateProposalStatus) {
      await updateProposalStatus(activeProposalId, 'rejected');
    }
  };

  const activeProposal = filteredProposals.find(p => p.id === activeProposalId);

  // Simulated data for demo
  const getSimulatedData = (proposalId: string) => ({
    matchScore: Math.floor(Math.random() * 40) + 60, // 60-100%
    recruiterRating: Math.random() * 2 + 3, // 3-5 stars
    recruiterSuccessRate: Math.floor(Math.random() * 30) + 70 // 70-100%
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Caricamento proposte...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Accesso Negato</h3>
            <p className="text-gray-600">
              Devi essere autenticato come azienda per visualizzare le proposte.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* KPI Header */}
      <ATSKPIHeader
        totalProposals={totalProposals}
        activeProposals={activeProposals}
        avgResponseTime={avgResponseTime}
        conversionRate={conversionRate}
      />

      {/* Filters Bar */}
      <ProposalFiltersBar
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        matchScoreFilter={matchScoreFilter}
        showOnlyNew={showOnlyNew}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onMatchScoreChange={setMatchScoreFilter}
        onShowOnlyNewChange={setShowOnlyNew}
      />

      {/* Main Content - Two Columns */}
      <div className="flex h-[calc(100vh-280px)]">
        {/* Left Column - Proposals List */}
        <div className="w-2/5 bg-white border-r overflow-hidden flex flex-col">
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Candidature ({filteredProposals.length})
              </h2>
              {selectedProposals.length > 0 && (
                <div className="text-sm text-gray-600">
                  {selectedProposals.length} selezionate
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {filteredProposals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nessuna candidatura trovata</p>
              </div>
            ) : (
              filteredProposals.map((proposal) => {
                const simulatedData = getSimulatedData(proposal.id);
                return (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    isSelected={selectedProposals.includes(proposal.id)}
                    isActive={activeProposalId === proposal.id}
                    matchScore={simulatedData.matchScore}
                    recruiterRating={simulatedData.recruiterRating}
                    recruiterSuccessRate={simulatedData.recruiterSuccessRate}
                    onSelect={(checked) => handleProposalSelect(proposal.id, checked)}
                    onClick={() => handleProposalClick(proposal.id)}
                    onKeyDown={() => {}}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Right Column - Detail Panel */}
        <ProposalDetailPanel
          proposal={activeProposal || null}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
