
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, Globe, Linkedin } from 'lucide-react';
import RecruiterAvatar from './RecruiterAvatar';

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
}

interface RecruiterProfileViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: RecruiterProfile | null;
}

export default function RecruiterProfileViewModal({ 
  open, 
  onOpenChange, 
  profile 
}: RecruiterProfileViewModalProps) {
  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profilo Recruiter</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header con avatar e info base */}
          <div className="flex items-start gap-6">
            <RecruiterAvatar
              avatarUrl={profile.avatar_url}
              name={`${profile.nome} ${profile.cognome}`}
              size="lg"
            />
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.nome} {profile.cognome}
              </h2>
              <p className="text-gray-600">{profile.email}</p>
              {profile.azienda && (
                <p className="text-gray-500 mt-1">{profile.azienda}</p>
              )}
              {profile.location && (
                <div className="flex items-center gap-1 text-gray-500 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.years_of_experience && (
                <div className="flex items-center gap-1 text-gray-500 mt-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{profile.years_of_experience} anni di esperienza</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Bio */}
          {profile.bio && (
            <div>
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          )}

          {/* Link social */}
          {(profile.linkedin_url || profile.website_url) && (
            <div>
              <h3 className="font-semibold mb-2">Link professionali</h3>
              <div className="flex gap-3">
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
                      Sito web
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Specializzazioni */}
          {profile.specializations && profile.specializations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Specializzazioni</h3>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.map((spec, index) => (
                  <Badge key={index} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contatti */}
          {profile.telefono && (
            <div>
              <h3 className="font-semibold mb-2">Contatti</h3>
              <p className="text-gray-700">Telefono: {profile.telefono}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
