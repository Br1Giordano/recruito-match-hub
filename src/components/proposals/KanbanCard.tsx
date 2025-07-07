
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface KanbanCardProps {
  proposal: Proposal;
  config: StatusConfig;
  isSelected: boolean;
  isActive: boolean;
  onSelect: (checked: boolean) => void;
  onClick: () => void;
}

export default function KanbanCard({
  proposal,
  config,
  isSelected,
  isActive,
  onSelect,
  onClick
}: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", proposal.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getSeniorityLevel = (experience?: number) => {
    if (!experience) return "Junior";
    if (experience < 3) return "Junior";
    if (experience < 7) return "Mid";
    return "Senior";
  };

  const getTopSkills = (description: string) => {
    const skills = ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"];
    return skills.slice(0, 3);
  };

  const daysSinceReceived = Math.floor(
    (new Date().getTime() - new Date(proposal.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const matchScore = Math.floor(Math.random() * 40) + 60; // 60-100%
  const recruiterRating = Math.random() * 2 + 3; // 3-5 stars
  const recruiterSuccessRate = Math.floor(Math.random() * 30) + 70; // 70-100%

  return (
    <Card
      className={cn(
        "p-3 cursor-pointer transition-all duration-150 rounded-lg",
        "box-border min-h-fit",
        isActive && "shadow-md",
        isDragging && "opacity-50 scale-95",
        "hover:shadow-md focus-within:shadow-md"
      )}
      style={{
        borderLeft: `4px solid ${config.color}`,
        backgroundColor: isActive ? `${config.color}10` : '#FFFFFF'
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = `${config.color}10`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = '#FFFFFF';
        }
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px ${config.color}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = '';
      }}
      tabIndex={0}
      role="button"
      aria-label={`Candidatura di ${proposal.candidate_name} - ${config.label}`}
    >
      <div className="space-y-3">
        {/* Header with checkbox and badge */}
        <div className="flex items-start justify-between">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            className="mt-1"
            aria-label={`Seleziona candidatura di ${proposal.candidate_name}`}
          />
          <Badge 
            className={cn("text-xs", config.textColor, config.bgColor)}
            aria-label={`Stato: ${config.label}`}
          >
            {config.label}
          </Badge>
        </div>

        {/* Candidate Info */}
        <div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1">
            {proposal.candidate_name}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>{proposal.job_offers?.title || "Posizione"}</span>
            <span>•</span>
            <span className="font-medium">{getSeniorityLevel(proposal.years_experience)}</span>
          </div>
        </div>

        {/* Skills and Match Score */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {getTopSkills(proposal.proposal_description).map((skill, index) => (
              <span 
                key={index} 
                className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <div 
              className={cn(
                "w-2 h-2 rounded-full",
                matchScore >= 80 ? "bg-green-500" : matchScore >= 60 ? "bg-yellow-500" : "bg-red-500"
              )}
              aria-label={`Match score: ${matchScore}%`}
            ></div>
            <span className="text-xs font-medium text-gray-900">{matchScore}%</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-700 truncate">
              {proposal.recruiter_name || "Recruiter"}
            </span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            <span>{recruiterRating.toFixed(1)}</span>
            <span>•</span>
            <span>{recruiterSuccessRate}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            <span>{daysSinceReceived}gg</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
