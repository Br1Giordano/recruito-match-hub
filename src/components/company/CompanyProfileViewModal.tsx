import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, MapPin, Users, Calendar } from 'lucide-react';
import { useCompanyProfileByEmail } from '@/hooks/useCompanyProfileByEmail';
import { useEffect } from 'react';
import CompanyAvatar from './CompanyAvatar';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface CompanyProfileViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyEmail?: string;
  companyRegistrationId?: string;
}

export default function CompanyProfileViewModal({ 
  open, 
  onOpenChange, 
  companyEmail,
  companyRegistrationId 
}: CompanyProfileViewModalProps) {
  const { profile, loading, fetchProfileByEmail, fetchProfileByRegistrationId, clearProfile } = useCompanyProfileByEmail();

  useEffect(() => {
    if (open && companyEmail) {
      fetchProfileByEmail(companyEmail);
    } else if (open && companyRegistrationId) {
      fetchProfileByRegistrationId(companyRegistrationId);
    } else if (!open) {
      clearProfile();
    }
  }, [open, companyEmail, companyRegistrationId]);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-lg">Caricamento profilo azienda...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!profile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-lg text-muted-foreground">Profilo azienda non trovato</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <CompanyAvatar
              logoUrl={profile.logo_url}
              companyName={profile.nome_azienda}
              size="lg"
            />
            <div>
              <h2 className="text-xl font-semibold">{profile.nome_azienda}</h2>
              {profile.settore && (
                <p className="text-sm text-muted-foreground">{profile.settore}</p>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informazioni di contatto */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Informazioni Azienda
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Removed email and phone information for recruiters */}
              
              {profile.sede && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.sede}</span>
                </div>
              )}
              
              {profile.employee_count_range && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.employee_count_range}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Descrizione azienda */}
          {profile.messaggio && (
            <div className="space-y-2">
              <h3 className="font-semibold">Descrizione Azienda</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profile.messaggio}
              </p>
            </div>
          )}

          <Separator />

          {/* Informazioni aggiuntive */}
          <div className="space-y-4">
            <h3 className="font-semibold">Informazioni Aggiuntive</h3>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Registrata il {format(new Date(profile.created_at), 'dd MMMM yyyy', { locale: it })}
              </Badge>
              
              {profile.status && (
                <Badge 
                  variant={profile.status === 'approved' ? 'default' : 'secondary'}
                  className={profile.status === 'approved' ? 'bg-green-600' : ''}
                >
                  {profile.status === 'approved' ? 'Verificata' : 'In Attesa di Verifica'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}