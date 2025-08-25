import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Crown, FileText, User, MessageCircle, Star, CheckCircle, XCircle, Eye } from "lucide-react";
import { useRecruiterRanking } from "@/hooks/useRecruiterRanking";
import { useRecruiterProfileByEmail } from "@/hooks/useRecruiterProfileByEmail";
import { useRecruiterRating } from "@/hooks/useRecruiterRating";
import { StarRating } from "@/components/ui/star-rating";
import CVViewer from "@/components/cv/CVViewer";
import RecruiterProfileViewModal from "@/components/recruiter/RecruiterProfileViewModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CompactProposalCardProps {
  proposal: {
    id: string;
    candidate_name: string;
    candidate_email: string;
    candidate_description?: string;
    candidate_cv_url?: string;
    candidate_cv_anonymized_url?: string;
    contact_data_protected?: boolean;
    company_access_level?: 'restricted' | 'partial' | 'full';
    years_experience?: number;
    expected_salary?: number;
    availability_weeks?: number;
    status: string;
    recruiter_email?: string;
    recruiter_name?: string;
    job_offers?: {
      title: string;
      company_name?: string;
    };
  };
  onStatusUpdate?: (proposalId: string, status: string) => void;
  onRequestAccess?: (proposalId: string) => void;
  onContactRecruiter?: (proposalId: string, recruiterEmail: string, recruiterName: string) => void;
  onRecruiterReviewed?: () => void;
}

