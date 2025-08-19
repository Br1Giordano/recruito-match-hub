
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useCVAnonymization = () => {
  const [isAnonymizing, setIsAnonymizing] = useState(false);
  const { toast } = useToast();

  const anonymizeCV = async (proposalId: string, cvText: string) => {
    try {
      setIsAnonymizing(true);
      
      // Chiamata all'AI assistant per anonimizzare il CV
      const { data, error } = await supabase.functions.invoke('ai-proposal-assistant', {
        body: {
          action: 'anonymize_cv',
          data: { cvText }
        }
      });

      if (error) {
        console.error('Errore durante l\'anonimizzazione:', error);
        throw new Error(error.message);
      }

      const anonymizedText = data;
      
      // Crea un blob con il testo anonimizzato
      const blob = new Blob([anonymizedText], { type: 'text/plain' });
      const file = new File([blob], `cv_anonymized_${proposalId}.txt`, { type: 'text/plain' });

      // Upload del CV anonimizzato
      const fileName = `cv_anonymized_${proposalId}_${Date.now()}.txt`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('candidate-cvs')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Errore upload CV anonimizzato:', uploadError);
        throw new Error(uploadError.message);
      }

      // Ottieni l'URL pubblico del CV anonimizzato
      const { data: { publicUrl } } = supabase.storage
        .from('candidate-cvs')
        .getPublicUrl(fileName);

      // Aggiorna la proposta con l'URL del CV anonimizzato
      const { error: updateError } = await supabase
        .from('proposals')
        .update({ 
          candidate_cv_anonymized_url: publicUrl,
          cv_processing_status: 'completed'
        })
        .eq('id', proposalId);

      if (updateError) {
        console.error('Errore aggiornamento proposta:', updateError);
        throw new Error(updateError.message);
      }

      toast({
        title: "CV Anonimizzato",
        description: "Il CV è stato anonimizzato con successo",
      });

      return publicUrl;

    } catch (error) {
      console.error('Errore nell\'anonimizzazione del CV:', error);
      
      // Aggiorna lo stato a "error" in caso di fallimento
      await supabase
        .from('proposals')
        .update({ cv_processing_status: 'error' })
        .eq('id', proposalId);

      toast({
        title: "Errore",
        description: "Errore durante l'anonimizzazione del CV",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsAnonymizing(false);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Per ora restituiamo un placeholder - in futuro si può implementare
    // l'estrazione del testo dal PDF usando una libreria come pdf-parse
    return `Contenuto del CV per il candidato.
    
Nome: [NOME CANDIDATO]
Email: [EMAIL CANDIDATO] 
Telefono: [TELEFONO CANDIDATO]
LinkedIn: [PROFILO LINKEDIN]

Esperienza Lavorativa:
- Sviluppatore presso [AZIENDA] (2020-2023)
- Analista presso [AZIENDA PRECEDENTE] (2018-2020)

Competenze:
- React, TypeScript, Node.js
- Database: PostgreSQL, MongoDB
- Cloud: AWS, Docker

Istruzione:
- Laurea in Informatica presso [UNIVERSITÀ]

Contatti:
Email: candidato@email.com
Telefono: +39 123 456 7890
LinkedIn: linkedin.com/in/candidato`;
  };

  return {
    anonymizeCV,
    extractTextFromPDF,
    isAnonymizing
  };
};
