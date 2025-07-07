import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProposals } from "@/hooks/useProposals";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { cn } from "@/lib/utils";
import KanbanBoard from "./proposals/KanbanBoard";
import ProposalDetailPanel from "./proposals/ProposalDetailPanel";

export default function CompanyProposalsDashboard() {
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const { user } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { proposals, isLoading, updateProposalStatus, deleteProposal } = useProposals();

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!activeProposalId) return;

      const currentProposal = proposals.find(p => p.id === activeProposalId);
      if (!currentProposal) return;
      
      switch (event.key.toLowerCase()) {
        case "n":
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            updateProposalStatus?.(activeProposalId, 'pending');
          }
          break;
        case "v":
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            updateProposalStatus?.(activeProposalId, 'under_review');
          }
          break;
        case "a":
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            updateProposalStatus?.(activeProposalId, 'approved');
          }
          break;
        case "s":
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            updateProposalStatus?.(activeProposalId, 'rejected');
          }
          break;
        case "arrowup":
          event.preventDefault();
          const currentIndex = proposals.findIndex(p => p.id === activeProposalId);
          if (currentIndex > 0) {
            setActiveProposalId(proposals[currentIndex - 1].id);
          }
          break;
        case "arrowdown":
          event.preventDefault();
          const currentIndexDown = proposals.findIndex(p => p.id === activeProposalId);
          if (currentIndexDown < proposals.length - 1) {
            setActiveProposalId(proposals[currentIndexDown + 1].id);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProposalId, proposals, updateProposalStatus]);

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

  const handleStatusChange = async (proposalId: string, newStatus: string) => {
    if (updateProposalStatus) {
      await updateProposalStatus(proposalId, newStatus);
    }
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

  const activeProposal = proposals.find(p => p.id === activeProposalId);

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
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className={cn("flex h-screen", isMobile && "flex-col")}>
        {/* Kanban Board */}
        <div className={cn("bg-white border-r", isMobile ? "flex-1" : "w-2/5")}>
          <KanbanBoard
            proposals={proposals}
            onStatusChange={handleStatusChange}
            onProposalClick={handleProposalClick}
            selectedProposals={selectedProposals}
            onProposalSelect={handleProposalSelect}
            activeProposalId={activeProposalId}
          />
        </div>

        {/* Detail Panel */}
        <div className={cn(isMobile ? "flex-1" : "w-3/5")}>
          <ProposalDetailPanel
            proposal={activeProposal || null}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
}
