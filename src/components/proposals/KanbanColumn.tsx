
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import KanbanCard from "./KanbanCard";

interface Proposal {
  id: string;
  candidate_name: string;
  candidate_email: string;
  proposal_description: string;
  years_experience?: number;
  expected_salary?: number;
  status: string;
  created_at: string;
  recruiter_name?: string;
  job_offers?: {
    title: string;
  };
}

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
}

interface KanbanColumnProps {
  status: string;
  config: StatusConfig;
  proposals: Proposal[];
  onStatusChange: (proposalId: string, newStatus: string) => void;
  onProposalClick: (proposalId: string) => void;
  selectedProposals: string[];
  onProposalSelect: (proposalId: string, checked: boolean) => void;
  activeProposalId: string | null;
}

export default function KanbanColumn({
  status,
  config,
  proposals,
  onStatusChange,
  onProposalClick,
  selectedProposals,
  onProposalSelect,
  activeProposalId
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const proposalId = e.dataTransfer.getData("text/plain");
    if (proposalId) {
      onStatusChange(proposalId, status);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white rounded-lg shadow-sm border-2 transition-all duration-150",
        "box-border min-h-full",
        isDragOver ? "border-blue-300 bg-blue-50" : "border-gray-200"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-label={`Colonna ${config.label}`}
    >
      {/* Column Header */}
      <div className={cn("p-4 border-b rounded-t-lg", config.bgColor)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-label={config.label}>{config.icon}</span>
            <h3 className={cn("font-semibold", config.textColor)}>{config.label}</h3>
          </div>
          <Badge 
            variant="secondary" 
            className={cn("text-xs", config.textColor)}
            aria-label={`${proposals.length} candidature`}
          >
            {proposals.length}
          </Badge>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {proposals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Nessuna candidatura</p>
          </div>
        ) : (
          proposals.map((proposal) => (
            <KanbanCard
              key={proposal.id}
              proposal={proposal}
              config={config}
              isSelected={selectedProposals.includes(proposal.id)}
              isActive={activeProposalId === proposal.id}
              onSelect={(checked) => onProposalSelect(proposal.id, checked)}
              onClick={() => onProposalClick(proposal.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
