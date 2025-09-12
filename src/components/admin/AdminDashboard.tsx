import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, FileText, TrendingUp, Search, Filter, Eye, Shield, Mail, MapPin, Calendar, User, Phone, Globe, Briefcase, Check, X, Receipt, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import AdminJobOffersManagement from "./AdminJobOffersManagement";
import AdminProposalsManagement from "./AdminProposalsManagement";

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

interface RecruiterDetails {
  id: string;
  email: string;
  nome: string;
  cognome: string;
  telefono?: string;
  linkedin_url?: string;
  sito_web?: string;
  bio?: string;
  settori?: string;
  azienda?: string;
  location?: string;
  years_of_experience?: number;
  status: string;
  created_at: string;
}

interface CompanyDetails {
  id: string;
  email: string;
  nome_azienda: string;
  nome_contatto?: string;
  cognome_contatto?: string;
  telefono?: string;
  sito_web?: string;
  descrizione?: string;
  settore?: string;
  sede?: string;
  numero_dipendenti?: number;
  status: string;
  created_at: string;
}

interface CompanyFiscalData {
  id: string;
  company_id: string;
  partita_iva?: string;
  codice_fiscale?: string;
  ragione_sociale?: string;
  codice_sdi?: string;
  pec?: string;
  indirizzo_fatturazione?: string;
  cap_fatturazione?: string;
  citta_fatturazione?: string;
  provincia_fatturazione?: string;
  iban?: string;
  swift?: string;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
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
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterDetails | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetails | null>(null);
  const [selectedCompanyFiscalData, setSelectedCompanyFiscalData] = useState<CompanyFiscalData | null>(null);
  const [companiesFiscalStatus, setCompaniesFiscalStatus] = useState<Record<string, boolean>>({});
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMetrics();
    fetchUsers();
    fetchCompaniesFiscalStatus();
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

  const fetchCompaniesFiscalStatus = async () => {
    try {
      const { data: fiscalData } = await supabase
        .from('company_fiscal_data')
        .select('company_id, is_complete');

      const fiscalStatusMap: Record<string, boolean> = {};
      (fiscalData || []).forEach(item => {
        fiscalStatusMap[item.company_id] = item.is_complete;
      });
      
      setCompaniesFiscalStatus(fiscalStatusMap);
    } catch (error) {
      console.error('Error fetching companies fiscal status:', error);
    }
  };

