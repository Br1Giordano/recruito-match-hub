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
  salaryRange: [number, number];
  selectedCompanies: string[];
  uniqueLocations: string[];
  uniqueCompanies: string[];
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onEmploymentChange: (value: string) => void;
  onSalaryRangeChange: (value: [number, number]) => void;
  onCompanyToggle: (company: string) => void;
  onClearFilters: () => void;
  totalOffers: number;
  filteredCount: number;
}

export default function AdvancedJobFilters({
  searchTerm,
  locationFilter,
  employmentFilter,
  salaryRange,
  selectedCompanies,
  uniqueLocations,
  uniqueCompanies,
  onSearchChange,
  onLocationChange,
  onEmploymentChange,
  onSalaryRangeChange,
  onCompanyToggle,
  onClearFilters,
  totalOffers,
  filteredCount
}: AdvancedJobFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const activeFiltersCount = [
    locationFilter !== "all",
    employmentFilter !== "all",
    salaryRange[0] > 0 || salaryRange[1] < 200000,
    selectedCompanies.length > 0
  ].filter(Boolean).length;

  const employmentTypes = [
    { value: "full-time", label: "Tempo Pieno", icon: "💼" },
    { value: "part-time", label: "Part-time", icon: "⏰" },
    { value: "contract", label: "Contratto", icon: "📋" },
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

          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="h-10 border-2 hover:border-primary/50 transition-colors relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtri Avanzati
                {activeFiltersCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border-2 border-dashed border-muted rounded-lg bg-muted/20">
                {/* Salary Range */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-primary" />
                    <label className="text-sm font-medium">Range Stipendio</label>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={salaryRange}
                      onValueChange={onSalaryRangeChange}
                      min={0}
                      max={200000}
                      step={5000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>€{salaryRange[0].toLocaleString()}</span>
                      <span>€{salaryRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Companies */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <label className="text-sm font-medium">Aziende</label>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {uniqueCompanies.slice(0, 8).map((company) => (
                      <div key={company} className="flex items-center space-x-2">
                        <Checkbox
                          id={company}
                          checked={selectedCompanies.includes(company)}
                          onCheckedChange={() => onCompanyToggle(company)}
                        />
                        <label
                          htmlFor={company}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {company}
                        </label>
                      </div>
                    ))}
                    {uniqueCompanies.length > 8 && (
                      <p className="text-xs text-muted-foreground">
                        +{uniqueCompanies.length - 8} altre aziende...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

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
              <div className="flex gap-1">
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
                {(salaryRange[0] > 0 || salaryRange[1] < 200000) && (
                  <Badge variant="secondary" className="text-xs">
                    💰 €{salaryRange[0].toLocaleString()}-{salaryRange[1].toLocaleString()}
                  </Badge>
                )}
                {selectedCompanies.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    🏢 {selectedCompanies.length} aziende
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