
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
  activeProposalId: string | null;
}

export default function KanbanColumn({
  status,
  config,
  proposals,
  onStatusChange,
  onProposalClick,
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
        "flex flex-col h-full bg-card rounded-lg border transition-all duration-150",
        isDragOver ? "border-primary bg-primary/5" : "border-border"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <h3 className="font-semibold text-foreground">{config.label}</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {proposals.length}
          </Badge>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {proposals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Nessuna candidatura</p>
          </div>
        ) : (
          proposals.map((proposal) => (
            <KanbanCard
              key={proposal.id}
              proposal={proposal}
              config={config}
              isActive={activeProposalId === proposal.id}
              onClick={() => onProposalClick(proposal.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
