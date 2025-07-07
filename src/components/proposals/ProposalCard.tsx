
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalCardProps {
  proposal: {
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
  };
  isSelected: boolean;
  isActive: boolean;
  matchScore: number;
  recruiterRating: number;
  recruiterSuccessRate: number;
  onSelect: (checked: boolean) => void;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export default function ProposalCard({ 
  proposal, 
  isSelected,
  isActive,
  matchScore,
  recruiterRating,
  recruiterSuccessRate,
  onSelect,
  onClick,
  onKeyDown
}: ProposalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Nuova";
      case "under_review":
        return "Screening";
      case "approved":
        return "Approvata";
      case "rejected":
        return "Scartata";
      default:
        return status;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getSeniorityLevel = (experience?: number) => {
    if (!experience) return "Junior";
    if (experience < 3) return "Junior";
    if (experience < 7) return "Mid";
    return "Senior";
  };

  const getTopSkills = (description: string) => {
    // Simulazione estrazione skill dal description
    const skills = ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"];
    return skills.slice(0, 3);
  };

  const daysSinceReceived = Math.floor(
    (new Date().getTime() - new Date(proposal.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card 
      className={cn(
        "relative h-28 p-4 cursor-pointer transition-all duration-150 border bg-white rounded-lg",
        isActive && "ring-2 ring-[#0A84FF] border-[#0A84FF]",
        "hover:border-[#0A84FF] hover:shadow-md"
      )}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div className="flex items-start gap-3 h-full">
        {/* Checkbox */}
        <div className="pt-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Nome, Ruolo, Seniority */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{proposal.candidate_name}</h3>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-600 truncate">{proposal.job_offers?.title || "Posizione"}</span>
              <span className="text-gray-500">•</span>
              <span className="text-sm font-medium text-gray-700">{getSeniorityLevel(proposal.years_experience)}</span>
            </div>
            
            <Badge className={cn("text-xs px-2 py-1 border", getStatusColor(proposal.status))}>
              {getStatusText(proposal.status)}
            </Badge>
          </div>

          {/* Row 2: Skills + Match Score */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              {getTopSkills(proposal.proposal_description).map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-1 ml-auto">
              <div className={cn("w-2 h-2 rounded-full", getMatchScoreColor(matchScore))}></div>
              <span className="text-sm font-medium text-gray-900">{matchScore}%</span>
            </div>
          </div>

          {/* Footer: Recruiter info + Data */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-700">{proposal.recruiter_name || "Recruiter"}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{recruiterRating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{recruiterSuccessRate}% posizioni chiuse</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Ricevuta {daysSinceReceived}gg fa</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
