import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CandidateCard, { Candidate } from "./CandidateCard";
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface KanbanBoardProps {
  candidates: Candidate[];
  onStatusChange: (candidateId: string, newStatus: string) => void;
  onCandidateClick: (candidate: Candidate) => void;
  activeCandidateId?: string;
  className?: string;
}

const columnConfig = [
  {
    id: 'pending',
    title: 'Nuove',
    color: 'bg-status-new',
    icon: AlertCircle,
    description: 'Candidature appena ricevute'
  },
  {
    id: 'under_review',
    title: 'In valutazione',
    color: 'bg-status-review',
    icon: Clock,
    description: 'Candidature in fase di valutazione'
  },
  {
    id: 'approved',
    title: 'Approvate',
    color: 'bg-status-approved',
    icon: CheckCircle,
    description: 'Candidature approvate per il colloquio'
  },
  {
    id: 'rejected',
    title: 'Scartate',
    color: 'bg-status-rejected',
    icon: XCircle,
    description: 'Candidature rifiutate'
  }
];

export default function KanbanBoard({
  candidates,
  onStatusChange,
  onCandidateClick,
  activeCandidateId,
  className
}: KanbanBoardProps) {
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Group candidates by status
  const candidatesByStatus = useMemo(() => {
    return candidates.reduce((acc, candidate) => {
      const status = candidate.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(candidate);
      return acc;
    }, {} as Record<string, Candidate[]>);
  }, [candidates]);

  const handleDragStart = (e: React.DragEvent, candidate: Candidate) => {
    setDraggedCandidate(candidate);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', candidate.id);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedCandidate && draggedCandidate.status !== columnId) {
      onStatusChange(draggedCandidate.id, columnId);
    }
    
    setDraggedCandidate(null);
  };

  const handleDragEnd = () => {
    setDraggedCandidate(null);
    setDragOverColumn(null);
  };

  return (
    <div className={cn("h-full bg-gray-50 p-6", className)}>
      <div className="flex space-x-6 h-full overflow-x-auto">
        {columnConfig.map((column) => {
          const columnCandidates = candidatesByStatus[column.id] || [];
          const IconComponent = column.icon;
          
          return (
            <div
              key={column.id}
              className={cn(
                "flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200",
                "transition-all duration-200",
                dragOverColumn === column.id && "ring-2 ring-blue-500 ring-offset-2"
              )}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={cn("w-3 h-3 rounded-full", column.color)} />
                    <h3 className="font-medium text-gray-900">{column.title}</h3>
                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                      {columnCandidates.length}
                    </Badge>
                  </div>
                  <IconComponent className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">{column.description}</p>
              </div>

              {/* Column Content */}
              <div className="p-4 space-y-3 h-full overflow-y-auto max-h-[calc(100vh-300px)]">
                {columnCandidates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <IconComponent className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">
                      Nessuna candidatura
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {column.id === 'pending' && 'Le nuove candidature appariranno qui'}
                      {column.id === 'under_review' && 'Trascina qui le candidature da valutare'}
                      {column.id === 'approved' && 'Le candidature approvate appariranno qui'}
                      {column.id === 'rejected' && 'Le candidature rifiutate appariranno qui'}
                    </p>
                  </div>
                ) : (
                  columnCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate)}
                      onDragEnd={handleDragEnd}
                    >
                      <CandidateCard
                        candidate={candidate}
                        onClick={() => onCandidateClick(candidate)}
                        isActive={candidate.id === activeCandidateId}
                        isDragging={draggedCandidate?.id === candidate.id}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}