import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, Download, Eye, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CVViewerProps {
  cvUrl?: string;
  candidateName: string;
  trigger?: React.ReactNode;
}

export default function CVViewer({ cvUrl, candidateName, trigger }: CVViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  if (!cvUrl) {
    return (
      <Badge variant="secondary" className="text-gray-500">
        <FileText className="h-3 w-3 mr-1" />
        Nessun CV
      </Badge>
    );
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(cvUrl);
      const blob = await response.blob();
      
      // Estrai il nome del file dall'URL o usa un nome di default
      const fileName = cvUrl.split('/').pop() || `CV_${candidateName.replace(' ', '_')}.pdf`;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download completato",
        description: `CV di ${candidateName} scaricato con successo`,
      });
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast({
        title: "Errore download",
        description: "Impossibile scaricare il CV",
        variant: "destructive",
      });
    }
  };

  const handleOpenInNewTab = () => {
    window.open(cvUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-2" />
            Visualizza CV
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            CV di {candidateName}
          </DialogTitle>
          <DialogDescription>
            Visualizza o scarica il CV del candidato
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">CV Candidato</span>
            </div>
            <p className="text-sm text-blue-700">
              Il CV di <strong>{candidateName}</strong> è disponibile per la visualizzazione e il download.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleOpenInNewTab} className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Visualizza CV
            </Button>
            
            <Button variant="outline" onClick={handleDownload} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Scarica CV
            </Button>
            
            <Button variant="ghost" onClick={handleOpenInNewTab} className="w-full text-blue-600">
              <ExternalLink className="h-4 w-4 mr-2" />
              Apri in nuova scheda
            </Button>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <strong>Nota:</strong> Il CV verrà aperto nel tuo browser predefinito. Assicurati di avere un visualizzatore PDF installato per una migliore esperienza.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}