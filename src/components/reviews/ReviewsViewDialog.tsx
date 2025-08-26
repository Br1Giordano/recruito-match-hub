import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface ReviewsViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  recruiterName: string;
}

export default function ReviewsViewDialog({ 
  isOpen, 
  onClose, 
  reviews, 
  recruiterName 
}: ReviewsViewDialogProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: it });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Recensioni per {recruiterName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">Nessuna recensione disponibile</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <Badge variant="secondary" className="text-xs">
                      {review.rating}/5 stelle
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(review.created_at)}
                  </div>
                </div>
                {review.review_text && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.review_text}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}