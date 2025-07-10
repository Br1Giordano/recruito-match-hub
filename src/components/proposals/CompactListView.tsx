
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
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

interface CompactListViewProps {
  groupedProposals: {
    pending: Proposal[];
    under_review: Proposal[];
    approved: Proposal[];
    rejected: Proposal[];
  };
  statusConfig: Record<string, StatusConfig>;
  onStatusChange: (proposalId: string, newStatus: string) => void;
  onProposalClick: (proposalId: string) => void;
  selectedProposals: string[];
  onProposalSelect: (proposalId: string, checked: boolean) => void;
  activeProposalId: string | null;
}

export default function CompactListView({
  groupedProposals,
  statusConfig,
  onStatusChange,
  onProposalClick,
  selectedProposals,
  onProposalSelect,
  activeProposalId
}: CompactListViewProps) {
  const [openSections, setOpenSections] = useState({
    pending: true,
    under_review: true,
    approved: true,
    rejected: true
  });

  const toggleSection = (status: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {Object.entries(statusConfig).map(([status, config]) => {
        const proposals = groupedProposals[status as keyof typeof groupedProposals];
        const isOpen = openSections[status as keyof typeof openSections];
        
        return (
          <Card key={status} className="overflow-hidden">
            <Collapsible
              open={isOpen}
              onOpenChange={() => toggleSection(status as keyof typeof openSections)}
            >
              <CollapsibleTrigger asChild>
                <div 
                  className={cn(
                    "w-full p-4 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity",
                    config.bgColor
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{config.icon}</span>
                    <h3 className={cn("font-semibold text-lg", config.textColor)}>
                      {config.label}
                    </h3>
                    <span className={cn("text-sm px-2 py-1 rounded-full", config.textColor, "bg-white/50")}>
                      {proposals.length}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className={cn("h-5 w-5", config.textColor)} />
                  ) : (
                    <ChevronDown className={cn("h-5 w-5", config.textColor)} />
                  )}
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-4 space-y-3 bg-gray-50">
                  {proposals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">Nessuna candidatura in questo stato</p>
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
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}
