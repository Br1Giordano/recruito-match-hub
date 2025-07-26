
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Briefcase, Globe, Linkedin, X, Plus, Star, Users, CheckCircle, Clock, Award } from 'lucide-react';
import RecruiterAvatar from './RecruiterAvatar';
import { useRecruiterProfile } from '@/hooks/useRecruiterProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ensureHttpsProtocol } from '@/utils/urlUtils';

interface RecruiterProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  review_text: string | null;
  created_at: string;
  company_email: string;
}

export default function RecruiterProfileModal({ open, onOpenChange }: RecruiterProfileModalProps) {
  const { profile, updateProfile, createProfile, uploadAvatar, isUploading } = useRecruiterProfile();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [stats, setStats] = useState<RecruiterStats>({ totalProposals: 0, underReview: 0, approved: 0, averageRating: 0 });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    bio: '',
    location: '',
    years_of_experience: '',
    linkedin_url: '',
    website_url: '',
    specializations: [] as string[]
  });

  // Fetch stats and reviews when modal opens
  useEffect(() => {
    if (open && profile?.email) {
      fetchStats();
      fetchReviews();
    }
  }, [open, profile?.email]);

  // Se non c'è profilo, inizia in modalità editing
  useEffect(() => {
    if (!profile && open) {
      setIsEditing(true);
      setFormData(prev => ({
        ...prev,
        email: user?.email || ''
      }));
    } else if (profile && open) {
      setFormData({
        nome: profile.nome || '',
        cognome: profile.cognome || '',
        email: profile.email || '',
        bio: profile.bio || '',
        location: profile.location || '',
        years_of_experience: profile.years_of_experience?.toString() || '',
        linkedin_url: profile.linkedin_url || '',
        website_url: profile.website_url || '',
        specializations: profile.specializations || []
      });
      setIsEditing(false);
    }
  }, [profile, open, user?.email]);

  const fetchStats = async () => {
    if (!profile?.email) return;
    
    setLoadingStats(true);
    try {
      // Fetch proposals stats
      const { data: proposals, error: proposalsError } = await supabase
        .from('proposals')
        .select('status')
        .eq('recruiter_email', profile.email);

      if (proposalsError) throw proposalsError;

      const totalProposals = proposals?.length || 0;
      const underReview = proposals?.filter(p => p.status === 'pending')?.length || 0;
      const approved = proposals?.filter(p => p.status === 'approved')?.length || 0;

      // Fetch average rating
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('recruiter_reviews')
        .select('rating')
        .eq('recruiter_email', profile.email);

      if (ratingsError) throw ratingsError;

      const averageRating = ratingsData?.length > 0 
        ? ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length 
        : 0;

      setStats({
        totalProposals,
        underReview,
        approved,
        averageRating: Math.round(averageRating * 10) / 10
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchReviews = async () => {
    if (!profile?.email) return;
    
    try {
      const { data, error } = await supabase
        .from('recruiter_reviews')
        .select('*')
        .eq('recruiter_email', profile.email)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    console.log('🔄 RecruiterProfileModal - handleSave called');
    console.log('📝 formData:', formData);
    console.log('👤 current profile:', profile);
    
    const updates = {
      ...formData,
      years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null
    };
    
    console.log('📦 updates to send:', updates);
    
    let success = false;
    if (profile) {
      console.log('🔄 Updating existing profile...');
      success = await updateProfile(updates);
    } else {
      console.log('➕ Creating new profile...');
      success = await createProfile(updates);
    }
    
    console.log('✅ Operation success:', success);
    
    if (success) {
      setIsEditing(false);
      // Aggiorna i dati del form con i nuovi valori per riflettere immediatamente le modifiche
      setFormData({
        nome: updates.nome || '',
        cognome: updates.cognome || '',
        email: updates.email || '',
        bio: updates.bio || '',
        location: updates.location || '',
        years_of_experience: updates.years_of_experience?.toString() || '',
        linkedin_url: updates.linkedin_url || '',
        website_url: updates.website_url || '',
        specializations: updates.specializations || []
      });
    }
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !formData.specializations.includes(newSpecialization.trim())) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()]
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== spec)
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  const displayProfile = profile || {
    nome: formData.nome,
    cognome: formData.cognome,
    email: formData.email,
    bio: formData.bio,
    location: formData.location,
    years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
    linkedin_url: formData.linkedin_url,
    website_url: formData.website_url,
    specializations: formData.specializations,
    avatar_url: null
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loadingStats) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Caricamento profilo...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!profile && !isEditing) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profilo non trovato</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Non è stato trovato un profilo per questo recruiter.</p>
            <Button onClick={() => setIsEditing(true)}>
              Crea il tuo profilo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? 'Modifica Profilo Recruiter' : 'Profilo Recruiter'}</span>
            {profile && (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-lg font-bold">{stats.averageRating}</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header con avatar e info base */}
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-3">
              <RecruiterAvatar
                avatarUrl={displayProfile.avatar_url}
                name={`${displayProfile.nome} ${displayProfile.cognome}`}
                size="lg"
              />
              {isEditing && (
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    {isUploading ? 'Caricamento...' : 'Cambia foto'}
                  </label>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cognome">Cognome *</Label>
                      <Input
                        id="cognome"
                        value={formData.cognome}
                        onChange={(e) => setFormData(prev => ({ ...prev, cognome: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {displayProfile.nome} {displayProfile.cognome}
                  </h2>
                  <p className="text-gray-600">{displayProfile.email}</p>
                  {displayProfile.location && (
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{displayProfile.location}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{stats.totalProposals} interessati</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{reviews.length} recensioni</span>
              </div>
            </div>
          </div>

          {/* Statistiche Performance */}
          {profile && !isEditing && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Statistiche Performance</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalProposals}</div>
                    <div className="text-sm text-gray-600">Proposte Totali</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.underReview}</div>
                    <div className="text-sm text-gray-600">Prese in interesse</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                    <div className="text-sm text-gray-600">Approvate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                      <Star className="h-5 w-5" />
                      {stats.averageRating}
                    </div>
                    <div className="text-sm text-gray-600">Rating Medio</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Bio */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Biografia</h3>
            {isEditing ? (
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Racconta qualcosa di te..."
                rows={4}
              />
            ) : (
              <p className="text-gray-700">
                {displayProfile.bio || "Nessuna bio disponibile"}
              </p>
            )}
          </div>

          {/* Esperienza */}
          {!isEditing && displayProfile.years_of_experience && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Esperienza</h3>
              <p className="text-blue-600 font-medium">
                {displayProfile.years_of_experience} anni nel recruiting
              </p>
            </div>
          )}

          {/* Dettagli professionali */}
          {isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Località</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="es. Milano, Italia"
                />
              </div>
              <div>
                <Label htmlFor="years_experience">Anni di esperienza</Label>
                <Input
                  id="years_experience"
                  type="number"
                  value={formData.years_of_experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, years_of_experience: e.target.value }))}
                  placeholder="es. 5"
                />
              </div>
            </div>
          )}

          {/* Specializzazioni */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Specializzazioni</h3>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    placeholder="Aggiungi specializzazione..."
                    onKeyPress={(e) => e.key === 'Enter' && addSpecialization()}
                  />
                  <Button onClick={addSpecialization} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {spec}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeSpecialization(spec)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {displayProfile.specializations?.map((spec, index) => (
                  <Badge key={index} className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                    {spec}
                  </Badge>
                )) || <span className="text-gray-500">Nessuna specializzazione</span>}
              </div>
            )}
          </div>

          {/* Link social */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Link professionali</h3>
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <Label htmlFor="website">Sito web</Label>
                  <Input
                    id="website"
                    value={formData.website_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                {displayProfile.linkedin_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={ensureHttpsProtocol(displayProfile.linkedin_url)} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {displayProfile.website_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={ensureHttpsProtocol(displayProfile.website_url)} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Sito web
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Recensioni */}
          {profile && !isEditing && reviews.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recensioni ({reviews.length})</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">{formatDate(review.created_at)}</span>
                        </div>
                      </div>
                      {review.review_text && (
                        <p className="text-gray-700 text-sm">{review.review_text}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Azioni */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annulla
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!formData.nome || !formData.cognome || !formData.email}
                >
                  {profile ? 'Salva modifiche' : 'Crea profilo'}
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                Modifica profilo
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
