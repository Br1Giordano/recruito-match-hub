import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface DigitalContract {
  id: string;
  contract_type: string;
  title: string;
  content: string;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  template_data?: any;
}

export interface SignedContract {
  id: string;
  contract_id: string;
  user_id: string;
  user_email: string;
  user_type: string;
  signature_data: any;
  signed_at: string;
  status: string;
  expiry_date?: string;
  contract_data?: any;
}

export interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  variables: any;
  is_mandatory: boolean;
  version: string;
}

export const useDigitalContracts = () => {
  const [contracts, setContracts] = useState<DigitalContract[]>([]);
  const [signedContracts, setSignedContracts] = useState<SignedContract[]>([]);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchContracts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('digital_contracts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Errore nel caricamento dei contratti');
    } finally {
      setLoading(false);
    }
  };

  const fetchSignedContracts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('signed_contracts')
        .select('*')
        .eq('user_id', user.id)
        .order('signed_at', { ascending: false });

      if (error) throw error;
      setSignedContracts(data || []);
    } catch (error) {
      console.error('Error fetching signed contracts:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('contract_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const signContract = async (contractId: string, signatureData: any) => {
    if (!user) {
      toast.error('Devi essere autenticato per firmare un contratto');
      return false;
    }

    try {
      const { error } = await supabase
        .from('signed_contracts')
        .insert({
          contract_id: contractId,
          user_id: user.id,
          user_email: user.email!,
          user_type: 'company', // TODO: Get from user profile
          signature_data: signatureData,
          ip_address: '0.0.0.0', // TODO: Get real IP
          user_agent: navigator.userAgent
        });

      if (error) throw error;
      
      toast.success('Contratto firmato con successo');
      await fetchSignedContracts();
      return true;
    } catch (error) {
      console.error('Error signing contract:', error);
      toast.error('Errore nella firma del contratto');
      return false;
    }
  };

  const generateContract = async (templateId: string, variables: Record<string, any>) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template non trovato');

      let content = template.content;
      Object.entries(variables).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      const { data, error } = await supabase
        .from('digital_contracts')
        .insert({
          contract_type: template.category,
          title: `${template.name} - ${new Date().toLocaleDateString()}`,
          content,
          template_data: variables,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Contratto generato con successo');
      await fetchContracts();
      return data;
    } catch (error) {
      console.error('Error generating contract:', error);
      toast.error('Errore nella generazione del contratto');
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchContracts();
      fetchSignedContracts();
      fetchTemplates();
    }
  }, [user]);

  return {
    contracts,
    signedContracts,
    templates,
    loading,
    signContract,
    generateContract,
    refetch: () => {
      fetchContracts();
      fetchSignedContracts();
      fetchTemplates();
    }
  };
};