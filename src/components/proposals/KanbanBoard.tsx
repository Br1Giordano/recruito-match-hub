import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, List, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import KanbanColumn from "./KanbanColumn";
import CompactListView from "./CompactListView";

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
  selectedProposals: string[];
  onProposalSelect: (proposalId: string, checked: boolean) => void;
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
  selectedProposals,
  onProposalSelect,
  activeProposalId
}: KanbanBoardProps) {
  const [isCompactView, setIsCompactView] = useState(window.innerWidth <= 640);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleStatuses, setVisibleStatuses] = useState({
    pending: true,
    under_review: true,
    approved: true,
    rejected: true
  });

  // Filter proposals based on search and visible statuses
  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = searchTerm === "" || 
      proposal.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.recruiter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.job_offers?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusVisible = visibleStatuses[proposal.status as keyof typeof visibleStatuses];
    
    return matchesSearch && statusVisible;
  });

  // Group proposals by status
  const groupedProposals = {
    pending: filteredProposals.filter(p => p.status === "pending"),
    under_review: filteredProposals.filter(p => p.status === "under_review"),
    approved: filteredProposals.filter(p => p.status === "approved"),
    rejected: filteredProposals.filter(p => p.status === "rejected")
  };

  const handleStatusToggle = (status: keyof typeof visibleStatuses) => {
    setVisibleStatuses(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls Header */}
      <div className="bg-white border-b p-4 space-y-4 sticky top-0 z-10">
        {/* View Toggle & Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <Switch
                checked={isCompactView}
                onCheckedChange={setIsCompactView}
                className="scale-90"
              />
              <List className="h-4 w-4" />
              <span className="text-sm text-gray-600">Lista compatta</span>
            </div>
          </div>
          
          <div className="relative w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cerca candidato, recruiter o posizione..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filters - Grid Layout */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Mostra solo:</span>
          <div style={{ display: 'grid', gridAutoFlow: 'column', gap: '12px' }}>
            {Object.entries(statusConfig).map(([status, config]) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={status}
                  checked={visibleStatuses[status as keyof typeof visibleStatuses]}
                  onCheckedChange={() => handleStatusToggle(status as keyof typeof visibleStatuses)}
                />
                <label
                  htmlFor={status}
                  className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-1"
                >
                  <span aria-label={config.label}>{config.icon}</span>
                  {config.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {isCompactView ? (
          <CompactListView
            groupedProposals={groupedProposals}
            statusConfig={statusConfig}
            onStatusChange={onStatusChange}
            onProposalClick={onProposalClick}
            selectedProposals={selectedProposals}
            onProposalSelect={onProposalSelect}
            activeProposalId={activeProposalId}
          />
        ) : (
          <div className="h-full bg-[#F8FAFC] p-6">
            <div 
              className="flex gap-6 h-full overflow-x-auto kanban-scrollbar"
            >
              {Object.entries(statusConfig).map(([status, config]) => (
                <div 
                  key={status}
                  className="flex-shrink-0"
                  style={{ 
                    minWidth: '280px', 
                    maxWidth: '320px',
                    boxSizing: 'border-box'
                  }}
                >
                  <KanbanColumn
                    status={status}
                    config={config}
                    proposals={groupedProposals[status as keyof typeof groupedProposals]}
                    onStatusChange={onStatusChange}
                    onProposalClick={onProposalClick}
                    selectedProposals={selectedProposals}
                    onProposalSelect={onProposalSelect}
                    activeProposalId={activeProposalId}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .kanban-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        
        .kanban-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .kanban-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }
        
        .kanban-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
        
        .kanban-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #CBD5E1 transparent;
        }
      `}</style>
    </div>
  );
}
