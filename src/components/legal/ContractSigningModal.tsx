import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Shield, Calendar, User } from 'lucide-react';
import { DigitalContract } from '@/hooks/useDigitalContracts';
import { toast } from 'sonner';

interface ContractSigningModalProps {
  contract: DigitalContract | null;
  isOpen: boolean;
  onClose: () => void;
  onSign: (contractId: string, signatureData: any) => Promise<boolean>;
}

export const ContractSigningModal = ({
  contract,
  isOpen,
  onClose,
  onSign
}: ContractSigningModalProps) => {
  const [hasReadContract, setHasReadContract] = useState(false);
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [signing, setSigning] = useState(false);

  const handleSign = async () => {
    if (!contract || !hasReadContract || !acceptsTerms) {
      toast.error('Devi leggere e accettare tutti i termini per procedere');
      return;
    }

    setSigning(true);
    try {
      const signatureData = {
        signature_type: 'electronic_simple',
        timestamp: new Date().toISOString(),
        terms_accepted: true,
        contract_read: true,
        user_agent: navigator.userAgent,
        signature_method: 'checkbox_acceptance'
      };

      const success = await onSign(contract.id, signatureData);
      if (success) {
        onClose();
        setHasReadContract(false);
        setAcceptsTerms(false);
      }
    } catch (error) {
      console.error('Error signing contract:', error);
      toast.error('Errore durante la firma del contratto');
    } finally {
      setSigning(false);
    }
  };

  if (!contract) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Firma Contratto Digitale
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-6">
          {/* Contract Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{contract.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Tipo: {contract.contract_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Versione: {contract.version}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Content */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg">Contenuto del Contratto</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full border rounded-lg p-4">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {contract.content}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Signature Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Firma Elettronica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="read-contract"
                  checked={hasReadContract}
                  onCheckedChange={(checked) => setHasReadContract(checked === true)}
                />
                <label
                  htmlFor="read-contract"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Dichiaro di aver letto e compreso interamente il contenuto del contratto
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accept-terms"
                  checked={acceptsTerms}
                  onCheckedChange={(checked) => setAcceptsTerms(checked === true)}
                />
                <label
                  htmlFor="accept-terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accetto tutti i termini e le condizioni del contratto e autorizzo la firma elettronica
                </label>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Nota legale:</strong> La firma elettronica semplice ha lo stesso valore legale 
                  di una firma autografa secondo il Regolamento eIDAS (UE) 910/2014 e il Codice 
                  dell'Amministrazione Digitale (CAD).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button
            onClick={handleSign}
            disabled={!hasReadContract || !acceptsTerms || signing}
            className="min-w-32"
          >
            {signing ? 'Firmando...' : 'Firma Contratto'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};