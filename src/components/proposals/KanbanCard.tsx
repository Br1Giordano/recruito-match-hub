
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  isActive: boolean;
  onClick: () => void;
}

export default function KanbanCard({
  proposal,
  config,
  isActive,
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
        "p-3 cursor-pointer transition-all duration-150",
        isActive && "ring-2 ring-primary",
        isDragging && "opacity-50 scale-95",
        "hover:shadow-md"
      )}
      style={{
        borderLeft: `4px solid ${config.color}`
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
    >
      <div className="space-y-3">

        {/* Candidate Info */}
        <div>
          <h4 className="font-semibold text-foreground text-sm mb-1">
            {proposal.candidate_name}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                className="inline-flex px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
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
            ></div>
            <span className="text-xs font-medium text-foreground">{matchScore}%</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground truncate">
              {proposal.recruiter_name || "Recruiter"}
            </span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{recruiterRating.toFixed(1)}</span>
            <span>•</span>
            <span>{recruiterSuccessRate}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{daysSinceReceived}gg</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
