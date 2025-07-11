import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProposals } from "@/hooks/useProposals";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Building2, Users, ChevronLeft, ChevronRight, List } from "lucide-react";
import ProposalSimpleView from "./proposals/ProposalSimpleView";

export default function CompanyProposalsDashboard() {
  const [currentProposalIndex, setCurrentProposalIndex] = useState(0);

  const { user } = useAuth();
  const { proposals, isLoading, updateProposalStatus } = useProposals();

  const handleStatusChange = async (proposalId: string, newStatus: string) => {
    if (updateProposalStatus) {
      await updateProposalStatus(proposalId, newStatus);
    }
  };

  const handleApprove = async () => {
    const currentProposal = proposals[currentProposalIndex];
    if (currentProposal && updateProposalStatus) {
      await updateProposalStatus(currentProposal.id, 'approved');
    }
  };

  const handleReject = async () => {
    const currentProposal = proposals[currentProposalIndex];
    if (currentProposal && updateProposalStatus) {
      await updateProposalStatus(currentProposal.id, 'rejected');
    }
  };

  const handleStartReview = async () => {
    const currentProposal = proposals[currentProposalIndex];
    if (currentProposal && updateProposalStatus) {
      await updateProposalStatus(currentProposal.id, 'under_review');
    }
  };

  const handleViewRecruiterProfile = () => {
    // TODO: Implement recruiter profile view
    console.log("View recruiter profile");
  };

  const nextProposal = () => {
    if (currentProposalIndex < proposals.length - 1) {
      setCurrentProposalIndex(currentProposalIndex + 1);
    }
  };

  const prevProposal = () => {
    if (currentProposalIndex > 0) {
      setCurrentProposalIndex(currentProposalIndex - 1);
    }
  };

  // Calcolo statistiche 
  const totalProposals = proposals.length;
  const approvedProposals = proposals.filter(p => p.status === 'approved').length;
  const underReviewProposals = proposals.filter(p => p.status === 'under_review').length;
  const avgRating = 4.2; // Mock data - rating medio recruiter

  const currentProposal = proposals[currentProposalIndex];

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

        {/* Navigation e Proposta Corrente */}
        {proposals.length > 0 ? (
          <div className="space-y-4">
            {/* Navigation Header */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold">Proposte Ricevute</h3>
                  <Badge variant="secondary">
                    {currentProposalIndex + 1} di {totalProposals}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={prevProposal}
                    disabled={currentProposalIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={nextProposal}
                    disabled={currentProposalIndex === proposals.length - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Proposta Corrente */}
            {currentProposal && (
              <ProposalSimpleView
                proposal={currentProposal}
                onApprove={handleApprove}
                onReject={handleReject}
                onStartReview={handleStartReview}
                onViewRecruiterProfile={handleViewRecruiterProfile}
              />
            )}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <List className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Nessuna proposta ricevuta</h3>
            <p className="text-muted-foreground">
              Quando riceverai delle proposte dai recruiter, appariranno qui.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
