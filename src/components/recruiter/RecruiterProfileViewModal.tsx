
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Briefcase, Globe, Linkedin, TrendingUp, MessageSquare } from "lucide-react";
import RecruiterAvatar from "./RecruiterAvatar";
import { useRecruiterStats } from "@/hooks/useRecruiterStats";

interface RecruiterProfile {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  azienda?: string;
  esperienza?: string;
  settori?: string;
  messaggio?: string;
  avatar_url?: string;
  bio?: string;
  linkedin_url?: string;
  website_url?: string;
  specializations?: string[];
  years_of_experience?: number;
  location?: string;
}

interface RecruiterProfileViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: RecruiterProfile | null;
}

export default function RecruiterProfileViewModal({ open, onOpenChange, profile }: RecruiterProfileViewModalProps) {
  const { stats, reviews, loading, fetchRecruiterStats } = useRecruiterStats();

  useEffect(() => {
    if (open && profile?.email) {
      fetchRecruiterStats(profile.email);
    }
  }, [open, profile?.email]);

  if (!profile) return null;

  const fullName = `${profile.nome} ${profile.cognome}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profilo Recruiter</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header con Avatar e Info Base */}
          <div className="flex items-start gap-4">
            <RecruiterAvatar
              avatarUrl={profile.avatar_url}
              name={fullName}
              size="xl"
              stats={stats ? {
                interestedProposals: stats.interestedProposals,
                averageRating: stats.averageRating,
                totalReviews: stats.totalReviews
              } : undefined}
              showStats={true}
            />
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{fullName}</h3>
              <p className="text-muted-foreground">{profile.email}</p>
              
              {profile.azienda && (
                <div className="flex items-center gap-1 mt-1">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm">{profile.azienda}</span>
                </div>
              )}
              
              {profile.location && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Statistiche Performance */}
          {stats && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 text-blue-900">Statistiche Performance</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalProposals}</div>
                  <div className="text-xs text-gray-600">Proposte Totali</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.interestedProposals}</div>
                  <div className="text-xs text-gray-600">Prese in Interesse</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.approvedProposals}</div>
                  <div className="text-xs text-gray-600">Approvate</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold text-yellow-600">
                      {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">Rating Medio</div>
                </div>
              </div>
            </div>
          )}

          {/* Bio e Dettagli */}
          {profile.bio && (
            <div>
              <h4 className="font-medium mb-2">Biografia</h4>
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            </div>
          )}

          {/* Esperienza e Specializzazioni */}
          <div className="grid md:grid-cols-2 gap-4">
            {profile.years_of_experience && (
              <div>
                <h4 className="font-medium mb-2">Esperienza</h4>
                <p className="text-sm">{profile.years_of_experience} anni nel recruiting</p>
              </div>
            )}

            {profile.settori && (
              <div>
                <h4 className="font-medium mb-2">Settori di Competenza</h4>
                <p className="text-sm">{profile.settori}</p>
              </div>
            )}
          </div>

          {/* Specializzazioni */}
          {profile.specializations && profile.specializations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Specializzazioni</h4>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.map((spec, index) => (
                  <Badge key={index} variant="secondary">{spec}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Link Esterni */}
          <div className="flex gap-2">
            {profile.linkedin_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
            )}
            {profile.website_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Sito Web
                </a>
              </Button>
            )}
          </div>

          {/* Recensioni */}
          {reviews && reviews.length > 0 && (
            <div>
              <Separator />
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Recensioni ({reviews.length})
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                    {review.review_text && (
                      <p className="text-sm text-gray-700">{review.review_text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
