
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Briefcase, 
  Globe, 
  Linkedin,
  Star,
  Calendar,
  UserCircle
} from 'lucide-react';
import RecruiterAvatar from './RecruiterAvatar';
import RecruiterProfileViewModal from './RecruiterProfileViewModal';
import { useRecruiterProfileByEmail } from '@/hooks/useRecruiterProfileByEmail';

interface RecruiterProfileCardProps {
  recruiterEmail?: string;
  recruiterName?: string;
  compact?: boolean;
}

export default function RecruiterProfileCard({ 
  recruiterEmail, 
  recruiterName, 
  compact = false 
}: RecruiterProfileCardProps) {
  const [showFullProfile, setShowFullProfile] = useState(false);
  const { profile, loading, error, fetchProfileByEmail } = useRecruiterProfileByEmail();

  useEffect(() => {
    if (recruiterEmail) {
      fetchProfileByEmail(recruiterEmail);
    }
  }, [recruiterEmail, fetchProfileByEmail]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="text-red-600 text-sm">
            Errore nel caricamento del profilo recruiter
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {recruiterName || 'Recruiter'}
              </div>
              <div className="text-sm text-gray-600">
                {recruiterEmail || 'Email non disponibile'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayName = `${profile.nome} ${profile.cognome}`.trim() || recruiterName || 'Recruiter';
  const hasCompleteProfile = profile.bio || profile.azienda || profile.specializations?.length || profile.years_of_experience;

  if (compact) {
    return (
      <>
        <Card className="w-full border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <RecruiterAvatar
                  avatarUrl={profile.avatar_url}
                  name={displayName}
                  size="md"
                />
                <div>
                  <div className="font-semibold text-blue-900">{displayName}</div>
                  <div className="text-sm text-blue-700">{profile.email}</div>
                  {profile.azienda && (
                    <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                      <Building2 className="h-3 w-3" />
                      {profile.azienda}
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={() => setShowFullProfile(true)}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-100"
              >
                <UserCircle className="h-4 w-4 mr-2" />
                Profilo
              </Button>
            </div>
          </CardContent>
        </Card>

        <RecruiterProfileViewModal
          open={showFullProfile}
          onOpenChange={setShowFullProfile}
          profile={profile}
        />
      </>
    );
  }

  return (
    <>
      <Card className="w-full border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              Profilo Recruiter
            </CardTitle>
            <Button
              onClick={() => setShowFullProfile(true)}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-300 hover:bg-blue-100"
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Visualizza Completo
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Header con avatar e info base */}
          <div className="flex items-start gap-4">
            <RecruiterAvatar
              avatarUrl={profile.avatar_url}
              name={displayName}
              size="lg"
            />
            
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
              </div>

              {/* Informazioni di contatto */}
              <div className="space-y-1">
                {profile.telefono && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{profile.telefono}</span>
                  </div>
                )}
                
                {profile.azienda && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{profile.azienda}</span>
                  </div>
                )}
                
                {profile.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              {/* Esperienza */}
              {(profile.years_of_experience || profile.esperienza) && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-700">
                    {profile.years_of_experience 
                      ? `${profile.years_of_experience} anni di esperienza`
                      : profile.esperienza
                    }
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bio o messaggio */}
          {(profile.bio || profile.messaggio) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Presentazione</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {profile.bio || profile.messaggio}
              </p>
            </div>
          )}

          {/* Specializzazioni */}
          {profile.specializations && profile.specializations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Specializzazioni
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.slice(0, 6).map((spec, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                    {spec}
                  </Badge>
                ))}
                {profile.specializations.length > 6 && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                    +{profile.specializations.length - 6} altre
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Settori */}
          {profile.settori && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Settori di competenza</h4>
              <p className="text-sm text-gray-700">{profile.settori}</p>
            </div>
          )}

          {/* Link professionali */}
          {(profile.linkedin_url || profile.website_url) && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Collegamenti</h4>
              <div className="flex gap-2">
                {profile.linkedin_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {profile.website_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2 text-green-600" />
                      Sito Web
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Data registrazione */}
          {profile.created_at && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>
                  Registrato il {new Date(profile.created_at).toLocaleDateString('it-IT')}
                </span>
              </div>
            </div>
          )}

          {/* Messaggio di contatto */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 text-center">
              📞 Contatta direttamente il recruiter per maggiori informazioni sui candidati
            </p>
          </div>
        </CardContent>
      </Card>

      <RecruiterProfileViewModal
        open={showFullProfile}
        onOpenChange={setShowFullProfile}
        profile={profile}
      />
    </>
  );
}
