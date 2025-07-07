
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter } from "lucide-react";

interface ProposalFiltersBarProps {
  searchTerm: string;
  statusFilter: string;
  matchScoreFilter: number[];
  showOnlyNew: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMatchScoreChange: (value: number[]) => void;
  onShowOnlyNewChange: (checked: boolean) => void;
}

export default function ProposalFiltersBar({ 
  searchTerm, 
  statusFilter, 
  matchScoreFilter,
  showOnlyNew,
  onSearchChange, 
  onStatusChange,
  onMatchScoreChange,
  onShowOnlyNewChange
}: ProposalFiltersBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca candidato, skill o recruiter..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-48 h-10">
              <SelectValue placeholder="Tutti gli stati" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              <SelectItem value="pending">Nuove</SelectItem>
              <SelectItem value="under_review">In Screening</SelectItem>
              <SelectItem value="approved">Approvate</SelectItem>
              <SelectItem value="rejected">Scartate</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 min-w-32">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Match:</span>
            <Slider
              value={matchScoreFilter}
              onValueChange={onMatchScoreChange}
              max={100}
              step={5}
              className="w-20"
            />
            <span className="text-sm font-medium text-gray-900 min-w-8">
              {matchScoreFilter[0]}%
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="onlyNew"
              checked={showOnlyNew}
              onCheckedChange={onShowOnlyNewChange}
            />
            <label
              htmlFor="onlyNew"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Solo nuove
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
