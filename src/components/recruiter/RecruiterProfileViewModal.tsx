
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Briefcase, Globe, Linkedin, Phone, Mail, Building2, User, Star, Calendar } from 'lucide-react';
import RecruiterAvatar from './RecruiterAvatar';
import { ensureHttpsProtocol } from '@/utils/urlUtils';

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
}

export default function RecruiterProfileViewModal({ 
  open, 
  onOpenChange, 
  profile 
}: RecruiterProfileViewModalProps) {
  if (!profile) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-blue-900">
            Profilo Recruiter Completo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header principale con gradient */}
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
        </div>
      </DialogContent>
    </Dialog>
  );
}
