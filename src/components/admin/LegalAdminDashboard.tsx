import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Shield, 
  FileText, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { toast } from 'sonner';

interface AdminStats {
  total_users: number;
  pending_gdpr_requests: number;
  active_contracts: number;
  compliance_alerts: number;
}

interface GDPRRequestAdmin {
  id: string;
  user_email: string;
  request_type: string;
  status: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const LegalAdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    pending_gdpr_requests: 0,
    active_contracts: 0,
    compliance_alerts: 0
  });
  const [gdprRequests, setGdprRequests] = useState<GDPRRequestAdmin[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<GDPRRequestAdmin | null>(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchStats = async () => {
    try {
      const [usersCount, gdprCount, contractsCount] = await Promise.all([
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('gdpr_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('signed_contracts').select('*', { count: 'exact', head: true }).eq('status', 'active')
      ]);

      setStats({
        total_users: usersCount.count || 0,
        pending_gdpr_requests: gdprCount.count || 0,
        active_contracts: contractsCount.count || 0,
        compliance_alerts: 2 // Mock value
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchGDPRRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('gdpr_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGdprRequests(data || []);
    } catch (error) {
      console.error('Error fetching GDPR requests:', error);
    }
  };

  const updateGDPRRequestStatus = async (
    requestId: string, 
    newStatus: string, 
    response?: string
  ) => {
    setLoading(true);
    try {
      const updateData: any = {
        status: newStatus,
        processed_by: user?.id,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'completed' || newStatus === 'rejected') {
        updateData.completed_at = new Date().toISOString();
        if (response) {
          updateData.response_data = { response_text: response };
        }
        if (newStatus === 'rejected') {
          updateData.rejection_reason = response;
        }
      }

      const { error } = await supabase
        .from('gdpr_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Richiesta GDPR aggiornata con successo');
      await fetchGDPRRequests();
      await fetchStats();
      setSelectedRequest(null);
      setResponseText('');
    } catch (error) {
      console.error('Error updating GDPR request:', error);
      toast.error('Errore nell\'aggiornamento della richiesta');
    } finally {
      setLoading(false);
    }
  };

  const sendLegalNotification = async (
    targetAudience: string,
    title: string,
    message: string,
    priority: string
  ) => {
    try {
      const { error } = await supabase
        .from('legal_notifications')
        .insert({
          notification_type: 'admin_announcement',
          title,
          message,
          target_audience: targetAudience,
          priority
        });

      if (error) throw error;
      toast.success('Notifica inviata con successo');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Errore nell\'invio della notifica');
    }
  };

  const generateComplianceReport = async () => {
    try {
      // Fetch compliance data
      const [gdprData, contractsData, activityData] = await Promise.all([
        supabase.from('gdpr_requests').select('*'),
        supabase.from('signed_contracts').select('*'),
        supabase.from('gdpr_activity_log').select('*').limit(100)
      ]);

      const report = {
        generated_at: new Date().toISOString(),
        gdpr_requests: gdprData.data,
        contracts: contractsData.data,
        recent_activity: activityData.data,
        compliance_summary: {
          total_gdpr_requests: gdprData.data?.length || 0,
          pending_requests: gdprData.data?.filter(r => r.status === 'pending').length || 0,
          active_contracts: contractsData.data?.filter(c => c.status === 'active').length || 0
        }
      };

      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Report di compliance generato con successo');
    } catch (error) {
      console.error('Error generating compliance report:', error);
      toast.error('Errore nella generazione del report');
    }
  };

  useEffect(() => {
    fetchStats();
    fetchGDPRRequests();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary' as const,
      in_progress: 'default' as const,
      completed: 'default' as const,
      rejected: 'outline' as const
    };
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Legale Admin</h1>
          <p className="text-muted-foreground">
            Gestione conformità GDPR e supervisione contratti
          </p>
        </div>
        <Button onClick={generateComplianceReport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Report Compliance
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utenti Totali
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Richieste GDPR Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_gdpr_requests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contratti Attivi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_contracts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alert Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.compliance_alerts}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gdpr-requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gdpr-requests">Richieste GDPR</TabsTrigger>
          <TabsTrigger value="notifications">Notifiche</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="gdpr-requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gestione Richieste GDPR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {gdprRequests.map((request) => (
                    <Card key={request.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{request.user_email}</h4>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Tipo: {request.request_type.replace('_', ' ').toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Creata il: {format(new Date(request.created_at), 'dd MMM yyyy HH:mm', { locale: it })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateGDPRRequestStatus(request.id, 'in_progress')}
                                disabled={loading}
                              >
                                Accetta
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSelectedRequest(request)}
                                  >
                                    Gestisci
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Gestisci Richiesta GDPR</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <p><strong>Email:</strong> {request.user_email}</p>
                                      <p><strong>Tipo:</strong> {request.request_type}</p>
                                      <p><strong>Descrizione:</strong> {request.description}</p>
                                    </div>
                                    <Textarea
                                      placeholder="Risposta o note..."
                                      value={responseText}
                                      onChange={(e) => setResponseText(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => updateGDPRRequestStatus(request.id, 'completed', responseText)}
                                        disabled={loading}
                                      >
                                        Completa
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => updateGDPRRequestStatus(request.id, 'rejected', responseText)}
                                        disabled={loading}
                                      >
                                        Rifiuta
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invia Notifica Legale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Nuova Notifica
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invia Notifica Legale</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Destinatari" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_users">Tutti gli utenti</SelectItem>
                        <SelectItem value="companies">Solo aziende</SelectItem>
                        <SelectItem value="recruiters">Solo recruiter</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Priorità" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Bassa</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="critical">Critica</SelectItem>
                      </SelectContent>
                    </Select>

                    <input 
                      type="text" 
                      placeholder="Titolo notifica" 
                      className="w-full p-2 border rounded"
                    />
                    
                    <Textarea placeholder="Messaggio della notifica..." />
                    
                    <Button className="w-full">Invia Notifica</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Funzionalità di audit in sviluppo...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};