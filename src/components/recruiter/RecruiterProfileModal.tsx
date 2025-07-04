
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
import { MapPin, Briefcase, Globe, Linkedin, X, Plus } from 'lucide-react';
import RecruiterAvatar from './RecruiterAvatar';
import { useRecruiterProfile } from '@/hooks/useRecruiterProfile';
import { useAuth } from '@/hooks/useAuth';

interface RecruiterProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RecruiterProfileModal({ open, onOpenChange }: RecruiterProfileModalProps) {
  const { profile, updateProfile, createProfile, uploadAvatar, isUploading } = useRecruiterProfile();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState('');
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const updates = {
      ...formData,
      years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null
    };
    
    let success = false;
    if (profile) {
      success = await updateProfile(updates);
    } else {
      success = await createProfile(updates);
    }
    
    if (success) {
      setIsEditing(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {profile ? 'Profilo Recruiter' : 'Crea il tuo Profilo Recruiter'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header con avatar e info base */}
          <div className="flex items-start gap-6">
            <RecruiterAvatar
              avatarUrl={displayProfile.avatar_url}
              name={`${displayProfile.nome} ${displayProfile.cognome}`}
              size="lg"
              onUpload={uploadAvatar}
              isUploading={isUploading}
              editable={isEditing}
            />
            
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
                  {displayProfile.years_of_experience && (
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{displayProfile.years_of_experience} anni di esperienza</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Bio */}
          <div>
            <Label>Bio</Label>
            {isEditing ? (
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Racconta qualcosa di te..."
                rows={4}
                className="mt-2"
              />
            ) : (
              <p className="mt-2 text-gray-700">
                {displayProfile.bio || "Nessuna bio disponibile"}
              </p>
            )}
          </div>

          {/* Dettagli professionali */}
          {isEditing ? (
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
          ) : null}

          {/* Link social */}
          <div>
            <Label>Link professionali</Label>
            {isEditing ? (
              <div className="space-y-3 mt-2">
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
              <div className="flex gap-3 mt-2">
                {displayProfile.linkedin_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={displayProfile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {displayProfile.website_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={displayProfile.website_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Sito web
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Specializzazioni */}
          <div>
            <Label>Specializzazioni</Label>
            {isEditing ? (
              <div className="mt-2 space-y-3">
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
              <div className="flex flex-wrap gap-2 mt-2">
                {displayProfile.specializations?.map((spec, index) => (
                  <Badge key={index} variant="secondary">
                    {spec}
                  </Badge>
                )) || <span className="text-gray-500">Nessuna specializzazione</span>}
              </div>
            )}
          </div>

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
