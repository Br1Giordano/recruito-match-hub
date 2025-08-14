import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface GDPRRequest {
  id: string;
  user_id?: string;
  user_email: string;
  request_type: 'data_access' | 'data_deletion' | 'data_portability' | 'rectification';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  description?: string;
  requested_data?: string[];
  response_data?: any;
  created_at: string;
  updated_at: string;
  processed_by?: string;
  completed_at?: string;
  rejection_reason?: string;
}

export interface GDPRActivityLog {
  id: string;
  user_id?: string;
  user_email?: string;
  activity_type: 'data_access' | 'data_deletion' | 'data_export' | 'consent_update';
  description: string;
  data_categories?: string[];
  legal_basis?: string;
  created_at: string;
  metadata?: any;
}

export interface LegalNotification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  target_audience: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  read_at?: string;
  created_at: string;
  expires_at?: string;
}

export const useGDPRCompliance = () => {
  const [gdprRequests, setGdprRequests] = useState<GDPRRequest[]>([]);
  const [activityLog, setActivityLog] = useState<GDPRActivityLog[]>([]);
  const [notifications, setNotifications] = useState<LegalNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchGDPRRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('gdpr_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGdprRequests((data || []) as GDPRRequest[]);
    } catch (error) {
      console.error('Error fetching GDPR requests:', error);
    }
  };

  const fetchActivityLog = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('gdpr_activity_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivityLog((data || []) as GDPRActivityLog[]);
    } catch (error) {
      console.error('Error fetching activity log:', error);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('legal_notifications')
        .select('*')
        .or(`target_audience.eq.all_users,target_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications((data || []) as LegalNotification[]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const createGDPRRequest = async (
    requestType: GDPRRequest['request_type'],
    description: string,
    requestedData?: string[]
  ) => {
    if (!user) {
      toast.error('Devi essere autenticato per fare una richiesta GDPR');
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('gdpr_requests')
        .insert({
          user_id: user.id,
          user_email: user.email!,
          request_type: requestType,
          description,
          requested_data: requestedData
        });

      if (error) throw error;
      
      // Log the activity
      await logGDPRActivity(
        'data_access',
        `Richiesta GDPR creata: ${requestType}`,
        ['personal_data'],
        'user_consent'
      );
      
      toast.success('Richiesta GDPR inviata con successo');
      await fetchGDPRRequests();
      return true;
    } catch (error) {
      console.error('Error creating GDPR request:', error);
      toast.error('Errore nell\'invio della richiesta GDPR');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logGDPRActivity = async (
    activityType: GDPRActivityLog['activity_type'],
    description: string,
    dataCategories?: string[],
    legalBasis?: string,
    metadata?: any
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('gdpr_activity_log')
        .insert({
          user_id: user.id,
          user_email: user.email!,
          activity_type: activityType,
          description,
          data_categories: dataCategories,
          legal_basis: legalBasis,
          metadata
        });

      if (error) throw error;
      await fetchActivityLog();
    } catch (error) {
      console.error('Error logging GDPR activity:', error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('legal_notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const exportUserData = async () => {
    if (!user) return null;

    setLoading(true);
    try {
      // Fetch all user data from various tables
      const [
        profileData,
        proposalsData,
        reviewsData,
        messagesData
      ] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('auth_user_id', user.id),
        supabase.from('proposals').select('*').eq('user_id', user.id),
        supabase.from('recruiter_reviews').select('*').eq('recruiter_email', user.email),
        supabase.from('messages').select('*').eq('sender_email', user.email)
      ]);

      const userData = {
        profile: profileData.data,
        proposals: proposalsData.data,
        reviews: reviewsData.data,
        messages: messagesData.data,
        exported_at: new Date().toISOString()
      };

      // Log the export activity
      await logGDPRActivity(
        'data_export',
        'Esportazione dati utente completata',
        ['profile', 'proposals', 'reviews', 'messages'],
        'user_request'
      );

      toast.success('Dati esportati con successo');
      return userData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      toast.error('Errore nell\'esportazione dei dati');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGDPRRequests();
      fetchActivityLog();
      fetchNotifications();
    }
  }, [user]);

  return {
    gdprRequests,
    activityLog,
    notifications,
    loading,
    createGDPRRequest,
    logGDPRActivity,
    markNotificationAsRead,
    exportUserData,
    refetch: () => {
      fetchGDPRRequests();
      fetchActivityLog();
      fetchNotifications();
    }
  };
};