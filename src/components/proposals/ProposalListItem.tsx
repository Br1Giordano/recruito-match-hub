
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

interface ProposalListItemProps {
  proposal: any;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (id: string) => void;
  isActive: boolean;
}

const getStatusBadge = (status: string) => {
  const statusMap = {
    pending: { label: "Nuova", color: "bg-blue-100 text-blue-800" },
    under_review: { label: "Screening", color: "bg-yellow-100 text-yellow-800" },
    interested: { label: "Colloquio", color: "bg-purple-100 text-purple-800" },
    rejected: { label: "Scartata", color: "bg-red-100 text-red-800" },
    accepted: { label: "Offerta", color: "bg-green-100 text-green-800" },
  };
  
  return statusMap[status as keyof typeof statusMap] || statusMap.pending;
};

const getMatchScore = (proposal: any) => {
  let score = 50;
  if (proposal.years_experience) score += Math.min(proposal.years_experience * 5, 25);
  if (proposal.expected_salary && proposal.current_salary) {
    const salaryIncrease = ((proposal.expected_salary - proposal.current_salary) / proposal.current_salary) * 100;
    if (salaryIncrease < 20) score += 15;
  }
  if (proposal.availability_weeks && proposal.availability_weeks <= 4) score += 10;
  return Math.min(score, 100);
};

const getMatchScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
};

export default function ProposalListItem({ 
  proposal, 
  isSelected, 
  onSelect, 
  onApprove, 
  onReject, 
  onViewDetails,
  isActive 
}: ProposalListItemProps) {
  const statusBadge = getStatusBadge(proposal.status);
  const matchScore = getMatchScore(proposal);
  const matchColor = getMatchScoreColor(matchScore);
  const createdAt = formatDistanceToNow(new Date(proposal.created_at), { 
    addSuffix: true, 
    locale: it 
  });

  // Simula skill del candidato
  const skills = ["React", "TypeScript", "Node.js"];
  
  return (
    <div 
      className={`h-[120px] border rounded-lg p-4 cursor-pointer transition-all hover:border-blue-500 hover:shadow-sm ${
        isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
      }`}
      onClick={() => onViewDetails(proposal.id)}
    >
      <div className="flex h-full">
        {/* Checkbox */}
        <div className="flex items-start pt-1 mr-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(proposal.id, !!checked)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        {/* Contenuto principale */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Header con stato e match score */}
          <div className="flex items-center justify-between mb-2">
            <Badge className={statusBadge.color}>
              {statusBadge.label}
            </Badge>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${matchColor}`}>
              {matchScore}%
            </div>
          </div>

          {/* Linea 1: Nome candidato - Ruolo - Seniority */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 truncate text-sm">
              {proposal.candidate_name} • {proposal.job_offers?.title || 'Posizione non specificata'} • {proposal.years_experience || 0} anni
            </h3>
          </div>

          {/* Linea 2: Skills + disponibilità */}
          <div className="flex flex-wrap gap-1 mb-2">
            {skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs px-2 py-0">
                {skill}
              </Badge>
            ))}
            {proposal.availability_weeks && (
              <Badge variant="outline" className="text-xs flex items-center gap-1 px-2 py-0">
                <Clock className="w-3 h-3" />
                {proposal.availability_weeks}w
              </Badge>
            )}
          </div>

          {/* Footer: Recruiter info + data */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">{proposal.recruiter_name}</span>
              <div className="flex items-center">
                <Star className="w-3 h-3 fill-current text-yellow-400" />
                <span className="ml-1">4.8</span>
              </div>
              <span className="text-green-600">85% chiuse</span>
            </div>
            <span>{createdAt}</span>
          </div>
        </div>

        {/* Azioni rapide */}
        <div className="flex flex-col gap-1 ml-3">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs h-7"
            onClick={(e) => {
              e.stopPropagation();
              onApprove(proposal.id);
            }}
            disabled={proposal.status === 'accepted'}
          >
            Approva
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="px-2 py-1 text-xs h-7"
            onClick={(e) => {
              e.stopPropagation();
              onReject(proposal.id);
            }}
            disabled={proposal.status === 'rejected'}
          >
            Rifiuta
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="px-2 py-1 text-xs h-7"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(proposal.id);
            }}
          >
            Dettagli
          </Button>
        </div>
      </div>
    </div>
  );
}
