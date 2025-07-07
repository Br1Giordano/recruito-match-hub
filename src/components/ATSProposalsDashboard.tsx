
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useProposals } from "@/hooks/useProposals";
import ProposalListItem from "./proposals/ProposalListItem";
import ProposalDetailPanel from "./proposals/ProposalDetailPanel";
import ProposalFiltersBar from "./proposals/ProposalFiltersBar";
import ProposalKPIHeader from "./proposals/ProposalKPIHeader";
import BulkActionsBar from "./proposals/BulkActionsBar";

export default function ATSProposalsDashboard() {
  const { proposals, isLoading, updateProposalStatus } = useProposals();
  const { toast } = useToast();
  
  // State per filtri e ricerca
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [matchScoreRange, setMatchScoreRange] = useState<[number, number]>([0, 100]);
  
  // State per selezioni e dettagli
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [activeProposal, setActiveProposal] = useState<any>(null);
  
  // Filtri applicati
  const filteredProposals = proposals.filter(proposal => {
    // Filtro ricerca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        proposal.candidate_name.toLowerCase().includes(searchLower) ||
        proposal.recruiter_name?.toLowerCase().includes(searchLower) ||
        proposal.job_offers?.title?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Filtro stato
    if (statusFilter !== "all" && proposal.status !== statusFilter) {
      return false;
    }
    
    // Filtro match score (simulato)
    const score = getMatchScore(proposal);
    if (score < matchScoreRange[0] || score > matchScoreRange[1]) {
      return false;
    }
    
    return true;
  });

  // Calcola match score (stesso algoritmo di ProposalListItem)
  function getMatchScore(proposal: any) {
    let score = 50;
    if (proposal.years_experience) score += Math.min(proposal.years_experience * 5, 25);
    if (proposal.expected_salary && proposal.current_salary) {
      const salaryIncrease = ((proposal.expected_salary - proposal.current_salary) / proposal.current_salary) * 100;
      if (salaryIncrease < 20) score += 15;
    }
    if (proposal.availability_weeks && proposal.availability_weeks <= 4) score += 10;
    return Math.min(score, 100);
  }

  // Gestione keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!activeProposal) return;
      
      switch (e.key.toLowerCase()) {
        case 'a':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            handleApprove(activeProposal.id);
          }
          break;
        case 'r':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            handleReject(activeProposal.id);
          }
          break;
        case 'd':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            // Dettagli già aperti, potresti implementare scroll o focus
          }
          break;
        case 'escape':
          setActiveProposal(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeProposal]);

  // Azioni sui singoli elementi
  const handleApprove = async (proposalId: string) => {
    const success = await updateProposalStatus(proposalId, 'accepted');
    if (success) {
      toast({
        title: "Proposta approvata",
        description: "Il candidato è stato approvato con successo",
      });
    }
  };

  const handleReject = async (proposalId: string) => {
    const success = await updateProposalStatus(proposalId, 'rejected');
    if (success) {
      toast({
        title: "Proposta rifiutata",
        description: "Il candidato è stato rifiutato",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    setActiveProposal(proposal);
  };

  // Gestione selezioni multiple
  const handleSelect = (proposalId: string, selected: boolean) => {
    if (selected) {
      setSelectedProposals(prev => [...prev, proposalId]);
    } else {
      setSelectedProposals(prev => prev.filter(id => id !== proposalId));
    }
  };

  const handleSelectAll = () => {
    if (selectedProposals.length === filteredProposals.length) {
      setSelectedProposals([]);
    } else {
      setSelectedProposals(filteredProposals.map(p => p.id));
    }
  };

  // Azioni bulk
  const handleBulkApprove = async () => {
    for (const proposalId of selectedProposals) {
      await updateProposalStatus(proposalId, 'accepted');
    }
    setSelectedProposals([]);
    toast({
      title: "Proposte approvate",
      description: `${selectedProposals.length} proposte approvate con successo`,
    });
  };

  const handleBulkReject = async () => {
    for (const proposalId of selectedProposals) {
      await updateProposalStatus(proposalId, 'rejected');
    }
    setSelectedProposals([]);
    toast({
      title: "Proposte rifiutate",
      description: `${selectedProposals.length} proposte rifiutate`,
      variant: "destructive",
    });
  };

  const handleBulkDelete = () => {
    // Implementa logica di cancellazione se necessario
    console.log('Bulk delete:', selectedProposals);
    setSelectedProposals([]);
  };

  // Reset filtri
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setMatchScoreRange([0, 100]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Caricamento proposte...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header con KPI */}
      <div className="bg-white p-6 border-b">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Proposte Ricevute</h1>
          <p className="text-gray-600">
            Gestisci rapidamente le candidature ricevute dai recruiter
          </p>
        </div>
        <ProposalKPIHeader proposals={proposals} />
      </div>

      {/* Filtri */}
      <ProposalFiltersBar
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        matchScoreRange={matchScoreRange}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onMatchScoreChange={setMatchScoreRange}
        onClearFilters={handleClearFilters}
        totalCount={proposals.length}
        filteredCount={filteredProposals.length}
      />

      {/* Layout principale a due pannelli */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lista proposte (pannello sinistro) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <BulkActionsBar
            selectedCount={selectedProposals.length}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
            onBulkDelete={handleBulkDelete}
            onClearSelection={() => setSelectedProposals([])}
          />

          {filteredProposals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nessuna proposta trovata con i filtri applicati</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProposals.map((proposal) => (
                <ProposalListItem
                  key={proposal.id}
                  proposal={proposal}
                  isSelected={selectedProposals.includes(proposal.id)}
                  isActive={activeProposal?.id === proposal.id}
                  onSelect={handleSelect}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pannello dettagli (pannello destro) */}
        <ProposalDetailPanel
          proposal={activeProposal}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setActiveProposal(null)}
        />
      </div>

      {/* Shortcut help */}
      {activeProposal && (
        <div className="bg-gray-800 text-white px-4 py-2 text-xs">
          <span className="opacity-75">Shortcuts: </span>
          <span className="font-mono">A</span> Approva • 
          <span className="font-mono">R</span> Rifiuta • 
          <span className="font-mono">D</span> Dettagli • 
          <span className="font-mono">ESC</span> Chiudi
        </div>
      )}
    </div>
  );
}
