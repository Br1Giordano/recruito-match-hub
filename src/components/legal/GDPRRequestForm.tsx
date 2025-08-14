import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, Download, Trash2, Edit, Eye } from 'lucide-react';
import { useGDPRCompliance, GDPRRequest } from '@/hooks/useGDPRCompliance';

export const GDPRRequestForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [requestType, setRequestType] = useState<GDPRRequest['request_type'] | ''>('');
  const [description, setDescription] = useState('');
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const { createGDPRRequest, loading } = useGDPRCompliance();

  const dataCategories = [
    { id: 'personal_data', label: 'Dati personali (nome, email, telefono)' },
    { id: 'profile_data', label: 'Dati del profilo' },
    { id: 'proposals', label: 'Proposte inviate' },
    { id: 'messages', label: 'Messaggi e conversazioni' },
    { id: 'reviews', label: 'Recensioni e valutazioni' },
    { id: 'activity_logs', label: 'Log delle attività' },
    { id: 'contracts', label: 'Contratti firmati' }
  ];

  const requestTypes = [
    { 
      value: 'data_access', 
      label: 'Accesso ai dati', 
      description: 'Richiedi una copia di tutti i tuoi dati personali',
      icon: Eye 
    },
    { 
      value: 'data_deletion', 
      label: 'Cancellazione dati', 
      description: 'Richiedi la cancellazione dei tuoi dati personali',
      icon: Trash2 
    },
    { 
      value: 'data_portability', 
      label: 'Portabilità dati', 
      description: 'Ricevi i tuoi dati in formato strutturato e leggibile',
      icon: Download 
    },
    { 
      value: 'rectification', 
      label: 'Rettifica dati', 
      description: 'Richiedi la correzione di dati inesatti',
      icon: Edit 
    }
  ];

  const handleDataSelection = (dataId: string, checked: boolean) => {
    if (checked) {
      setSelectedData([...selectedData, dataId]);
    } else {
      setSelectedData(selectedData.filter(id => id !== dataId));
    }
  };

  const handleSubmit = async () => {
    if (!requestType || !description.trim()) return;

    const success = await createGDPRRequest(
      requestType as GDPRRequest['request_type'],
      description,
      selectedData.length > 0 ? selectedData : undefined
    );

    if (success) {
      setIsOpen(false);
      setRequestType('');
      setDescription('');
      setSelectedData([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Nuova Richiesta GDPR
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Richiesta GDPR
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Tipo di Richiesta</Label>
            <div className="grid grid-cols-1 gap-3">
              {requestTypes.map((type) => (
                <Card 
                  key={type.value}
                  className={`cursor-pointer border-2 transition-colors ${
                    requestType === type.value 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setRequestType(type.value as GDPRRequest['request_type'])}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <type.icon className="h-5 w-5 mt-0.5 text-primary" />
                      <div>
                        <h4 className="font-medium">{type.label}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Data Categories */}
          {(requestType === 'data_access' || requestType === 'data_portability') && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Categorie di Dati (opzionale)</Label>
              <div className="grid grid-cols-1 gap-2">
                {dataCategories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedData.includes(category.id)}
                      onCheckedChange={(checked) => handleDataSelection(category.id, checked as boolean)}
                    />
                    <Label htmlFor={category.id} className="text-sm">
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              Descrizione della Richiesta
            </Label>
            <Textarea
              id="description"
              placeholder="Descrivi la tua richiesta in dettaglio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Legal Notice */}
          <Card className="bg-muted">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Informazioni legali:</strong> Le richieste GDPR vengono processate 
                entro 30 giorni come previsto dal Regolamento UE 2016/679. Potresti essere 
                contattato per verifiche di identità prima del processamento della richiesta.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annulla
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!requestType || !description.trim() || loading}
          >
            {loading ? 'Invio...' : 'Invia Richiesta'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};