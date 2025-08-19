
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield, Eye, Download, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface CVViewerProps {
  proposal: {
    id: string;
    candidate_cv_url?: string;
    candidate_cv_anonymized_url?: string;
    cv_processing_status?: string;
    status: string;
    company_access_level?: 'restricted' | 'full';
    candidate_name: string;
  };
  userType: 'company' | 'recruiter';
}

export const CVViewer: React.FC<CVViewerProps> = ({ proposal, userType }) => {
  const [showCV, setShowCV] = useState(false);
  const { user } = useAuth();

  const canViewFullCV = () => {
    // I recruiter possono sempre vedere il CV completo
    if (userType === 'recruiter') return true;
    
    // Le aziende possono vedere il CV completo solo se la proposta è approvata/accettata
    if (userType === 'company') {
      return proposal.status in ['approved', 'accepted', 'under_review'];
    }
    
    return false;
  };

  const shouldShowAnonymizedCV = () => {
    // Mostra CV anonimizzato alle aziende quando la proposta è in stato pending/submitted
    return userType === 'company' && 
           !canViewFullCV() && 
           proposal.candidate_cv_anonymized_url &&
           proposal.cv_processing_status === 'completed';
  };

  const getCVUrl = () => {
    if (canViewFullCV() && proposal.candidate_cv_url) {
      return proposal.candidate_cv_url;
    }
    
    if (shouldShowAnonymizedCV()) {
      return proposal.candidate_cv_anonymized_url;
    }
    
    return null;
  };

  const getAccessLevelBadge = () => {
    if (userType === 'recruiter') {
      return <Badge variant="default">Accesso Completo</Badge>;
    }
    
    if (canViewFullCV()) {
      return <Badge variant="default">CV Completo</Badge>;
    }
    
    if (shouldShowAnonymizedCV()) {
      return <Badge variant="secondary"><Shield className="h-3 w-3 mr-1" />CV Anonimizzato</Badge>;
    }
    
    return <Badge variant="outline"><Lock className="h-3 w-3 mr-1" />Accesso Limitato</Badge>;
  };

  const getStatusMessage = () => {
    if (proposal.cv_processing_status === 'processing') {
      return "CV in elaborazione...";
    }
    
    if (proposal.cv_processing_status === 'error') {
      return "Errore nell'elaborazione del CV";
    }
    
    if (userType === 'company' && !canViewFullCV() && !shouldShowAnonymizedCV()) {
      return "Il CV completo sarà disponibile dopo l'approvazione della proposta";
    }
    
    return null;
  };

  const cvUrl = getCVUrl();
  const statusMessage = getStatusMessage();

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-600" />
          <span className="font-medium">CV di {proposal.candidate_name}</span>
        </div>
        {getAccessLevelBadge()}
      </div>

      {statusMessage && (
        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
          {statusMessage}
        </p>
      )}

      {!canViewFullCV() && shouldShowAnonymizedCV() && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">CV Protetto</p>
              <p className="text-blue-700">
                I dati di contatto sono stati oscurati per proteggere la privacy. 
                Il CV completo sarà disponibile dopo l'approvazione della proposta.
              </p>
            </div>
          </div>
        </div>
      )}

      {cvUrl && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(cvUrl, '_blank')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualizza CV
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const link = document.createElement('a');
              link.href = cvUrl;
              link.download = `CV_${proposal.candidate_name}_${canViewFullCV() ? 'completo' : 'anonimizzato'}.pdf`;
              link.click();
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Scarica
          </Button>
        </div>
      )}

      {!cvUrl && proposal.cv_processing_status === 'completed' && (
        <p className="text-sm text-gray-500">
          Nessun CV disponibile per il tuo livello di accesso
        </p>
      )}
    </div>
  );
};
