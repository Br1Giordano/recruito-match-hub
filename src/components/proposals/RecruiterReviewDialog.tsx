import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface RecruiterReviewDialogProps {
  proposalId: string;
  recruiterEmail: string;
  recruiterName?: string;
}

export default function RecruiterReviewDialog({ 
  proposalId, 
  recruiterEmail, 
  recruiterName 
}: RecruiterReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmitReview = async () => {
    if (!user?.email || rating === 0) {
      toast({
        title: "Errore",
        description: "Seleziona una valutazione prima di inviare",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("recruiter_reviews")
        .insert([{
          recruiter_email: recruiterEmail,
          company_email: user.email,
          proposal_id: proposalId,
          rating: rating,
          review_text: reviewText || null,
        }]);

      if (error) {
        toast({
          title: "Errore",
          description: "Impossibile inviare la recensione",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Successo",
          description: "Recensione inviata con successo",
        });
        setIsOpen(false);
        setRating(0);
        setReviewText("");
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore imprevisto",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Recensisci Recruiter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Recensisci {recruiterName || "il recruiter"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Valutazione (1-5 stelle)
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Commento (opzionale)
            </label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Descrivi la tua esperienza con questo recruiter..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Annulla
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? "Invio..." : "Invia Recensione"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}