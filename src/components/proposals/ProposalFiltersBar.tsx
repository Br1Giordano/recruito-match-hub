
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

interface ProposalFiltersBarProps {
  searchTerm: string;
  statusFilter: string;
  matchScoreRange: [number, number];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMatchScoreChange: (range: [number, number]) => void;
  onClearFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function ProposalFiltersBar({
  searchTerm,
  statusFilter,
  matchScoreRange,
  onSearchChange,
  onStatusChange,
  onMatchScoreChange,
  onClearFilters,
  totalCount,
  filteredCount
}: ProposalFiltersBarProps) {
  const hasActiveFilters = searchTerm || statusFilter !== 'all' || matchScoreRange[0] > 0 || matchScoreRange[1] < 100;

  return (
    <div className="bg-white border-b p-4 space-y-3">
      {/* Ricerca principale */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cerca per nome candidato, skills, recruiter..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Stato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti gli stati</SelectItem>
            <SelectItem value="pending">Nuove</SelectItem>
            <SelectItem value="under_review">Screening</SelectItem>
            <SelectItem value="interested">Intervista</SelectItem>
            <SelectItem value="accepted">Offerta</SelectItem>
            <SelectItem value="rejected">Scartate</SelectItem>
          </SelectContent>
        </Select>

        <Select value={`${matchScoreRange[0]}-${matchScoreRange[1]}`} onValueChange={(value) => {
          const [min, max] = value.split('-').map(Number);
          onMatchScoreChange([min, max]);
        }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Match Score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-100">Tutti i match</SelectItem>
            <SelectItem value="80-100">Eccellente (80-100%)</SelectItem>
            <SelectItem value="60-79">Buono (60-79%)</SelectItem>
            <SelectItem value="40-59">Medio (40-59%)</SelectItem>
            <SelectItem value="0-39">Basso (0-39%)</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="w-4 h-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Contatori e filtri attivi */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Mostrando {filteredCount} di {totalCount} proposte
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Filtri attivi:</span>
            {searchTerm && (
              <Badge variant="secondary" className="text-xs">
                Ricerca: {searchTerm}
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Stato: {statusFilter}
              </Badge>
            )}
            {(matchScoreRange[0] > 0 || matchScoreRange[1] < 100) && (
              <Badge variant="secondary" className="text-xs">
                Match: {matchScoreRange[0]}-{matchScoreRange[1]}%
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
