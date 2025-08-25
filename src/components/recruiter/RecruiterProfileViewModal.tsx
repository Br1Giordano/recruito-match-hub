
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, Briefcase, Globe, Linkedin, Phone, Mail, Building2, User, Star, Calendar, TrendingUp, MessageSquare } from 'lucide-react';
import { StarRating } from '@/components/ui/star-rating';
import RecruiterAvatar from './RecruiterAvatar';
import { ensureHttpsProtocol } from '@/utils/urlUtils';
import { supabase } from '@/integrations/supabase/client';
import { useRecruiterRating } from '@/hooks/useRecruiterRating';

interface RecruiterProfile {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  azienda?: string;
  bio?: string;
  linkedin_url?: string;
  website_url?: string;
  specializations?: string[];
  years_of_experience?: number;
  location?: string;
  avatar_url?: string;
  esperienza?: string;
  settori?: string;
  messaggio?: string;
  created_at?: string;
}

interface RecruiterProfileViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: RecruiterProfile | null;
  defaultTab?: string;
}

interface ProposalStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export default function RecruiterProfileViewModal({ 
  open, 
  onOpenChange, 
  profile,
  defaultTab = 'profile'
}: RecruiterProfileViewModalProps) {
  // Move the null check before any hooks
  if (!profile) return null;

  const [stats, setStats] = useState<ProposalStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const { rating, fetchRatingByEmail } = useRecruiterRating();

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long'
    });
  };

  const fetchStats = async () => {
    if (!profile?.email) return;
    
    setLoadingStats(true);
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('status')
        .eq('recruiter_email', profile.email);

      if (error) throw error;

      const total = data?.length || 0;
      const pending = data?.filter(p => p.status === 'pending').length || 0;
      const approved = data?.filter(p => p.status === 'approved').length || 0;
      const rejected = data?.filter(p => p.status === 'rejected').length || 0;

      setStats({ total, pending, approved, rejected });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchReviews = async () => {
    if (!profile?.email) return;
    
    setLoadingReviews(true);
    try {
      const { data, error } = await supabase
        .from('recruiter_reviews')
        .select('id, rating, review_text, created_at')
        .eq('recruiter_email', profile.email)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (open && profile?.email) {
      fetchRatingByEmail(profile.email);
      fetchStats();
      fetchReviews();
    }
  }, [open, profile?.email, fetchRatingByEmail]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-blue-900">
            Profilo Recruiter Completo
          </DialogTitle>
        </DialogHeader>

        {/* Header principale sempre visibile */}
        <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <RecruiterAvatar
                avatarUrl={profile.avatar_url}
                name={`${profile.nome} ${profile.cognome}`}
                size="xl"
              />
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile.nome} {profile.cognome}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{profile.email}</span>
                    </div>
                    
                    {profile.telefono && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span>{profile.telefono}</span>
                      </div>
                    )}
                    
                    {profile.azienda && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{profile.azienda}</span>
                      </div>
                    )}
                    
                    {profile.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Badge esperienza */}
                <div className="flex flex-wrap gap-2">
                  {profile.years_of_experience && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {profile.years_of_experience} anni di esperienza
                    </Badge>
                  )}
                  
                  {profile.esperienza && !profile.years_of_experience && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                      <Star className="h-3 w-3 mr-1" />
                      {profile.esperienza}
                    </Badge>
                  )}

                  {profile.created_at && (
                    <Badge variant="outline" className="text-gray-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      Attivo dal {formatDate(profile.created_at)}
                    </Badge>
                  )}

                  {rating.totalReviews > 0 && (
                    <div className="flex items-center gap-2">
                      <StarRating 
                        rating={Number(rating.averageRating)} 
                        totalReviews={rating.totalReviews}
                        size={16} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schede */}
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profilo
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Recensioni & Statistiche
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            {/* Sezione Bio/Presentazione */}
            {(profile.bio || profile.messaggio) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800">
                    <User className="h-5 w-5 text-blue-600" />
                    Chi sono
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {profile.bio || profile.messaggio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sezione Competenze e Settori */}
            {((profile.specializations && profile.specializations.length > 0) || profile.settori) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Competenze e Settori
                  </h3>
                  
                  <div className="space-y-4">
                    {profile.specializations && profile.specializations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-700">Specializzazioni:</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.specializations.map((spec, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profile.settori && (
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-700">Settori di competenza:</h4>
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-700">{profile.settori}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sezione Collegamenti */}
            {(profile.linkedin_url || profile.website_url) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
                    <Globe className="h-5 w-5 text-green-600" />
                    Collegamenti Professionali
                  </h3>
                  <div className="flex gap-3">
                    {profile.linkedin_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild 
                        className="hover:bg-blue-50 border-blue-300 text-blue-700"
                      >
                        <a href={ensureHttpsProtocol(profile.linkedin_url)} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {profile.website_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild 
                        className="hover:bg-green-50 border-green-300 text-green-700"
                      >
                        <a href={ensureHttpsProtocol(profile.website_url)} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Sito Web
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Footer informativo */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-blue-800 font-medium">
                    💼 Contatta direttamente il recruiter per maggiori dettagli sui candidati proposti
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Tutte le informazioni mostrate sono fornite direttamente dal recruiter
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6 mt-6">
            {/* Statistiche Proposte */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Statistiche Proposte
                </h3>
                
                {loadingStats ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Caricamento statistiche...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                      <div className="text-sm text-blue-700">Totali</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                      <div className="text-sm text-yellow-700">In Attesa</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                      <div className="text-sm text-green-700">Approvate</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                      <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                      <div className="text-sm text-red-700">Rifiutate</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recensioni */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Recensioni delle Aziende
                  </h3>
                  
                  {/* Media delle stelle prominente */}
                  {rating.totalReviews > 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {Number(rating.averageRating).toFixed(1)}
                          </div>
                          <div className="text-xs text-yellow-700">Media</div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <StarRating 
                            rating={Number(rating.averageRating)} 
                            totalReviews={rating.totalReviews}
                            size={20}
                            showNumber={false}
                          />
                          <div className="text-xs text-gray-600">
                            {rating.totalReviews} recensioni
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Caricamento recensioni...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">Nessuna recensione disponibile</p>
                    <p className="text-gray-400 text-sm">Le recensioni delle aziende appariranno qui una volta ricevute</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gradient-to-r from-gray-50 to-blue-50 p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg border border-yellow-200">
                              <StarRating 
                                rating={Number(review.rating)} 
                                size={18}
                                showNumber={false}
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {Number(review.rating).toFixed(1)} stelle
                              </div>
                              <div className="text-sm text-gray-500">
                                Valutazione aziendale
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-700">
                              {new Date(review.created_at).toLocaleDateString('it-IT', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleTimeString('it-IT', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        {review.review_text && review.review_text.trim() !== '' ? (
                          <div className="bg-white p-4 rounded-lg border border-gray-100">
                            <p className="text-gray-700 leading-relaxed italic">
                              "{review.review_text}"
                            </p>
                          </div>
                        ) : (
                          <div className="bg-white p-3 rounded-lg border border-gray-100">
                            <p className="text-gray-500 text-sm italic">
                              L'azienda ha lasciato solo una valutazione stellare
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Riepilogo statistiche recensioni */}
                    {reviews.length > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-blue-600">
                              {reviews.filter(r => r.rating === 5).length}
                            </div>
                            <div className="text-xs text-blue-700">5 stelle</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">
                              {reviews.filter(r => r.rating === 4).length}
                            </div>
                            <div className="text-xs text-green-700">4 stelle</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-yellow-600">
                              {reviews.filter(r => r.rating === 3).length}
                            </div>
                            <div className="text-xs text-yellow-700">3 stelle</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-orange-600">
                              {reviews.filter(r => r.rating === 2).length}
                            </div>
                            <div className="text-xs text-orange-700">2 stelle</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-red-600">
                              {reviews.filter(r => r.rating === 1).length}
                            </div>
                            <div className="text-xs text-red-700">1 stella</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
