import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Linkedin, Star, X, Heart, Check, TrendingUp } from 'lucide-react';
import { useRecruiterProfileByEmail } from '@/hooks/useRecruiterProfileByEmail';
import { supabase } from '@/integrations/supabase/client';
import RecruiterAvatar from './RecruiterAvatar';

interface RecruiterDashboardViewProps {
  recruiterEmail: string;
  onClose: () => void;
}

interface RecruiterStats {
  totalProposals: number;
  underReview: number;
  approved: number;
  averageRating: number;
}

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export default function RecruiterDashboardView({ recruiterEmail, onClose }: RecruiterDashboardViewProps) {
  const { profile, loading, fetchProfileByEmail } = useRecruiterProfileByEmail();
  const [stats, setStats] = useState<RecruiterStats>({
    totalProposals: 0,
    underReview: 0,
    approved: 0,
    averageRating: 0
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (recruiterEmail) {
      fetchProfileByEmail(recruiterEmail);
    }
  }, [recruiterEmail, fetchProfileByEmail]);

  useEffect(() => {
    if (recruiterEmail) {
      fetchStats();
      fetchReviews();
    }
  }, [recruiterEmail]);

  const fetchStats = async () => {
    try {
      // Fetch proposal statistics
      const { data: proposals, error: proposalsError } = await supabase
        .from('proposals')
        .select('status')
        .eq('recruiter_email', recruiterEmail);

      if (proposalsError) {
        console.error('Error fetching proposals:', proposalsError);
        return;
      }

      const totalProposals = proposals?.length || 0;
      const underReview = proposals?.filter(p => p.status === 'under_review').length || 0;
      const approved = proposals?.filter(p => p.status === 'approved').length || 0;

      // Fetch average rating
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('recruiter_reviews')
        .select('rating')
        .eq('recruiter_email', recruiterEmail);

      if (ratingsError) {
        console.error('Error fetching ratings:', ratingsError);
      }

      const averageRating = ratingsData && ratingsData.length > 0 
        ? ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length 
        : 0;

      setStats({
        totalProposals,
        underReview,
        approved,
        averageRating: Number(averageRating.toFixed(1))
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('recruiter_reviews')
        .select('id, rating, review_text, created_at')
        .eq('recruiter_email', recruiterEmail)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading || loadingStats) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <div className="text-lg">Caricamento profilo recruiter...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <div className="text-lg text-red-600">Profilo recruiter non trovato</div>
            <Button onClick={onClose} className="mt-4">Chiudi</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Profilo Recruiter</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Recruiter Info */}
          <div className="flex items-start gap-3">
            <RecruiterAvatar
              avatarUrl={profile.avatar_url}
              name={`${profile.nome} ${profile.cognome}`}
              size="lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{profile.nome} {profile.cognome}</h3>
              <p className="text-sm text-gray-600">{profile.email}</p>
              {profile.azienda && (
                <p className="text-sm text-blue-600 font-medium">{profile.azienda}</p>
              )}
              {profile.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{stats.averageRating}</span>
            </div>
          </div>

          {/* Interest/Review Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Heart className="h-3 w-3 mr-1" />
              1 interessati
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Star className="h-3 w-3 mr-1" />
              {reviews.length} recensioni
            </Button>
          </div>

          {/* Performance Statistics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-600">Statistiche Performance</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{stats.totalProposals}</div>
                  <div className="text-xs text-gray-600">Proposte Totali</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{stats.underReview}</div>
                  <div className="text-xs text-gray-600">Prese in interesse</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">{stats.approved}</div>
                  <div className="text-xs text-gray-600">Approvate</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600 flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500" />
                    {stats.averageRating}
                  </div>
                  <div className="text-xs text-gray-600">Rating Medio</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Biography - show both bio and messaggio */}
          {(profile.bio || profile.messaggio) && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Biografia</h4>
              <p className="text-sm text-gray-700">{profile.bio || profile.messaggio}</p>
            </div>
          )}

          {/* Experience - show both numerical years and text description */}
          {(profile.esperienza || profile.years_of_experience) && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Esperienza</h4>
              <div className="text-sm text-gray-700">
                {profile.years_of_experience && (
                  <div className="font-medium text-blue-600 mb-1">
                    {profile.years_of_experience} anni nel recruiting
                  </div>
                )}
                {profile.esperienza && (
                  <p>{profile.esperienza}</p>
                )}
              </div>
            </div>
          )}

          {/* Company */}
          {profile.azienda && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Azienda</h4>
              <p className="text-sm text-gray-700">{profile.azienda}</p>
            </div>
          )}

          {/* Sectors - show settori field */}
          {profile.settori && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Settori di competenza</h4>
              <p className="text-sm text-gray-700">{profile.settori}</p>
            </div>
          )}

          {/* Specializations */}
          {profile.specializations && profile.specializations.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Specializzazioni</h4>
              <div className="flex flex-wrap gap-1">
                {profile.specializations.map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {(profile.linkedin_url || profile.website_url) && (
            <div className="space-y-2">
              {profile.linkedin_url && (
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-3 w-3 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              )}
              {profile.website_url && (
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                    <TrendingUp className="h-3 w-3 mr-2" />
                    Sito Web
                  </a>
                </Button>
              )}
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Recensioni ({reviews.length})</h4>
              <div className="space-y-2">
                {reviews.slice(0, 2).map((review) => (
                  <div key={review.id} className="bg-gray-50 p-2 rounded text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-gray-500">{formatDate(review.created_at)}</span>
                    </div>
                    {review.review_text && (
                      <p className="text-gray-700">{review.review_text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}