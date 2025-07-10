import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProposals } from "@/hooks/useProposals";
import KanbanBoard from "./proposals/KanbanBoard";
import ProposalDetailPanel from "./proposals/ProposalDetailPanel";

export default function CompanyProposalsDashboard() {
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null);

  const { user } = useAuth();
  const { proposals, isLoading, updateProposalStatus } = useProposals();

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
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Kanban Board */}
        <div className="bg-card border-r w-2/5">
          <KanbanBoard
            proposals={proposals}
            onStatusChange={handleStatusChange}
            onProposalClick={handleProposalClick}
            activeProposalId={activeProposalId}
          />
        </div>

        {/* Detail Panel */}
        <div className="w-3/5">
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
