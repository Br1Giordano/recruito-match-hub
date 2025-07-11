import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProposals } from "@/hooks/useProposals";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Building2, Users, TrendingUp, Clock } from "lucide-react";
import KanbanBoard from "./proposals/KanbanBoard";
import ProposalDetailPanel from "./proposals/ProposalDetailPanel";

export default function CompanyProposalsDashboard() {
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null);

  const { user } = useAuth();
  const { proposals, isLoading, updateProposalStatus } = useProposals();

  const handleProposalClick = (proposalId: string) => {
    setActiveProposalId(proposalId);
  };

  const handleStatusChange = async (proposalId: string, newStatus: string) => {
    if (updateProposalStatus) {
      await updateProposalStatus(proposalId, newStatus);
    }
  };

  const handleApprove = async () => {
    if (activeProposalId && updateProposalStatus) {
      await updateProposalStatus(activeProposalId, 'approved');
    }
  };

  const handleReject = async () => {
    if (activeProposalId && updateProposalStatus) {
      await updateProposalStatus(activeProposalId, 'rejected');
    }
  };

  const activeProposal = proposals.find(p => p.id === activeProposalId);

  // Calcolo statistiche 
  const totalProposals = proposals.length;
  const approvedProposals = proposals.filter(p => p.status === 'approved').length;
  const underReviewProposals = proposals.filter(p => p.status === 'under_review').length;
  const avgResponseTime = 2.5; // Mock data - giorni medi di risposta
  const avgRating = 4.2; // Mock data - rating medio recruiter

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Caricamento proposte...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Accesso Negato</h3>
            <p className="text-gray-600">
              Devi essere autenticato come azienda per visualizzare le proposte.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Dashboard Azienda</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{avgRating}</span>
                <span className="text-muted-foreground">• {totalProposals} proposte ricevute</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistiche Performance */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Statistiche Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{totalProposals}</div>
              <div className="text-sm text-muted-foreground">Proposte Totali</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{underReviewProposals}</div>
              <div className="text-sm text-muted-foreground">In Valutazione</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{approvedProposals}</div>
              <div className="text-sm text-muted-foreground">Approvate</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-yellow-600">
                <Star className="w-6 h-6 fill-current" />
                {avgRating}
              </div>
              <div className="text-sm text-muted-foreground">Rating Medio</div>
            </div>
          </div>
        </Card>

        {/* Proposte */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Proposte Ricevute</h3>
              <KanbanBoard
                proposals={proposals}
                onStatusChange={handleStatusChange}
                onProposalClick={handleProposalClick}
                activeProposalId={activeProposalId}
              />
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            {activeProposal ? (
              <ProposalDetailPanel
                proposal={activeProposal}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ) : (
              <Card className="p-6 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Seleziona una proposta</h3>
                <p className="text-muted-foreground text-sm">
                  Clicca su una proposta per visualizzarne i dettagli
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
