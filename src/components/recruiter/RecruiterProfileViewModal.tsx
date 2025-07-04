
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, Globe, Linkedin, Phone, Mail, Building2, User, Star } from 'lucide-react';
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
  esperienza?: string;
  settori?: string;
  messaggio?: string;
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

  // Debug log per verificare i dati del profilo
  console.log('RecruiterProfileViewModal - Profile data:', profile);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Profilo Recruiter</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Header con avatar e info base */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-start gap-6">
              <RecruiterAvatar
                avatarUrl={profile.avatar_url}
                name={`${profile.nome} ${profile.cognome}`}
                size="xl"
              />
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.nome} {profile.cognome}
                </h2>
                
                {/* Informazioni di contatto principali */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  
                  {profile.telefono && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{profile.telefono}</span>
                    </div>
                  )}
                  
                  {profile.azienda && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{profile.azienda}</span>
                    </div>
                  )}
                  
                  {profile.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>

                {/* Esperienza e settori */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {profile.years_of_experience && (
                    <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      <Briefcase className="h-4 w-4" />
                      <span className="font-medium">{profile.years_of_experience} anni di esperienza</span>
                    </div>
                  )}
                  
                  {profile.esperienza && !profile.years_of_experience && (
                    <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4" />
                      <span className="font-medium">{profile.esperienza}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio e descrizione */}
          {(profile.bio || profile.messaggio) && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <User className="h-5 w-5" />
                Presentazione
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {profile.bio || profile.messaggio}
              </p>
            </div>
          )}

          {/* Specializzazioni e settori */}
          {(profile.specializations && profile.specializations.length > 0) || profile.settori ? (
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Specializzazioni e Settori
              </h3>
              <div className="space-y-4">
                {profile.specializations && profile.specializations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-700">Specializzazioni:</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {profile.settori && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-700">Settori di competenza:</h4>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-gray-700">{profile.settori}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <Separator />

          {/* Link social e professionali */}
          {(profile.linkedin_url || profile.website_url) && (
            <div>
              <h3 className="font-bold text-lg mb-4">Collegamenti Professionali</h3>
              <div className="flex gap-3">
                {profile.linkedin_url && (
                  <Button variant="outline" size="sm" asChild className="hover:bg-blue-50 border-blue-300">
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {profile.website_url && (
                  <Button variant="outline" size="sm" asChild className="hover:bg-green-50 border-green-300">
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2 text-green-600" />
                      Sito Web
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Messaggio o nota aggiuntiva se presente */}
          {profile.messaggio && !profile.bio && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Messaggio del Recruiter:</h4>
              <p className="text-yellow-700">{profile.messaggio}</p>
            </div>
          )}

          {/* Footer con note aggiuntive */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 text-center">
              📞 Contatta direttamente il recruiter per maggiori informazioni sui candidati proposti
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
