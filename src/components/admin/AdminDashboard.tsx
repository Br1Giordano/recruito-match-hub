import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, FileText, TrendingUp, Search, Filter, Eye, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface AdminMetrics {
  totalRecruiters: number;
  totalCompanies: number;
  totalProposals: number;
  activeJobOffers: number;
  pendingProposals: number;
  approvedProposals: number;
  rejectedProposals: number;
}

interface UserRecord {
  id: string;
  email: string;
  user_type: 'recruiter' | 'company';
  status: string;
  created_at: string;
  name?: string;
  company_name?: string;
  location?: string;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalRecruiters: 0,
    totalCompanies: 0,
    totalProposals: 0,
    activeJobOffers: 0,
    pendingProposals: 0,
    approvedProposals: 0,
    rejectedProposals: 0,
  });
  const [recruiters, setRecruiters] = useState<UserRecord[]>([]);
  const [companies, setCompanies] = useState<UserRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMetrics();
    fetchUsers();
  }, []);

  const fetchMetrics = async () => {
    try {
      // Fetch recruiters count
      const { count: recruitersCount } = await supabase
        .from('recruiter_registrations')
        .select('*', { count: 'exact', head: true });

      // Fetch companies count
      const { count: companiesCount } = await supabase
        .from('company_registrations')
        .select('*', { count: 'exact', head: true });

      // Fetch proposals count
      const { count: proposalsCount } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true });

      // Fetch active job offers count
      const { count: activeJobOffersCount } = await supabase
        .from('job_offers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Fetch proposals by status
      const { count: pendingCount } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: approvedCount } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: rejectedCount } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      setMetrics({
        totalRecruiters: recruitersCount || 0,
        totalCompanies: companiesCount || 0,
        totalProposals: proposalsCount || 0,
        activeJobOffers: activeJobOffersCount || 0,
        pendingProposals: pendingCount || 0,
        approvedProposals: approvedCount || 0,
        rejectedProposals: rejectedCount || 0,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le metriche",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch recruiters
      const { data: recruitersData } = await supabase
        .from('recruiter_registrations')
        .select('id, email, status, created_at, nome, cognome, location, azienda')
        .order('created_at', { ascending: false });

      // Fetch companies
      const { data: companiesData } = await supabase
        .from('company_registrations')
        .select('id, email, status, created_at, nome_azienda, sede')
        .order('created_at', { ascending: false });

      const recruitersFormatted: UserRecord[] = (recruitersData || []).map(r => ({
        id: r.id,
        email: r.email,
        user_type: 'recruiter' as const,
        status: r.status || 'pending',
        created_at: r.created_at,
        name: `${r.nome} ${r.cognome}`.trim(),
        company_name: r.azienda,
        location: r.location,
      }));

      const companiesFormatted: UserRecord[] = (companiesData || []).map(c => ({
        id: c.id,
        email: c.email,
        user_type: 'company' as const,
        status: c.status || 'pending',
        created_at: c.created_at,
        company_name: c.nome_azienda,
        location: c.sede,
      }));

      setRecruiters(recruitersFormatted);
      setCompanies(companiesFormatted);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare gli utenti",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="approved">Approvato</Badge>;
      case 'pending':
        return <Badge variant="pending">In Attesa</Badge>;
      case 'rejected':
        return <Badge variant="rejected">Rifiutato</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (userType: 'recruiter' | 'company') => {
    return userType === 'recruiter' ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
        <Users className="w-3 h-3 mr-1" />
        Recruiter
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
        <Building2 className="w-3 h-3 mr-1" />
        Azienda
      </Badge>
    );
  };

  const filterUsers = (users: UserRecord[]) => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Caricamento dashboard admin...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Amministratore</h1>
          <p className="text-muted-foreground">
            Panoramica generale della piattaforma e gestione utenti
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recruiter Totali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRecruiters}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aziende Totali</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCompanies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposte Totali</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProposals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offerte Attive</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeJobOffers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Proposal Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposte In Attesa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.pendingProposals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposte Approvate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.approvedProposals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposte Rifiutate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.rejectedProposals}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtri Ricerca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cerca per email, nome o azienda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtra per stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli Stati</SelectItem>
                <SelectItem value="pending">In Attesa</SelectItem>
                <SelectItem value="approved">Approvato</SelectItem>
                <SelectItem value="rejected">Rifiutato</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <CardTitle>Gestione Utenti</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recruiters" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recruiters">
                Recruiter ({filterUsers(recruiters).length})
              </TabsTrigger>
              <TabsTrigger value="companies">
                Aziende ({filterUsers(companies).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recruiters" className="space-y-4">
              <div className="space-y-2">
                {filterUsers(recruiters).map((recruiter) => (
                  <div
                    key={recruiter.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getRoleBadge(recruiter.user_type)}
                        {getStatusBadge(recruiter.status)}
                      </div>
                      <div className="font-medium">{recruiter.name || recruiter.email}</div>
                      <div className="text-sm text-muted-foreground">{recruiter.email}</div>
                      {recruiter.company_name && (
                        <div className="text-sm text-muted-foreground">
                          Azienda: {recruiter.company_name}
                        </div>
                      )}
                      {recruiter.location && (
                        <div className="text-sm text-muted-foreground">
                          Località: {recruiter.location}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Registrato: {format(new Date(recruiter.created_at), 'dd/MM/yyyy', { locale: it })}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Dettagli
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="companies" className="space-y-4">
              <div className="space-y-2">
                {filterUsers(companies).map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getRoleBadge(company.user_type)}
                        {getStatusBadge(company.status)}
                      </div>
                      <div className="font-medium">{company.company_name || company.email}</div>
                      <div className="text-sm text-muted-foreground">{company.email}</div>
                      {company.location && (
                        <div className="text-sm text-muted-foreground">
                          Sede: {company.location}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Registrata: {format(new Date(company.created_at), 'dd/MM/yyyy', { locale: it })}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Dettagli
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}