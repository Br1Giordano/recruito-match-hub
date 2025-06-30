
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface ProposalFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function ProposalFilters({ 
  searchTerm, 
  statusFilter, 
  onSearchChange, 
  onStatusChange 
}: ProposalFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per candidato, recruiter o posizione..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Filtra per stato" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tutti gli stati</SelectItem>
          <SelectItem value="pending">In Attesa</SelectItem>
          <SelectItem value="under_review">In Revisione</SelectItem>
          <SelectItem value="approved">Approvata</SelectItem>
          <SelectItem value="rejected">Rifiutata</SelectItem>
          <SelectItem value="hired">Assunto</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
