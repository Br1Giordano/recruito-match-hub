import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  role: string;
  seniority: string;
  skills: string[];
  matchScore: number;
  recruiterName?: string;
  recruiterRating?: number;
  recruiterCompletionRate?: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
  isActive?: boolean;
  isDragging?: boolean;
}

const statusConfig = {
  pending: { color: 'border-l-status-new', label: 'Nuova' },
  under_review: { color: 'border-l-status-review', label: 'In valutazione' },
  approved: { color: 'border-l-status-approved', label: 'Approvata' },
  rejected: { color: 'border-l-status-rejected', label: 'Scartata' },
};

const getMatchScoreColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours}h fa`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}gg fa`;
};

export default function CandidateCard({ 
  candidate, 
  onClick, 
  isActive = false,
  isDragging = false 
}: CandidateCardProps) {
  const statusInfo = statusConfig[candidate.status];
  const timeAgo = formatTimeAgo(candidate.updatedAt);

  return (
    <div
      onClick={onClick}
      className={cn(
        "group bg-white rounded-lg border-l-4 p-4 cursor-pointer transition-all duration-150",
        statusInfo.color,
        "hover:shadow-sm hover:transform hover:-translate-y-0.5",
        isActive && "ring-2 ring-blue-500 ring-offset-2",
        isDragging && "opacity-50 transform rotate-2"
      )}
      style={{ height: '120px' }}
      role="button"
      tabIndex={0}
      aria-label={`Candidatura di ${candidate.name} per ${candidate.role}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Header Line */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
            {candidate.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {candidate.seniority} • {candidate.role}
          </p>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            getMatchScoreColor(candidate.matchScore)
          )} />
          <span className="text-xs font-medium text-gray-600">
            {candidate.matchScore}%
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {candidate.skills.slice(0, 3).map((skill, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700"
          >
            {skill}
          </Badge>
        ))}
        {candidate.skills.length > 3 && (
          <Badge 
            variant="secondary" 
            className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600"
          >
            +{candidate.skills.length - 3}
          </Badge>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {candidate.recruiterName && (
            <div className="flex items-center space-x-1">
              <span className="truncate max-w-20">
                {candidate.recruiterName}
              </span>
              {candidate.recruiterRating && (
                <div className="flex items-center">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="ml-0.5">{candidate.recruiterRating.toFixed(1)}</span>
                </div>
              )}
              {candidate.recruiterCompletionRate && (
                <span>• {candidate.recruiterCompletionRate}%</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}