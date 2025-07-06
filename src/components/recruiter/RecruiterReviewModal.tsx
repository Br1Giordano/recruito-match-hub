
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useRecruiterReviews } from "@/hooks/useRecruiterReviews";

interface RecruiterReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recruiterEmail: string;
  proposalId: string;
  existingReview?: {
    id: string;
    rating: number;
    review_text?: string;
  };
}

export default function RecruiterReviewModal({ 
  open, 
  onOpenChange, 
  recruiterEmail, 
  proposalId,
  existingReview 
}: RecruiterReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
  const [hoveredRating, setHoveredRating] = useState(0);
  const { createReview, updateReview, loading } = useRecruiterReviews();

  const handleSubmit = async () => {
    if (rating === 0) return;

    let success = false;
    if (existingReview) {
      success = await updateReview(existingReview.id, rating, reviewText);
    } else {
      success = await createReview({
        recruiterEmail,
        proposalId,
        rating,
        reviewText
      });
    }

    if (success) {
      onOpenChange(false);
      // Reset form
      if (!existingReview) {
        setRating(0);
        setReviewText('');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? 'Modifica Recensione' : 'Lascia una Recensione'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium mb-2">Valutazione</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="text-2xl"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Commento (opzionale)
            </label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Condividi la tua esperienza con questo recruiter..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annulla
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || loading}
            >
              {loading ? 'Salvando...' : (existingReview ? 'Aggiorna' : 'Salva Recensione')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
