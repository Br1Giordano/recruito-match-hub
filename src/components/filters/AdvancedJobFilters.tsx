import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, MapPin, Euro, Briefcase, Building2, RotateCcw } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AdvancedJobFiltersProps {
  searchTerm: string;
  locationFilter: string;
  employmentFilter: string;
  sectorFilter: string;
  uniqueLocations: string[];
  uniqueSectors: string[];
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onEmploymentChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  onClearFilters: () => void;
  totalOffers: number;
  filteredCount: number;
}

export default function AdvancedJobFilters({
  searchTerm,
  locationFilter,
  employmentFilter,
  sectorFilter,
  uniqueLocations,
  uniqueSectors,
  onSearchChange,
  onLocationChange,
  onEmploymentChange,
  onSectorChange,
  onClearFilters,
  totalOffers,
  filteredCount
}: AdvancedJobFiltersProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  const activeFiltersCount = [
    locationFilter !== "all",
    employmentFilter !== "all",
    sectorFilter !== "all"
  ].filter(Boolean).length;

  const employmentTypes = [
    { value: "full-time", label: "Tempo Pieno", icon: "💼" },
    { value: "part-time", label: "Part-time", icon: "⏰" },
    { value: "contract", label: "Contratto", icon: "📋" },
    { value: "contratto-progetto", label: "Contratto Progetto", icon: "📋" },
    { value: "tempo-indeterminato", label: "Tempo Indeterminato", icon: "🏢" },
    { value: "internship", label: "Stage", icon: "🎓" }
  ];

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/30">
      <CardContent className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className={`flex items-center transition-all duration-200 ${
            searchFocused ? 'transform scale-[1.02]' : ''
          }`}>
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
              searchFocused ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <Input
              placeholder="Cerca per titolo, azienda, descrizione, skills..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`pl-12 pr-4 h-12 text-base border-2 transition-all duration-200 ${
                searchFocused 
                  ? 'border-primary shadow-md ring-4 ring-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => onSearchChange("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Filters Row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Settore Filter */}
          <Select value={sectorFilter} onValueChange={onSectorChange}>
            <SelectTrigger className="w-auto min-w-[140px] h-10 bg-background border-2 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Settore" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Tutti i settori
                </div>
              </SelectItem>
              {uniqueSectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {sector}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select value={locationFilter} onValueChange={onLocationChange}>
            <SelectTrigger className="w-auto min-w-[140px] h-10 bg-background border-2 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Sede" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Tutte le sedi
                </div>
              </SelectItem>
              {uniqueLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {location}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Employment Type Filter */}
          <Select value={employmentFilter} onValueChange={onEmploymentChange}>
            <SelectTrigger className="w-auto min-w-[140px] h-10 bg-background border-2 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Contratto" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Tutti i tipi
                </div>
              </SelectItem>
              {employmentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <span>{type.icon}</span>
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="h-10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm border-t pt-4">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              {filteredCount === totalOffers 
                ? `${totalOffers} posizioni totali`
                : `${filteredCount} di ${totalOffers} posizioni`
              }
            </span>
            {activeFiltersCount > 0 && (
              <div className="flex gap-1 flex-wrap">
                {sectorFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    🏢 {sectorFilter}
                  </Badge>
                )}
                {locationFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    📍 {locationFilter}
                  </Badge>
                )}
                {employmentFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    💼 {employmentTypes.find(t => t.value === employmentFilter)?.label}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {searchTerm && (
            <div className="text-primary text-xs font-medium">
              🔍 "{searchTerm}"
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}