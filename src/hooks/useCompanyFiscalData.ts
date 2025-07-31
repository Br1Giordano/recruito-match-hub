import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { isFiscalDataComplete } from '@/utils/fiscalValidation';

export interface CompanyFiscalData {
  id?: string;
  company_id: string;
  codice_fiscale?: string;
  partita_iva?: string;
  ragione_sociale?: string;
  codice_sdi?: string;
  pec?: string;
  indirizzo_fatturazione?: string;
  cap_fatturazione?: string;
  citta_fatturazione?: string;
  provincia_fatturazione?: string;
  iban?: string;
  swift?: string;
  is_complete?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useCompanyFiscalData() {
  const [fiscalData, setFiscalData] = useState<CompanyFiscalData | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFiscalData = async (companyId: string) => {
    if (!companyId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_fiscal_data')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching fiscal data:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati fiscali",
          variant: "destructive",
        });
        return;
      }

      setFiscalData(data);
    } catch (error) {
      console.error('Error in fetchFiscalData:', error);
      toast({
        title: "Errore",
        description: "Errore durante il caricamento dei dati fiscali",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFiscalData = async (companyId: string, updates: Partial<CompanyFiscalData>) => {
    if (!user || !companyId) return;

    setLoading(true);
    try {
      // Calculate if data is complete
      const updatedData = { ...fiscalData, ...updates };
      const isComplete = isFiscalDataComplete(updatedData);

      const dataToUpdate = {
        ...updates,
        is_complete: isComplete,
      };

      const { data, error } = await supabase
        .from('company_fiscal_data')
        .update(dataToUpdate)
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) {
        console.error('Error updating fiscal data:', error);
        toast({
          title: "Errore",
          description: "Impossibile aggiornare i dati fiscali",
          variant: "destructive",
        });
        return;
      }

      setFiscalData(data);
      toast({
        title: "Successo",
        description: "Dati fiscali aggiornati con successo",
      });
    } catch (error) {
      console.error('Error in updateFiscalData:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'aggiornamento dei dati fiscali",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createFiscalData = async (companyId: string, fiscalDataInput: Omit<CompanyFiscalData, 'id' | 'created_at' | 'updated_at' | 'company_id'>) => {
    if (!user || !companyId) return;

    setLoading(true);
    try {
      // Calculate if data is complete
      const isComplete = isFiscalDataComplete(fiscalDataInput);

      const dataToInsert = {
        ...fiscalDataInput,
        company_id: companyId,
        is_complete: isComplete,
      };

      const { data, error } = await supabase
        .from('company_fiscal_data')
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {
        console.error('Error creating fiscal data:', error);
        toast({
          title: "Errore",
          description: "Impossibile creare i dati fiscali",
          variant: "destructive",
        });
        return;
      }

      setFiscalData(data);
      toast({
        title: "Successo",
        description: "Dati fiscali creati con successo",
      });
    } catch (error) {
      console.error('Error in createFiscalData:', error);
      toast({
        title: "Errore",
        description: "Errore durante la creazione dei dati fiscali",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveFiscalData = async (companyId: string, fiscalDataInput: Omit<CompanyFiscalData, 'id' | 'created_at' | 'updated_at' | 'company_id'>) => {
    if (fiscalData?.id) {
      await updateFiscalData(companyId, fiscalDataInput);
    } else {
      await createFiscalData(companyId, fiscalDataInput);
    }
  };

  return {
    fiscalData,
    loading,
    fetchFiscalData,
    updateFiscalData,
    createFiscalData,
    saveFiscalData,
    refreshFiscalData: (companyId: string) => fetchFiscalData(companyId),
  };
}