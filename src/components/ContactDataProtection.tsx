import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Eye, EyeOff, Mail, Phone, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactData {
  email?: string;
  phone?: string;
  linkedin?: string;
  isProtected: boolean;
  accessLevel: 'restricted' | 'partial' | 'full';
}

interface ContactDataProtectionProps {
  contactData: ContactData;
  candidateName: string;
  proposalId: string;
  userType: 'company' | 'recruiter';
  onRequestAccess?: (proposalId: string) => void;
}

export default function ContactDataProtection({
  contactData,
  candidateName,
  proposalId,
  userType,
  onRequestAccess
}: ContactDataProtectionProps) {
  const [showingFull, setShowingFull] = useState(false);
  const { toast } = useToast();

  const obscureEmail = (email: string): string => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const obscuredUsername = username.charAt(0) + '*'.repeat(username.length - 1);
    const obscuredDomain = '*'.repeat(domain.length - 4) + domain.slice(-4);
    return `${obscuredUsername}@${obscuredDomain}`;
  };

  const obscurePhone = (phone: string): string => {
    if (!phone) return '';
    return phone.slice(0, 3) + ' *** *** ****';
  };

  const obscureLinkedin = (linkedin: string): string => {
    if (!linkedin) return '';
    return 'linkedin.com/in/******';
  };

  const getDisplayData = () => {
    if (!contactData.isProtected || contactData.accessLevel === 'full' || userType === 'recruiter') {
      return {
        email: contactData.email || 'Non specificata',
        phone: contactData.phone || 'Non specificato',
        linkedin: contactData.linkedin || 'Non specificato'
      };
    }

    if (contactData.accessLevel === 'partial') {
      return {
        email: contactData.email ? obscureEmail(contactData.email) : 'Non specificata',
        phone: contactData.phone || 'Non specificato',
        linkedin: contactData.linkedin || 'Non specificato'
      };
    }

    // Restricted access
    return {
      email: contactData.email ? obscureEmail(contactData.email) : 'Non specificata',
      phone: contactData.phone ? obscurePhone(contactData.phone) : 'Non specificato',
      linkedin: contactData.linkedin ? obscureLinkedin(contactData.linkedin) : 'Non specificato'
    };
  };

  const handleRequestFullAccess = () => {
    if (onRequestAccess) {
      onRequestAccess(proposalId);
      toast({
        title: "Richiesta inviata",
        description: "Abbiamo inviato la richiesta al recruiter per accedere ai dati completi del candidato.",
      });
    }
  };

  const displayData = getDisplayData();
  const canRequestAccess = userType === 'company' && 
                          contactData.isProtected && 
                          contactData.accessLevel === 'restricted';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Informazioni di Contatto</span>
        {contactData.isProtected && (
          <Badge variant="secondary" className="text-xs">
            {contactData.accessLevel === 'restricted' ? 'Protetti' : 
             contactData.accessLevel === 'partial' ? 'Parziali' : 'Completi'}
          </Badge>
        )}
      </div>

      <div className="grid gap-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{displayData.email}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{displayData.phone}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Linkedin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{displayData.linkedin}</span>
        </div>
      </div>

      {canRequestAccess && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Richiedi Dati Completi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Richiedi Accesso Completo</DialogTitle>
              <DialogDescription>
                Per proteggere la privacy dei candidati, alcuni dati di contatto sono oscurati. 
                Richiedi l'accesso completo al recruiter per ottenere email e telefono non censurati.
              </DialogDescription>
            </DialogHeader>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Candidato: {candidateName}</CardTitle>
                <CardDescription>
                  La richiesta verrà inviata al recruiter che ha proposto questo candidato.
                  Riceverai una notifica quando i dati saranno disponibili.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleRequestFullAccess} className="w-full">
                  Invia Richiesta
                </Button>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}

      {contactData.isProtected && userType === 'company' && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          <Shield className="h-3 w-3 inline mr-1" />
          I dati di contatto sono protetti per evitare il contatto diretto con il candidato.
        </div>
      )}
    </div>
  );
}