import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

export interface FilterState {
  search: string;
  statuses: string[];
  matchScore: [number, number];
  onlyNew: boolean;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

const statusOptions = [
  { value: 'pending', label: 'Nuove', color: 'bg-status-new' },
  { value: 'under_review', label: 'In valutazione', color: 'bg-status-review' },
  { value: 'approved', label: 'Approvate', color: 'bg-status-approved' },
  { value: 'rejected', label: 'Scartate', color: 'bg-status-rejected' },
];

export default function FilterBar({ filters, onFiltersChange, className }: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);
  
  // Debounce search input
  const debouncedSearch = useDebounce(localSearch, 250);
  
  // Update filters when debounced search changes
  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const handleStatusToggle = useCallback((status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.statuses, status]
      : filters.statuses.filter(s => s !== status);
    
    onFiltersChange({ ...filters, statuses: newStatuses });
  }, [filters, onFiltersChange]);

  const handleMatchScoreChange = useCallback((value: number[]) => {
    onFiltersChange({ ...filters, matchScore: [value[0], value[1]] });
  }, [filters, onFiltersChange]);

  const handleOnlyNewToggle = useCallback(() => {
    onFiltersChange({ ...filters, onlyNew: !filters.onlyNew });
  }, [filters, onFiltersChange]);

  const clearFilters = useCallback(() => {
    setLocalSearch('');
    onFiltersChange({
      search: '',
      statuses: [],
      matchScore: [0, 100],
      onlyNew: false
    });
  }, [onFiltersChange]);

  const activeFiltersCount = 
    filters.statuses.length + 
    (filters.matchScore[0] > 0 || filters.matchScore[1] < 100 ? 1 : 0) +
    (filters.onlyNew ? 1 : 0);

  return (
    <div className={cn("sticky top-32 z-40 bg-white border-b border-gray-200 px-6 py-4", className)}>
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cerca per nome, ruolo, skill..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Stato
              {filters.statuses.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                  {filters.statuses.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {statusOptions.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={filters.statuses.includes(status.value)}
                onCheckedChange={(checked) => handleStatusToggle(status.value, checked)}
              >
                <div className="flex items-center space-x-2">
                  <div className={cn("w-3 h-3 rounded-full", status.color)} />
                  <span>{status.label}</span>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Match Score Slider */}
        <div className="flex items-center space-x-3 min-w-[200px]">
          <span className="text-sm text-gray-600 whitespace-nowrap">Match:</span>
          <div className="flex-1">
            <Slider
              value={filters.matchScore}
              onValueChange={handleMatchScoreChange}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {filters.matchScore[0]}%-{filters.matchScore[1]}%
          </span>
        </div>

        {/* Only New Chip */}
        <Button
          variant={filters.onlyNew ? "default" : "outline"}
          size="sm"
          onClick={handleOnlyNewToggle}
        >
          Solo nuove
        </Button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Cancella ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  );
}