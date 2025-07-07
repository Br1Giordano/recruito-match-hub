
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, MapPin, Clock, Target } from "lucide-react";
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
    pending: { label: "Nuova", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
    under_review: { label: "Screening", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
    interested: { label: "Intervista", variant: "outline" as const, color: "bg-purple-100 text-purple-800" },
    rejected: { label: "Scartata", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
    accepted: { label: "Offerta", variant: "default" as const, color: "bg-green-100 text-green-800" },
  };
  
  return statusMap[status as keyof typeof statusMap] || statusMap.pending;
};

const getMatchScore = (proposal: any) => {
  // Calcola un punteggio di match basato sui dati disponibili
  let score = 50; // Base score
  
  if (proposal.years_experience) score += Math.min(proposal.years_experience * 5, 25);
  if (proposal.expected_salary && proposal.current_salary) {
    const salaryIncrease = ((proposal.expected_salary - proposal.current_salary) / proposal.current_salary) * 100;
    if (salaryIncrease < 20) score += 15; // Aspettative ragionevoli
  }
  if (proposal.availability_weeks && proposal.availability_weeks <= 4) score += 10;
  
  return Math.min(score, 100);
};

const getMatchScoreColor = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
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
      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
      }`}
      onClick={() => onViewDetails(proposal.id)}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(proposal.id, !!checked)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          {/* Header con stato e match score */}
          <div className="flex items-center justify-between mb-2">
            <Badge className={statusBadge.color}>
              {statusBadge.label}
            </Badge>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${matchColor}`} title={`Match: ${matchScore}%`} />
              <span className="text-sm text-gray-500">{matchScore}%</span>
            </div>
          </div>

          {/* Headline principale */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {proposal.candidate_name}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {proposal.job_offers?.title} • {proposal.years_experience || 0} anni exp
            </p>
          </div>

          {/* Skills e info rapide */}
          <div className="flex flex-wrap gap-1 mb-2">
            {skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {proposal.availability_weeks && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {proposal.availability_weeks}w
              </Badge>
            )}
          </div>

          {/* Recruiter info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span>{proposal.recruiter_name}</span>
              <div className="flex items-center">
                <Star className="w-3 h-3 fill-current text-yellow-400" />
                <span className="ml-1">4.8</span>
              </div>
              <span className="text-green-600">•85% chiuse</span>
            </div>
            <div className="flex items-center gap-2">
              <span>€{proposal.expected_salary?.toLocaleString() || 'N/A'}</span>
              <span>•</span>
              <span>{createdAt}</span>
            </div>
          </div>

          {/* Fee info */}
          {proposal.recruiter_fee_percentage && proposal.expected_salary && (
            <div className="mt-2 text-xs text-gray-600">
              Success fee {proposal.recruiter_fee_percentage}% ≈ €{Math.round((proposal.expected_salary * proposal.recruiter_fee_percentage) / 100 / 1000)}k
            </div>
          )}
        </div>

        {/* Azioni rapide */}
        <div className="flex flex-col gap-1 ml-2">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs"
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
            className="px-3 py-1 text-xs"
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
            className="px-3 py-1 text-xs"
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
