
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useRecruiterProposals } from "@/hooks/useRecruiterProposals";
import { useMessages } from "@/hooks/useMessages";
import ProposalFilters from "./proposals/ProposalFilters";
import CompactRecruiterProposalCard from "./proposals/CompactRecruiterProposalCard";
import EmptyProposalsState from "./proposals/EmptyProposalsState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecruiterGamificationDashboard from "./gamification/RecruiterGamificationDashboard";
import LeaderboardCard from "./gamification/LeaderboardCard";
import { useRecruiterGamification } from "@/hooks/useRecruiterGamification";
import { RecruiterMessagesSection } from "./messaging/RecruiterMessagesSection";
import { Target, Trophy, Send, MessageCircle } from "lucide-react";

export default function RecruiterDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);
  const { user } = useAuth();
  const { proposals, isLoading } = useRecruiterProposals();
  const { unreadCount } = useMessages();
  const { leaderboard, loading: leaderboardLoading } = useRecruiterGamification();

  useEffect(() => {
    let filtered = proposals;

    if (searchTerm) {
      filtered = filtered.filter(
        (proposal) =>
          proposal.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.job_offers?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.job_offers?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((proposal) => proposal.status === statusFilter);
    }

    setFilteredProposals(filtered);
  }, [searchTerm, statusFilter, proposals]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Caricamento proposte...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Devi essere autenticato per visualizzare le proposte</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Recruiter</h1>
          <p className="text-muted-foreground">
            Gestisci le tue candidature e monitora i tuoi progressi
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Vedi Classifica
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Classifica Recruiter
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {leaderboardLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-lg">Caricamento classifica...</div>
                </div>
              ) : (
                <LeaderboardCard 
                  leaderboard={leaderboard} 
                  currentUserEmail={user?.email}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="proposals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proposals" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Le Mie Candidature
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2 relative">
            <MessageCircle className="h-4 w-4" />
            Messaggi
            {unreadCount > 0 && (
              <Badge
                variant="default"
                className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Livelli & Badge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <ProposalFilters
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            {filteredProposals.length === 0 ? (
              <div className="xl:col-span-2">
                <EmptyProposalsState type="recruiter" hasProposals={proposals.length > 0} />
              </div>
            ) : (
              filteredProposals.map((proposal) => (
                <CompactRecruiterProposalCard key={proposal.id} proposal={proposal} />
              ))
            )}
          </div>
        </TabsContent>


        <TabsContent value="messages">
          <RecruiterMessagesSection />
        </TabsContent>

        <TabsContent value="gamification">
          <RecruiterGamificationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
