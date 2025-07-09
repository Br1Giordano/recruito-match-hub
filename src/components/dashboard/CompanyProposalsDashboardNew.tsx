import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProposals } from "@/hooks/useProposals";
import DashboardLayout from "./DashboardLayout";
import FilterBar, { FilterState } from "./FilterBar";
import KanbanBoard from "./KanbanBoard";
import SidePanelCandidate from "./SidePanelCandidate";
import { Candidate } from "./CandidateCard";

export default function CompanyProposalsDashboardNew() {
  const { user } = useAuth();
  const { proposals, isLoading, updateProposalStatus } = useProposals();
  
  const [currentView, setCurrentView] = useState<'kanban' | 'list'>('kanban');
  const [showProposals, setShowProposals] = useState(true);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    statuses: [],
    matchScore: [0, 100],
    onlyNew: false
  });

  // Transform proposals to candidates
  const candidates: Candidate[] = useMemo(() => {
    return proposals.map(proposal => ({
      id: proposal.id,
      name: proposal.candidate_name,
      email: proposal.candidate_email,
      phone: proposal.candidate_phone || undefined,
      linkedin: proposal.candidate_linkedin || undefined,
      role: 'Developer', // Default since not in proposal
      seniority: 'Senior', // Default since not in proposal
      skills: ['React', 'TypeScript'], // Default since not in proposal
      matchScore: Math.floor(Math.random() * 40) + 60, // Mock data
      recruiterName: proposal.recruiter_name || undefined,
      recruiterRating: 4.5, // Mock data
      recruiterCompletionRate: 85, // Mock data
      status: proposal.status as any || 'pending',
      createdAt: proposal.created_at,
      updatedAt: proposal.updated_at
    }));
  }, [proposals]);

  // Apply filters
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          candidate.name.toLowerCase().includes(searchLower) ||
          candidate.email.toLowerCase().includes(searchLower) ||
          candidate.role.toLowerCase().includes(searchLower) ||
          candidate.skills.some(skill => skill.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(candidate.status)) {
        return false;
      }

      // Match score filter
      if (candidate.matchScore < filters.matchScore[0] || candidate.matchScore > filters.matchScore[1]) {
        return false;
      }

      // Only new filter
      if (filters.onlyNew && candidate.status !== 'pending') {
        return false;
      }

      return true;
    });
  }, [candidates, filters]);

  // Mock KPI data
  const kpiData = {
    conversionRate: 23,
    avgResponseTime: 4,
    activeProposals: filteredCandidates.filter(c => ['pending', 'under_review'].includes(c.status)).length,
    totalReceived: candidates.length
  };

  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    if (updateProposalStatus) {
      await updateProposalStatus(candidateId, newStatus);
    }
  };

  const handleCandidateClick = (candidate: Candidate) => {
    setActiveCandidate(candidate);
  };

  const handleApprove = async () => {
    if (activeCandidate) {
      await handleStatusChange(activeCandidate.id, 'approved');
    }
  };

  const handleReject = async () => {
    if (activeCandidate) {
      await handleStatusChange(activeCandidate.id, 'rejected');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-kpi-bg flex items-center justify-center">
      <div className="text-lg">Caricamento...</div>
    </div>;
  }

  return (
    <DashboardLayout
      kpiData={kpiData}
      currentView={currentView}
      onViewChange={setCurrentView}
      onNewJobOffer={() => {}}
      showProposals={showProposals}
      onToggleSection={(section) => setShowProposals(section === 'proposals')}
    >
      <FilterBar filters={filters} onFiltersChange={setFilters} />
      
      <div className="flex h-[calc(100vh-280px)]">
        <div className="flex-1">
          <KanbanBoard
            candidates={filteredCandidates}
            onStatusChange={handleStatusChange}
            onCandidateClick={handleCandidateClick}
            activeCandidateId={activeCandidate?.id}
          />
        </div>
        
        <div className="w-2/5 border-l border-gray-200">
          <SidePanelCandidate
            candidate={activeCandidate}
            onClose={() => setActiveCandidate(null)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}