  const fetchCompanyFiscalData = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('company_fiscal_data')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSelectedCompanyFiscalData(data);
    } catch (error) {
      console.error('Error fetching company fiscal data:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati fiscali dell'azienda",
        variant: "destructive",
      });
    }
  };

  const getFiscalDataBadge = (companyId: string) => {
    const isComplete = companiesFiscalStatus[companyId];
    if (isComplete === undefined) {
      return <Badge variant="secondary" className="text-xs">Non inseriti</Badge>;
    }
    return isComplete ? (
      <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">Completi</Badge>
    ) : (
      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">Incompleti</Badge>
    );
  };

  const handleViewCompanyDetails = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('company_registrations')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) throw error;

      setSelectedCompany(data);
      await fetchCompanyFiscalData(companyId);
      setIsCompanyModalOpen(true);
    } catch (error) {
      console.error('Error fetching company details:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dettagli dell'azienda",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRecruiterStatus = async (recruiterId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('recruiter_registrations')
        .update({ status: newStatus })
        .eq('id', recruiterId);

      if (error) throw error;

      // Update local state
      setSelectedRecruiter(prev => prev ? { ...prev, status: newStatus } : null);
      setRecruiters(prev => prev.map(r => 
        r.id === recruiterId ? { ...r, status: newStatus } : r
      ));

      toast({
        title: "Successo",
        description: `Recruiter ${newStatus === 'approved' ? 'approvato' : 'rifiutato'} con successo`,
      });

      // Refresh metrics
      fetchMetrics();
    } catch (error) {
      console.error('Error updating recruiter status:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato del recruiter",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCompanyStatus = async (companyId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('company_registrations')
        .update({ status: newStatus })
        .eq('id', companyId);

      if (error) throw error;

      // Update local state
      setSelectedCompany(prev => prev ? { ...prev, status: newStatus } : null);
      setCompanies(prev => prev.map(c => 
        c.id === companyId ? { ...c, status: newStatus } : c
      ));

      toast({
        title: "Successo",
        description: `Azienda ${newStatus === 'approved' ? 'approvata' : 'rifiutata'} con successo`,
      });

      // Refresh metrics
      fetchMetrics();
    } catch (error) {
      console.error('Error updating company status:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato dell'azienda",
        variant: "destructive",
      });
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
      case 'blocked':
        return <Badge variant="blocked">Bloccato</Badge>;
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

  const handleViewRecruiterDetails = async (recruiterId: string) => {
    try {
      const { data, error } = await supabase
        .from('recruiter_registrations')
        .select('*')
        .eq('id', recruiterId)
        .single();

      if (error) throw error;

      setSelectedRecruiter(data);
      setIsRecruiterModalOpen(true);
    } catch (error) {
      console.error('Error fetching recruiter details:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dettagli del recruiter",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    console.log("AdminDashboard: Loading state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Caricamento dashboard admin...</div>
      </div>
    );
  }

  console.log("AdminDashboard: Rendering with data", { 
    recruitersCount: recruiters.length, 
    companiesCount: companies.length,
    metrics 
  });

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
                <SelectItem value="blocked">Bloccato</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Gestione Piattaforma</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">
                Utenti ({filterUsers([...recruiters, ...companies]).length})
              </TabsTrigger>
              <TabsTrigger value="recruiters">
                Recruiter ({filterUsers(recruiters).length})
              </TabsTrigger>
              <TabsTrigger value="companies">
                Aziende ({filterUsers(companies).length})
              </TabsTrigger>
              <TabsTrigger value="proposals">
                Candidature
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <div className="space-y-2">
                {filterUsers([...recruiters, ...companies])
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                        {getRoleBadge(user.user_type)}
                        {getStatusBadge(user.status)}
                        {user.user_type === 'company' && getFiscalDataBadge(user.id)}
                      </div>
                      <div className="font-medium">
                        {user.user_type === 'company' ? user.company_name : user.name} 
                        {!user.name && !user.company_name && user.email}
                      </div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      {user.location && (
                        <div className="text-sm text-muted-foreground">
                          {user.user_type === 'company' ? 'Sede' : 'Località'}: {user.location}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Registrato: {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: it })}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => user.user_type === 'recruiter' 
                        ? handleViewRecruiterDetails(user.id) 
                        : handleViewCompanyDetails(user.id)
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Dettagli
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewRecruiterDetails(recruiter.id)}
                    >
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
                        {getFiscalDataBadge(company.id)}
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewCompanyDetails(company.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Dettagli
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="proposals" className="space-y-4">
              <AdminProposalsManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Job Offers Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-red-600" />
            Gestione Offerte di Lavoro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminJobOffersManagement />
        </CardContent>
      </Card>

      {/* Recruiter Details Modal */}
      <Dialog open={isRecruiterModalOpen} onOpenChange={setIsRecruiterModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Dettagli Recruiter
            </DialogTitle>
            <DialogDescription>
              Informazioni complete del profilo recruiter
            </DialogDescription>
          </DialogHeader>

          {selectedRecruiter && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Nome Completo:</span>
                    <span>{selectedRecruiter.nome} {selectedRecruiter.cognome}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span>{selectedRecruiter.email}</span>
                  </div>

                  {selectedRecruiter.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Telefono:</span>
                      <span>{selectedRecruiter.telefono}</span>
                    </div>
                  )}

                  {selectedRecruiter.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Località:</span>
                      <span>{selectedRecruiter.location}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Registrato:</span>
                    <span>{format(new Date(selectedRecruiter.created_at), 'dd/MM/yyyy', { locale: it })}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium">Stato:</span>
                    {getStatusBadge(selectedRecruiter.status)}
                  </div>

                  {selectedRecruiter.years_of_experience && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Esperienza:</span>
                      <span>{selectedRecruiter.years_of_experience} anni</span>
                    </div>
                  )}

                  {selectedRecruiter.azienda && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Azienda:</span>
                      <span>{selectedRecruiter.azienda}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Links */}
              {(selectedRecruiter.linkedin_url || selectedRecruiter.sito_web) && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Collegamenti Professionali</h4>
                  {selectedRecruiter.linkedin_url && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">LinkedIn:</span>
                      <a href={selectedRecruiter.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedRecruiter.linkedin_url}
                      </a>
                    </div>
                  )}
                  {selectedRecruiter.sito_web && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Sito Web:</span>
                      <a href={selectedRecruiter.sito_web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedRecruiter.sito_web}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Bio */}
              {selectedRecruiter.bio && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Biografia</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedRecruiter.bio}
                  </p>
                </div>
              )}

              {/* Sectors */}
              {selectedRecruiter.settori && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Settori di Specializzazione</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {selectedRecruiter.settori}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons for Pending Recruiters */}
          {selectedRecruiter && selectedRecruiter.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => handleUpdateRecruiterStatus(selectedRecruiter.id, 'approved')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Approva Recruiter
              </Button>
              <Button
                onClick={() => handleUpdateRecruiterStatus(selectedRecruiter.id, 'rejected')}
                variant="destructive"
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Rifiuta Recruiter
              </Button>
            </div>
          )}

          {/* Block/Unblock Buttons for Approved/Blocked Recruiters */}
          {selectedRecruiter && (selectedRecruiter.status === 'approved' || selectedRecruiter.status === 'blocked') && (
            <div className="flex gap-3 pt-4 border-t">
              {selectedRecruiter.status === 'approved' ? (
                <Button
                  onClick={() => handleUpdateRecruiterStatus(selectedRecruiter.id, 'blocked')}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Blocca Account
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpdateRecruiterStatus(selectedRecruiter.id, 'approved')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Sblocca Account
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Company Details Modal */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              Dettagli Azienda
            </DialogTitle>
            <DialogDescription>
              Informazioni complete del profilo aziendale
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Informazioni Base</TabsTrigger>
                <TabsTrigger value="fiscal" className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Dati Fiscali
                  {selectedCompanyFiscalData?.is_complete ? (
                    <Badge variant="default" className="ml-1 text-xs bg-green-100 text-green-800 border-green-200">✓</Badge>
                  ) : (
                    <Badge variant="outline" className="ml-1 text-xs bg-yellow-50 text-yellow-700 border-yellow-200">!</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Nome Azienda:</span>
                    <span>{selectedCompany.nome_azienda}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span>{selectedCompany.email}</span>
                  </div>

                  {selectedCompany.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Telefono:</span>
                      <span>{selectedCompany.telefono}</span>
                    </div>
                  )}

                  {selectedCompany.sede && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Sede:</span>
                      <span>{selectedCompany.sede}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Registrata:</span>
                    <span>{format(new Date(selectedCompany.created_at), 'dd/MM/yyyy', { locale: it })}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium">Stato:</span>
                    {getStatusBadge(selectedCompany.status)}
                  </div>

                  {selectedCompany.settore && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Settore:</span>
                      <span>{selectedCompany.settore}</span>
                    </div>
                  )}

                  {selectedCompany.numero_dipendenti && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Dipendenti:</span>
                      <span>{selectedCompany.numero_dipendenti}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Person */}
              {(selectedCompany.nome_contatto || selectedCompany.cognome_contatto) && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Persona di Contatto</h4>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCompany.nome_contatto} {selectedCompany.cognome_contatto}</span>
                  </div>
                </div>
              )}

              {/* Website */}
              {selectedCompany.sito_web && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Sito Web</h4>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={selectedCompany.sito_web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedCompany.sito_web}
                    </a>
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedCompany.descrizione && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Descrizione Azienda</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedCompany.descrizione}
                  </p>
                </div>
              )}
              </TabsContent>

              <TabsContent value="fiscal" className="space-y-6">
                {selectedCompanyFiscalData ? (
                  <div className="space-y-6">
                    {/* Completeness Status */}
                    <div className="flex items-center gap-2 p-3 rounded-lg border bg-gray-50">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Stato Completezza:</span>
                      {selectedCompanyFiscalData.is_complete ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                          <Check className="h-3 w-3 mr-1" />
                          Dati Completi
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <X className="h-3 w-3 mr-1" />
                          Dati Incompleti
                        </Badge>
                      )}
                    </div>

                    {/* Principal Data */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Dati Principali
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCompanyFiscalData.partita_iva && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Partita IVA:</span>
                            <span className="text-sm">{selectedCompanyFiscalData.partita_iva}</span>
                          </div>
                        )}
                        {selectedCompanyFiscalData.codice_fiscale && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Codice Fiscale:</span>
                            <span className="text-sm">{selectedCompanyFiscalData.codice_fiscale}</span>
                          </div>
                        )}
                        {selectedCompanyFiscalData.ragione_sociale && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Ragione Sociale:</span>
                            <span className="text-sm">{selectedCompanyFiscalData.ragione_sociale}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Electronic Invoicing */}
                    {(selectedCompanyFiscalData.codice_sdi || selectedCompanyFiscalData.pec) && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Fatturazione Elettronica
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedCompanyFiscalData.codice_sdi && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">Codice SDI:</span>
                              <span className="text-sm">{selectedCompanyFiscalData.codice_sdi}</span>
                            </div>
                          )}
                          {selectedCompanyFiscalData.pec && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">PEC:</span>
                              <span className="text-sm">{selectedCompanyFiscalData.pec}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Billing Address */}
                    {(selectedCompanyFiscalData.indirizzo_fatturazione || selectedCompanyFiscalData.cap_fatturazione || selectedCompanyFiscalData.citta_fatturazione || selectedCompanyFiscalData.provincia_fatturazione) && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Indirizzo di Fatturazione
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedCompanyFiscalData.indirizzo_fatturazione && (
                            <div className="flex items-center gap-2 md:col-span-2">
                              <span className="font-medium text-sm">Indirizzo:</span>
                              <span className="text-sm">{selectedCompanyFiscalData.indirizzo_fatturazione}</span>
                            </div>
                          )}
                          {selectedCompanyFiscalData.cap_fatturazione && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">CAP:</span>
                              <span className="text-sm">{selectedCompanyFiscalData.cap_fatturazione}</span>
                            </div>
                          )}
                          {selectedCompanyFiscalData.citta_fatturazione && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">Città:</span>
                              <span className="text-sm">{selectedCompanyFiscalData.citta_fatturazione}</span>
                            </div>
                          )}
                          {selectedCompanyFiscalData.provincia_fatturazione && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">Provincia:</span>
                              <span className="text-sm">{selectedCompanyFiscalData.provincia_fatturazione}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Banking Details */}
                    {(selectedCompanyFiscalData.iban || selectedCompanyFiscalData.swift) && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Dati Bancari
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedCompanyFiscalData.iban && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">IBAN:</span>
                              <span className="text-sm font-mono">{selectedCompanyFiscalData.iban}</span>
                            </div>
                          )}
                          {selectedCompanyFiscalData.swift && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">SWIFT/BIC:</span>
                              <span className="text-sm font-mono">{selectedCompanyFiscalData.swift}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="space-y-2 pt-4 border-t">
                      <div className="text-xs text-muted-foreground">
                        Dati fiscali creati: {format(new Date(selectedCompanyFiscalData.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ultimo aggiornamento: {format(new Date(selectedCompanyFiscalData.updated_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h4 className="font-medium text-lg mb-2">Dati fiscali non disponibili</h4>
                    <p className="text-muted-foreground text-sm">
                      L'azienda non ha ancora inserito i propri dati fiscali.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Action Buttons for Pending Companies */}
          {selectedCompany && selectedCompany.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => handleUpdateCompanyStatus(selectedCompany.id, 'approved')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Approva Azienda
              </Button>
              <Button
                onClick={() => handleUpdateCompanyStatus(selectedCompany.id, 'rejected')}
                variant="destructive"
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Rifiuta Azienda
              </Button>
            </div>
          )}

          {/* Block/Unblock Buttons for Approved/Blocked Companies */}
          {selectedCompany && (selectedCompany.status === 'approved' || selectedCompany.status === 'blocked') && (
            <div className="flex gap-3 pt-4 border-t">
              {selectedCompany.status === 'approved' ? (
                <Button
                  onClick={() => handleUpdateCompanyStatus(selectedCompany.id, 'blocked')}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Blocca Account
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpdateCompanyStatus(selectedCompany.id, 'approved')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Sblocca Account
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}