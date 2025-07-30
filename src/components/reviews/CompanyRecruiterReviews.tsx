import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, User, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface CompanyRecruiterReviewsProps {
  companyEmail: string;
}

interface RecruiterForReview {
  recruiter_email: string;
  recruiter_name: string;
  total_proposals: number;
  approved_proposals: number;
  hasReviewed: boolean;
}

interface ExistingReview {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  recruiter_email: string;
}

export default function CompanyRecruiterReviews({ companyEmail }: CompanyRecruiterReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recruiters, setRecruiters] = useState<RecruiterForReview[]>([]);
  const [existingReviews, setExistingReviews] = useState<ExistingReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecruiter, setSelectedRecruiter] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (companyEmail) {
      fetchRecruitersAndReviews();
    }
  }, [companyEmail]);

  const fetchRecruitersAndReviews = async () => {
    try {
      setIsLoading(true);

      // Ottieni tutti i recruiter che hanno fatto proposte approvate per questa azienda
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select(`
          recruiter_email,
          recruiter_name,
          status,
          job_offers!inner(company_name)
        `)
        .eq('job_offers.company_name', companyEmail)
        .not('recruiter_email', 'is', null);

      if (proposalsError) throw proposalsError;

      // Raggruppa per recruiter e conta le proposte
      const recruiterStats = proposalsData.reduce((acc: any, proposal) => {
        const email = proposal.recruiter_email;
        if (!acc[email]) {
          acc[email] = {
            recruiter_email: email,
            recruiter_name: proposal.recruiter_name,
            total_proposals: 0,
            approved_proposals: 0
          };
        }
        acc[email].total_proposals++;
        if (proposal.status === 'approved') {
          acc[email].approved_proposals++;
        }
        return acc;
      }, {});

      // Ottieni le recensioni esistenti
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('recruiter_reviews')
        .select('*')
        .eq('company_email', companyEmail);

      if (reviewsError) throw reviewsError;

      setExistingReviews(reviewsData || []);

      // Aggiungi info su chi ha già una recensione
      const recruitersWithReviewStatus = Object.values(recruiterStats).map((recruiter: any) => ({
        ...recruiter,
        hasReviewed: reviewsData?.some((review: any) => review.recruiter_email === recruiter.recruiter_email) || false
      }));

      // Mostra solo recruiter con almeno una proposta approvata
      setRecruiters(recruitersWithReviewStatus.filter((r: any) => r.approved_proposals > 0));

    } catch (error) {
      console.error('Error fetching recruiters and reviews:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati delle recensioni",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedRecruiter || rating === 0) {
      toast({
        title: "Errore",
        description: "Seleziona un recruiter e dai una valutazione",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('recruiter_reviews')
        .insert([{
          recruiter_email: selectedRecruiter,
          company_email: companyEmail,
          rating,
          review_text: reviewText.trim() || null
        }]);

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Recensione inviata con successo!",
      });

      // Reset form and refresh data
      setSelectedRecruiter(null);
      setRating(0);
      setReviewText('');
      await fetchRecruitersAndReviews();

    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Errore",
        description: "Impossibile inviare la recensione",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 cursor-pointer transition-colors ${
          index < currentRating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300 hover:text-yellow-400'
        }`}
        onClick={interactive ? () => setRating(index + 1) : undefined}
      />
    ));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <div className="text-muted-foreground">Caricamento recensioni...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const unreviewed = recruiters.filter(r => !r.hasReviewed);
  const reviewed = recruiters.filter(r => r.hasReviewed);

  return (
    <div className="space-y-6">
      {/* Sezione per nuove recensioni */}
      {unreviewed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recensisci i Recruiter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Puoi recensire i recruiter con cui hai avuto collaborazioni positive (proposte approvate).
            </p>

            {/* Lista recruiter da recensire */}
            <div className="space-y-3">
              {unreviewed.map((recruiter) => (
                <div
                  key={recruiter.recruiter_email}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRecruiter === recruiter.recruiter_email
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedRecruiter(recruiter.recruiter_email)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{recruiter.recruiter_name}</p>
                        <p className="text-sm text-muted-foreground">{recruiter.recruiter_email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {recruiter.approved_proposals} proposte approvate
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form di recensione */}
            {selectedRecruiter && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label>Valutazione *</Label>
                  <div className="flex gap-1 mt-2">
                    {renderStars(rating, true)}
                  </div>
                </div>

                <div>
                  <Label htmlFor="review_text">Commento (opzionale)</Label>
                  <Textarea
                    id="review_text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Condividi la tua esperienza con questo recruiter..."
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={rating === 0 || isSubmitting}
                    className="gradient-recruito text-white border-0"
                  >
                    {isSubmitting ? 'Invio...' : 'Invia Recensione'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRecruiter(null);
                      setRating(0);
                      setReviewText('');
                    }}
                  >
                    Annulla
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sezione recensioni esistenti */}
      {existingReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Le tue Recensioni
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {existingReviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">
                      {recruiters.find(r => r.recruiter_email === review.recruiter_email)?.recruiter_name || review.recruiter_email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-muted-foreground">
                        {review.rating}/5 stelle
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(review.created_at), 'dd MMM yyyy', { locale: it })}
                  </div>
                </div>
                {review.review_text && (
                  <p className="text-sm text-muted-foreground">{review.review_text}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Stato vuoto */}
      {recruiters.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Nessun recruiter da recensire</h3>
              <p className="text-muted-foreground">
                Le recensioni saranno disponibili dopo aver approvato proposte di recruiter.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}