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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Building2, MapPin, Users, Mail, Phone } from 'lucide-react';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { useAuth } from '@/hooks/useAuth';

interface CompanyProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const employeeRanges = [
  '1-10 dipendenti',
  '11-50 dipendenti',
  '51-100 dipendenti',
  '101-500 dipendenti',
  '501-1000 dipendenti',
  '1000+ dipendenti'
];

export default function CompanyProfileModal({ open, onOpenChange }: CompanyProfileModalProps) {
  const { profile, updateProfile, createProfile } = useCompanyProfile();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome_azienda: '',
    settore: '',
    email: '',
    telefono: '',
    sede: '',
    employee_count_range: '',
    messaggio: ''
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
        nome_azienda: profile.nome_azienda || '',
        settore: profile.settore || '',
        email: profile.email || '',
        telefono: profile.telefono || '',
        sede: profile.sede || '',
        employee_count_range: profile.employee_count_range || '',
        messaggio: profile.messaggio || ''
      });
      setIsEditing(false);
    }
  }, [profile, open, user?.email]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    let success = false;
    if (profile) {
      success = await updateProfile(formData);
    } else {
      success = await createProfile(formData);
    }
    
    if (success) {
      setIsEditing(false);
    }
  };

  const displayProfile = profile || {
    nome_azienda: formData.nome_azienda,
    settore: formData.settore,
    email: formData.email,
    telefono: formData.telefono,
    sede: formData.sede,
    employee_count_range: formData.employee_count_range,
    messaggio: formData.messaggio
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {profile ? 'Profilo Azienda' : 'Crea il tuo Profilo Azienda'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header con info base */}
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-recruito-teal rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="nome_azienda">Nome Azienda *</Label>
                    <Input
                      id="nome_azienda"
                      value={formData.nome_azienda}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome_azienda: e.target.value }))}
                      required
                      placeholder="Il nome della tua azienda"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      placeholder="contatti@tuaazienda.com"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {displayProfile.nome_azienda}
                  </h2>
                  <div className="flex items-center gap-1 text-gray-600 mt-1">
                    <Mail className="h-4 w-4" />
                    <span>{displayProfile.email}</span>
                  </div>
                  {displayProfile.sede && (
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{displayProfile.sede}</span>
                    </div>
                  )}
                  {displayProfile.employee_count_range && (
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <Users className="h-4 w-4" />
                      <span>{displayProfile.employee_count_range}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Dettagli azienda */}
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="settore">Settore</Label>
                  <Input
                    id="settore"
                    value={formData.settore}
                    onChange={(e) => setFormData(prev => ({ ...prev, settore: e.target.value }))}
                    placeholder="es. Tecnologia, Marketing..."
                  />
                </div>
                <div>
                  <Label htmlFor="sede">Sede</Label>
                  <Input
                    id="sede"
                    value={formData.sede}
                    onChange={(e) => setFormData(prev => ({ ...prev, sede: e.target.value }))}
                    placeholder="es. Milano, Italia"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                    placeholder="+39 123 456 7890"
                  />
                </div>
                <div>
                  <Label htmlFor="employee_range">Range Dipendenti</Label>
                  <Select
                    value={formData.employee_count_range}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, employee_count_range: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona range" />
                    </SelectTrigger>
                    <SelectContent>
                      {employeeRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">Settore</Label>
                <p className="mt-1 text-gray-900">{displayProfile.settore || "Non specificato"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Sede</Label>
                <p className="mt-1 text-gray-900">{displayProfile.sede || "Non specificata"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Telefono</Label>
                <p className="mt-1 text-gray-900">
                  {displayProfile.telefono ? (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{displayProfile.telefono}</span>
                    </div>
                  ) : (
                    "Non specificato"
                  )}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Dimensioni</Label>
                <p className="mt-1 text-gray-900">{displayProfile.employee_count_range || "Non specificato"}</p>
              </div>
            </div>
          )}

          {/* Descrizione */}
          <div>
            <Label>Descrizione azienda</Label>
            {isEditing ? (
              <Textarea
                value={formData.messaggio}
                onChange={(e) => setFormData(prev => ({ ...prev, messaggio: e.target.value }))}
                placeholder="Racconta della tua azienda, delle tue esigenze di recruiting..."
                rows={4}
                className="mt-2"
              />
            ) : (
              <p className="mt-2 text-gray-700">
                {displayProfile.messaggio || "Nessuna descrizione disponibile"}
              </p>
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
                  disabled={!formData.nome_azienda || !formData.email}
                  className="gradient-recruito text-white border-0 hover:opacity-90"
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