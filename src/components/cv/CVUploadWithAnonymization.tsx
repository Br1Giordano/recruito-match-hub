
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUp, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { useCVAnonymization } from '@/hooks/useCVAnonymization';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CVUploadWithAnonymizationProps {
  proposalId?: string;
  onCVUploaded: (cvUrl: string, originalFileName: string) => void;
  onAnonymizedCVReady: (anonymizedUrl: string) => void;
}

export const CVUploadWithAnonymization: React.FC<CVUploadWithAnonymizationProps> = ({
  proposalId,
  onCVUploaded,
  onAnonymizedCVReady
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cvStatus, setCvStatus] = useState<'none' | 'uploaded' | 'anonymizing' | 'completed' | 'error'>('none');
  
  const { anonymizeCV, extractTextFromPDF, isAnonymizing } = useCVAnonymization();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Errore",
        description: "Seleziona un file PDF valido",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setCvStatus('uploaded');

      // Upload del CV originale
      const fileName = `cv_${proposalId || Date.now()}_${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('candidate-cvs')
        .upload(fileName, selectedFile);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Ottieni l'URL pubblico
      const { data: { publicUrl } } = supabase.storage
        .from('candidate-cvs')
        .getPublicUrl(fileName);

      // Notifica l'upload del CV originale
      onCVUploaded(publicUrl, selectedFile.name);

      toast({
        title: "CV Caricato",
        description: "Il CV è stato caricato con successo",
      });

      // Avvia l'anonimizzazione se abbiamo un proposalId
      if (proposalId) {
        setCvStatus('anonymizing');
        
        // Estrai il testo dal PDF (per ora usa un placeholder)
        const cvText = await extractTextFromPDF(selectedFile);
        
        // Anonimizza il CV
        const anonymizedUrl = await anonymizeCV(proposalId, cvText);
        
        onAnonymizedCVReady(anonymizedUrl);
        setCvStatus('completed');
      }

    } catch (error) {
      console.error('Errore durante l\'upload:', error);
      setCvStatus('error');
      toast({
        title: "Errore",
        description: "Errore durante il caricamento del CV",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (cvStatus) {
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'anonymizing':
        return <Shield className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (cvStatus) {
      case 'uploaded':
        return 'CV caricato';
      case 'anonymizing':
        return 'Anonimizzazione in corso...';
      case 'completed':
        return 'CV anonimizzato completato';
      case 'error':
        return 'Errore nell\'elaborazione';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cv-upload">CV del Candidato (PDF) *</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="cv-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={isUploading || isAnonymizing}
          />
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || isAnonymizing}
            size="sm"
          >
            <FileUp className="h-4 w-4 mr-2" />
            {isUploading ? 'Caricamento...' : 'Carica'}
          </Button>
        </div>
      </div>

      {/* Status dell'elaborazione */}
      {cvStatus !== 'none' && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
          {getStatusIcon()}
          <span className="text-sm">{getStatusText()}</span>
        </div>
      )}

      {/* Informazione sulla privacy */}
      {cvStatus === 'completed' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">CV Protetto</p>
              <p className="text-sm text-blue-700 mt-1">
                Il CV è stato automaticamente anonimizzato. Le aziende vedranno una versione 
                con i dati di contatto oscurati fino all'approvazione della proposta.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
