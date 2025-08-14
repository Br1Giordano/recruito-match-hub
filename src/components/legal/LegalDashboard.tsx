import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Shield, 
  Bell, 
  Download, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Eye
} from 'lucide-react';
import { useDigitalContracts } from '@/hooks/useDigitalContracts';
import { useGDPRCompliance } from '@/hooks/useGDPRCompliance';
import { ContractSigningModal } from './ContractSigningModal';
import { GDPRRequestForm } from './GDPRRequestForm';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export const LegalDashboard = () => {
  const [selectedContract, setSelectedContract] = useState(null);
  const [signingModalOpen, setSigningModalOpen] = useState(false);
  
  const { 
    contracts, 
    signedContracts, 
    templates, 
    loading: contractsLoading,
    signContract 
  } = useDigitalContracts();
  
  const { 
    gdprRequests, 
    activityLog, 
    notifications, 
    loading: gdprLoading,
    markNotificationAsRead,
    exportUserData 
  } = useGDPRCompliance();

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default' as const,
      pending: 'secondary' as const,
      completed: 'default' as const,
      rejected: 'outline' as const,
      in_progress: 'secondary' as const
    };
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'outline' as const,
      medium: 'secondary' as const,
      high: 'default' as const,
      critical: 'outline' as const
    };
    
    return <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>{priority}</Badge>;
  };

  const handleSignContract = (contract: any) => {
    setSelectedContract(contract);
    setSigningModalOpen(true);
  };

  const handleExportData = async () => {
    const data = await exportUserData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recruito-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Legale</h1>
          <p className="text-muted-foreground">
            Gestione contratti, conformità GDPR e notifiche legali
          </p>
        </div>
        <div className="flex gap-2">
          <GDPRRequestForm />
          <Button onClick={handleExportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Esporta Dati
          </Button>
        </div>
      </div>

      <Tabs defaultValue="contracts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contratti
          </TabsTrigger>
          <TabsTrigger value="gdpr" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            GDPR
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifiche
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Attività
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Contracts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Contratti Disponibili
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {contracts.map((contract) => (
                      <Card key={contract.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">{contract.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Tipo: {contract.contract_type}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Versione: {contract.version}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleSignContract(contract)}
                            disabled={signedContracts.some(sc => sc.contract_id === contract.id)}
                          >
                            {signedContracts.some(sc => sc.contract_id === contract.id) 
                              ? 'Firmato' 
                              : 'Firma'
                            }
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Signed Contracts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Contratti Firmati
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {signedContracts.map((contract) => (
                      <Card key={contract.id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium">Contratto #{contract.id.slice(0, 8)}</h4>
                            {getStatusBadge(contract.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Firmato il: {format(new Date(contract.signed_at), 'dd MMM yyyy', { locale: it })}
                          </p>
                          {contract.expiry_date && (
                            <p className="text-sm text-muted-foreground">
                              Scade il: {format(new Date(contract.expiry_date), 'dd MMM yyyy', { locale: it })}
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gdpr" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Richieste GDPR
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
                            <h4 className="font-medium">
                              {request.request_type.replace('_', ' ').toUpperCase()}
                            </h4>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {request.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Creata il: {format(new Date(request.created_at), 'dd MMM yyyy HH:mm', { locale: it })}
                          </p>
                          {request.completed_at && (
                            <p className="text-xs text-muted-foreground">
                              Completata il: {format(new Date(request.completed_at), 'dd MMM yyyy HH:mm', { locale: it })}
                            </p>
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
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifiche Legali
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`p-4 ${notification.is_read ? 'opacity-60' : ''}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium">{notification.title}</h4>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(notification.priority)}
                            {!notification.is_read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(notification.created_at), 'dd MMM yyyy HH:mm', { locale: it })}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Log delle Attività
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {activityLog.map((log) => (
                    <Card key={log.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium">{log.activity_type.replace('_', ' ').toUpperCase()}</h4>
                          <Badge variant="outline">{log.legal_basis}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {log.description}
                        </p>
                        {log.data_categories && log.data_categories.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {log.data_categories.map((category, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: it })}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ContractSigningModal
        contract={selectedContract}
        isOpen={signingModalOpen}
        onClose={() => {
          setSigningModalOpen(false);
          setSelectedContract(null);
        }}
        onSign={signContract}
      />
    </div>
  );
};