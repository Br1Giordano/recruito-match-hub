import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import KanbanColumn from "./KanbanColumn";

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

interface KanbanBoardProps {
  proposals: Proposal[];
  onStatusChange: (proposalId: string, newStatus: string) => void;
  onProposalClick: (proposalId: string) => void;
  activeProposalId: string | null;
}

const statusConfig = {
  pending: {
    label: "Nuove",
    color: "#0A84FF",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    textColor: "text-blue-800",
    icon: "🆕"
  },
  under_review: {
    label: "In valutazione",
    color: "#FF9F0A",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-500",
    textColor: "text-orange-800",
    icon: "📝"
  },
  approved: {
    label: "Approvate",
    color: "#34C759",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
    textColor: "text-green-800",
    icon: "✅"
  },
  rejected: {
    label: "Scartate",
    color: "#FF3B30",
    bgColor: "bg-red-50",
    borderColor: "border-red-500",
    textColor: "text-red-800",
    icon: "❌"
  }
};

export default function KanbanBoard({
  proposals,
  onStatusChange,
  onProposalClick,
  activeProposalId
}: KanbanBoardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter proposals based on search
  const filteredProposals = proposals.filter(proposal => {
    if (searchTerm === "") return true;
    
    const searchText = searchTerm.toLowerCase();
    return (
      proposal.candidate_name.toLowerCase().includes(searchText) ||
      proposal.recruiter_name?.toLowerCase().includes(searchText) ||
      proposal.job_offers?.title?.toLowerCase().includes(searchText)
    );
  });

  // Group proposals by status
  const groupedProposals = {
    pending: filteredProposals.filter(p => p.status === "pending"),
    under_review: filteredProposals.filter(p => p.status === "under_review"),
    approved: filteredProposals.filter(p => p.status === "approved"),
    rejected: filteredProposals.filter(p => p.status === "rejected")
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca candidato o recruiter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full bg-background p-6">
          <div className="flex gap-6 h-full overflow-x-auto">
            {Object.entries(statusConfig).map(([status, config]) => (
              <div 
                key={status}
                className="flex-shrink-0 w-80"
              >
                <KanbanColumn
                  status={status}
                  config={config}
                  proposals={groupedProposals[status as keyof typeof groupedProposals]}
                  onStatusChange={onStatusChange}
                  onProposalClick={onProposalClick}
                  activeProposalId={activeProposalId}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
