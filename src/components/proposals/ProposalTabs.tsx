
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ProposalTabsProps {
  pendingProposals: any[];
  interestedProposals: any[];
  approvedProposals: any[];
  otherProposals: any[];
  onTabChange?: (value: string) => void;
  children: (proposals: any[], status: string) => React.ReactNode;
}

export default function ProposalTabs({ 
  pendingProposals, 
  interestedProposals, 
  approvedProposals,
  otherProposals, 
  onTabChange,
  children 
}: ProposalTabsProps) {
  return (
    <Tabs defaultValue="pending" onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="pending" className="flex items-center gap-2">
          <span className="flex items-center gap-2">
            📨 <span className="hidden sm:inline">Da visionare</span>
            <span className="sm:hidden">Nuove</span>
          </span>
          {pendingProposals.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {pendingProposals.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="interested" className="flex items-center gap-2">
          <span className="flex items-center gap-2">
            🔍 <span className="hidden sm:inline">In esame</span>
            <span className="sm:hidden">Esame</span>
          </span>
          {interestedProposals.length > 0 && (
            <Badge variant="default" className="ml-1 bg-amber-500">
              {interestedProposals.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="approved" className="flex items-center gap-2">
          <span className="flex items-center gap-2">
            ⭐ <span className="hidden sm:inline">Short-list</span>
            <span className="sm:hidden">Short</span>
          </span>
          {approvedProposals.length > 0 && (
            <Badge variant="default" className="ml-1 bg-emerald-500">
              {approvedProposals.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="other" className="flex items-center gap-2">
          <span className="flex items-center gap-2">
            <X className="h-4 w-4" /> <span className="hidden sm:inline">Chiuse</span>
            <span className="sm:hidden">Chiuse</span>
          </span>
          {otherProposals.length > 0 && (
            <Badge variant="outline" className="ml-1">
              {otherProposals.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending" className="mt-6">
        {children(pendingProposals, "pending")}
      </TabsContent>
      
      <TabsContent value="interested" className="mt-6">
        {children(interestedProposals, "interested")}
      </TabsContent>
      
      <TabsContent value="approved" className="mt-6">
        {children(approvedProposals, "approved")}
      </TabsContent>
      
      <TabsContent value="other" className="mt-6">
        {children(otherProposals, "other")}
      </TabsContent>
    </Tabs>
  );
}