export default function CompactProposalCard({ 
  proposal, 
  onStatusUpdate, 
  onRequestAccess,
  onContactRecruiter,
  onRecruiterReviewed
}: CompactProposalCardProps) {
  const { rankingInfo } = useRecruiterRanking(proposal.recruiter_email);
  const { rating, fetchRatingByEmail } = useRecruiterRating();
  const { profile: recruiterProfile, fetchProfileByEmail } = useRecruiterProfileByEmail();
  const [showRecruiterProfile, setShowRecruiterProfile] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [checkingReview, setCheckingReview] = useState(false);
  const { toast } = useToast();
  
  // Fetch rating and profile when recruiter email is available
  React.useEffect(() => {
    if (proposal.recruiter_email) {
      fetchRatingByEmail(proposal.recruiter_email);
    }
  }, [proposal.recruiter_email, fetchRatingByEmail]);

  // Check if review already exists
  const checkExistingReview = async () => {
    if (!proposal.recruiter_email) return;
    
    setCheckingReview(true);
    try {
      const { data, error } = await supabase
        .from('recruiter_reviews')
        .select('*')
        .eq('recruiter_email', proposal.recruiter_email)
        .eq('proposal_id', proposal.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking existing review:', error);
        return;
      }

      setExistingReview(data);
    } catch (error) {
      console.error('Error checking existing review:', error);
    } finally {
      setCheckingReview(false);
    }
  };

  useEffect(() => {
    if ((proposal.status === "rejected" || proposal.status === "hired") && proposal.recruiter_email) {
      checkExistingReview();
    }
  }, [proposal.status, proposal.recruiter_email, proposal.id]);

  const handleShowProfile = async () => {
    if (proposal.recruiter_email) {
      await fetchProfileByEmail(proposal.recruiter_email);
      setShowRecruiterProfile(true);
    }
  };

  const handleSubmitReview = async () => {
    if (!proposal.recruiter_email || reviewRating === 0) {
      toast({
        title: "Errore",
        description: "Seleziona una valutazione prima di inviare.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const { error } = await supabase
        .from('recruiter_reviews')
        .insert({
          recruiter_email: proposal.recruiter_email,
          company_email: proposal.job_offers?.company_name || '',
          rating: reviewRating,
          review_text: reviewComment.trim() || null,
          proposal_id: proposal.id
        });

      if (error) throw error;

      toast({
        title: "Recensione inviata",
        description: "Grazie per aver recensito questo recruiter!"
      });

      setShowReviewDialog(false);
      setReviewRating(0);
      setReviewComment("");
      
      // Refresh rating data
      if (proposal.recruiter_email) {
        fetchRatingByEmail(proposal.recruiter_email);
      }
      
      // Check for existing review again
      checkExistingReview();
      
      onRecruiterReviewed?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Errore",
        description: "Errore nell'invio della recensione. Riprova.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { 
          color: "bg-indigo-100 text-indigo-800", 
          text: "Da visionare",
          borderColor: "border-l-indigo-600",
          tooltip: "Candidatura mai aperta",
          icon: null
        };
      case "under_review":
        return { 
          color: "bg-amber-100 text-amber-800", 
          text: "In esame",
          borderColor: "border-l-amber-600",
          tooltip: "Screening in corso",
          icon: null
        };
      case "approved":
        return { 
          color: "bg-emerald-100 text-emerald-800", 
          text: "Short-list",
          borderColor: "border-l-emerald-600",
          tooltip: "Pronti al colloquio",
          icon: null
        };
      case "rejected":
        return { 
          color: "bg-red-100 text-red-800", 
          text: "Chiuse - Esito negativo",
          borderColor: "border-l-red-600",
          tooltip: "Candidatura non andata a buon fine",
          icon: <XCircle className="h-3 w-3" />
        };
      case "hired":
        return { 
          color: "bg-green-100 text-green-800", 
          text: "Chiuse - Esito positivo",
          borderColor: "border-l-green-600",
          tooltip: "Candidato assunto con successo",
          icon: <CheckCircle className="h-3 w-3" />
        };
      default:
        return { 
          color: "bg-gray-100 text-gray-800", 
          text: "Chiuse",
          borderColor: "border-l-gray-400",
          tooltip: "Candidatura conclusa",
          icon: null
        };
    }
  };

  const statusInfo = getStatusInfo(proposal.status);
  const hasCv = proposal.candidate_cv_url || proposal.candidate_cv_anonymized_url;
  const cvUrl = proposal.candidate_cv_url || proposal.candidate_cv_anonymized_url;
  
  // Format candidate name: Nome + Iniziale cognome
  const formatCandidateName = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length === 1) return parts[0];
    const firstName = parts[0];
    const lastNameInitial = parts[parts.length - 1].charAt(0);
    return `${firstName} ${lastNameInitial}.`;
  };

  return (
    <TooltipProvider>
      <Card className={`w-full border-l-4 ${statusInfo.borderColor} hover:shadow-md transition-shadow`}>
        <CardContent className="p-4 space-y-4">
          {/* Header: Status Chip + Job Title */}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={`${statusInfo.color} cursor-help flex items-center gap-1`}>
                  {statusInfo.icon}
                  {statusInfo.text}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {statusInfo.tooltip}
              </TooltipContent>
            </Tooltip>
            <h3 className="font-bold text-base leading-tight">
              {proposal.job_offers?.title || "Posizione non specificata"}
            </h3>
          </div>

          {/* Body: Two Columns */}
          <div className="flex items-start justify-between gap-4">
            {/* Left Column: Recruiter + Candidate */}
            <div className="flex-1 space-y-3">
              {/* Recruiter Info */}
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                    {proposal.recruiter_name?.charAt(0) || "R"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShowProfile}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {proposal.recruiter_name || "Recruiter"}
                    </button>
                    {rankingInfo.ranking_label && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1 cursor-help text-xs px-1 py-0">
                            <Crown className="h-2 w-2" />
                            {rankingInfo.ranking_label}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs max-w-[200px]">
                          Tra i migliori {rankingInfo.ranking_label === 'Top 5' ? '5' : rankingInfo.ranking_label === 'Top 10' ? '10' : '25'} recruiter
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {rating.totalReviews > 0 && (
                    <StarRating 
                      rating={rating.averageRating} 
                      totalReviews={rating.totalReviews}
                      showNumber={true}
                      size={12}
                    />
                  )}
                </div>
              </div>
              
              {/* Candidate Info */}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {formatCandidateName(proposal.candidate_name)}
                </span>
                {hasCv ? (
                  <CVViewer 
                    cvUrl={cvUrl}
                    candidateName={proposal.candidate_name}
                    trigger={
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 cursor-pointer hover:bg-blue-200 text-xs">
                        📄 CV
                      </Badge>
                    }
                  />
                ) : (
                  <Badge variant="outline" className="text-xs text-gray-600">
                    Nessun CV
                  </Badge>
                )}
              </div>
              
              {/* Candidate Details - Show when approved */}
              {proposal.status === "approved" && (
                <div className="mt-2 p-2 bg-muted/20 rounded-md space-y-1">
                  {proposal.candidate_description && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Profilo:</strong> {proposal.candidate_description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {proposal.years_experience && (
                      <span><strong>Esperienza:</strong> {proposal.years_experience} anni</span>
                    )}
                    {proposal.expected_salary && (
                      <span><strong>RAL:</strong> €{(proposal.expected_salary/1000).toFixed(0)}k</span>
                    )}
                    {proposal.availability_weeks && (
                      <span><strong>Disponibilità:</strong> {proposal.availability_weeks} settimane</span>
                    )}
                  </div>
                  {!proposal.contact_data_protected && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Email:</strong> {proposal.candidate_email}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Unlock Contacts */}
            <div className="flex-shrink-0">
              {/* proposal.contact_data_protected && onRequestAccess && (
                <button
                  onClick={() => onRequestAccess(proposal.id)}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  🔒 Sblocca contatti
                </button>
              ) */}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex gap-2 pt-2">
            {proposal.status === "pending" && onStatusUpdate && (
              <>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "under_review")}
                  variant="default"
                  size="sm"
                  className="text-xs"
                >
                  Valuta
                </Button>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "approved")}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  Short-lista
                </Button>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "rejected")}
                  variant="outline"
                  size="sm"
                  className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                >
                  Scarta
                </Button>
              </>
            )}

            {proposal.status === "under_review" && onStatusUpdate && (
              <>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "approved")}
                  variant="default"
                  size="sm"
                  className="text-xs"
                >
                  Short-lista
                </Button>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "rejected")}
                  variant="outline"
                  size="sm"
                  className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                >
                  Scarta
                </Button>
              </>
            )}

            {/* Actions for approved (short-listed) proposals */}
            {proposal.status === "approved" && onStatusUpdate && (
              <>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "hired")}
                  variant="default"
                  size="sm"
                  className="text-xs bg-green-600 hover:bg-green-700"
                >
                  Assumi
                </Button>
                <Button
                  onClick={() => onStatusUpdate(proposal.id, "rejected")}
                  variant="outline"
                  size="sm"
                  className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                >
                  Scarta
                </Button>
              </>
            )}

            {/* Message recruiter button for approved proposals */}
            {proposal.status === "approved" && onContactRecruiter && proposal.recruiter_email && (
              <Button
                onClick={() => onContactRecruiter(proposal.id, proposal.recruiter_email, proposal.recruiter_name || "Recruiter")}
                variant="default"
                size="sm"
                className="text-xs bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                💬 Contatta recruiter
              </Button>
            )}

            {/* Review recruiter button for closed proposals */}
            {(proposal.status === "rejected" || proposal.status === "hired") && proposal.recruiter_email && (
              existingReview ? (
                <Button
                  onClick={() => {
                    // Show existing review details in a toast or dialog
                    toast({
                      title: "Recensione già inviata",
                      description: `Hai già recensito questo recruiter con ${existingReview.rating} stelle.`,
                    });
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  disabled={checkingReview}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {checkingReview ? "Controllo..." : "Già recensito"}
                </Button>
              ) : (
                <Button
                  onClick={() => setShowReviewDialog(true)}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                  disabled={checkingReview}
                >
                  <Star className="h-3 w-3 mr-1" />
                  {checkingReview ? "Controllo..." : "Recensisci"}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Recruiter Profile Modal */}
      {recruiterProfile && (
        <RecruiterProfileViewModal
          open={showRecruiterProfile}
          onOpenChange={setShowRecruiterProfile}
          profile={recruiterProfile}
        />
      )}

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recensisci {proposal.recruiter_name || "Recruiter"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rating">Valutazione *</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`p-1 transition-colors ${
                      star <= reviewRating 
                        ? 'text-yellow-400 hover:text-yellow-500' 
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <Star className={`h-6 w-6 ${star <= reviewRating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="comment">Commento (opzionale)</Label>
              <Textarea
                id="comment"
                placeholder="Condividi la tua esperienza con questo recruiter..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowReviewDialog(false)}
                disabled={isSubmittingReview}
              >
                Annulla
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview || reviewRating === 0}
              >
                {isSubmittingReview ? "Invio..." : "Invia recensione"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
