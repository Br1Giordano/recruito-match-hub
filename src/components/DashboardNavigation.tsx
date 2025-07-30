
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useMessages } from "@/hooks/useMessages";
import RecruiterDashboard from "./RecruiterDashboard";
import CompanyOffersDashboard from "./CompanyOffersDashboard";
import CompanyProposalsDashboard from "./CompanyProposalsDashboard";
import { CompanyMessagesSection } from "./messaging/CompanyMessagesSection";
import AdminDashboard from "./admin/AdminDashboard";
import { User, Building2, FileText, Briefcase, MessageSquare, ArrowLeft, Home, LogOut, Settings, ChevronDown, Shield, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import JobOffersBoard from "./JobOffersBoard";
import { useToast } from "@/components/ui/use-toast";
import RecruiterProfileButton from "./recruiter/RecruiterProfileButton";
import { RecruiterJobInterests } from "./recruiter/RecruiterJobInterests";
import DeleteAccountDialog from "./account/DeleteAccountDialog";
import CompanyProfileModal from "./company/CompanyProfileModal";
import CompanyAvatar from "./company/CompanyAvatar";

interface DashboardNavigationProps {
  onBack?: () => void;
}

export default function DashboardNavigation({ onBack }: DashboardNavigationProps) {
  const { user, userProfile, signOut, loading, createUserProfile } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { toast } = useToast();

  console.log('DashboardNavigation render - user:', !!user, 'userProfile:', userProfile, 'loading:', loading);

  const handleSignOut = async () => {
    await signOut();
    if (onBack) onBack();
  };

  const handleUserTypeSelection = async (type: "recruiter" | "company") => {
    console.log('User selected type:', type);
    
    try {
      const success = await createUserProfile(type);
      if (!success) {
        toast({
          title: "Errore",
          description: "Impossibile creare il profilo utente",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Successo",
        description: "Profilo utente creato con successo",
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Errore",
        description: "Errore durante la creazione del profilo",
        variant: "destructive",
      });
    }
  };

  // Show loading while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Caricamento...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute onBack={onBack}>
      <div className="min-h-screen bg-gradient-to-br from-recruito-blue/5 via-recruito-teal/5 to-recruito-green/5">
        {/* Check if user has a profile */}
        {!userProfile ? (
          <UserTypeSelection 
            onSelectType={handleUserTypeSelection} 
            onBack={onBack} 
            onSignOut={handleSignOut}
          />
        ) : isAdmin ? (
          <AdminDashboardLayout onBack={onBack} onSignOut={handleSignOut} />
        ) : userProfile.user_type === "recruiter" ? (
          <RecruiterDashboardLayout onBack={onBack} onSignOut={handleSignOut} />
        ) : (
          <CompanyDashboardLayout onBack={onBack} onSignOut={handleSignOut} />
        )}
      </div>
    </ProtectedRoute>
  );
}

function UserTypeSelection({ 
  onSelectType, 
  onBack, 
  onSignOut
}: { 
  onSelectType: (type: "recruiter" | "company") => void;
  onBack?: () => void;
  onSignOut: () => void;
}) {
  return (
    <>
      {/* Navigation Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Torna al Sito
                </Button>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-recruito-blue to-recruito-teal rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <h1 className="text-xl font-semibold">Demo Sistema Proposte</h1>
              </div>
            </div>
            <Button variant="ghost" onClick={onSignOut} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Esci
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gradient mb-4">Seleziona Tipo Utente</CardTitle>
            <CardDescription>
              Scegli il tuo ruolo per accedere al dashboard appropriato e testare tutte le funzionalità
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <Button
              onClick={() => onSelectType("recruiter")}
              className="w-full justify-start h-20 bg-white border-2 border-recruito-blue/20 hover:border-recruito-blue hover:bg-recruito-blue/5 text-gray-800 hover:text-recruito-blue transition-all duration-300"
              variant="outline"
            >
              <div className="flex items-center w-full">
                <div className="w-12 h-12 bg-recruito-blue/10 rounded-xl flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-recruito-blue" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-lg">Recruiter</div>
                  <div className="text-sm text-muted-foreground">
                    Invia proposte candidati e gestisci le tue candidature
                  </div>
                </div>
              </div>
            </Button>
            <Button
              onClick={() => onSelectType("company")}
              className="w-full justify-start h-20 bg-white border-2 border-recruito-teal/20 hover:border-recruito-teal hover:bg-recruito-teal/5 text-gray-800 hover:text-recruito-teal transition-all duration-300"
              variant="outline"
            >
              <div className="flex items-center w-full">
                <div className="w-12 h-12 bg-recruito-teal/10 rounded-xl flex items-center justify-center mr-4">
                  <Building2 className="h-6 w-6 text-recruito-teal" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-lg">Azienda</div>
                  <div className="text-sm text-muted-foreground">
                    Gestisci offerte di lavoro e ricevi proposte dai recruiter
                  </div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function RecruiterDashboardLayout({ onBack, onSignOut }: { onBack?: () => void; onSignOut: () => void }) {
  return (
    <>
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-recruito-blue rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-semibold">Dashboard Recruiter</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <RecruiterProfileButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <Tabs defaultValue="job-board" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="job-board" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Posizioni Aperte
            </TabsTrigger>
            <TabsTrigger value="taken-jobs" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Offerte Prese in Carico
            </TabsTrigger>
            <TabsTrigger value="proposals" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Le Mie Candidature
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="job-board">
            <JobOffersBoard />
          </TabsContent>
          
          <TabsContent value="taken-jobs">
            <RecruiterJobInterests />
          </TabsContent>
          
          <TabsContent value="proposals">
            <RecruiterDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function CompanyDashboardLayout({ onBack, onSignOut }: { onBack?: () => void; onSignOut: () => void }) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { profile } = useCompanyProfile();
  const { unreadCount } = useMessages();

  return (
    <>
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              )}
              <div className="flex items-center gap-2">
                <CompanyAvatar
                  logoUrl={profile?.logo_url}
                  companyName={profile?.nome_azienda || 'Dashboard Azienda'}
                  size="md"
                />
                <h1 className="text-xl font-semibold">Dashboard Azienda</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 border-gray-200 hover:border-gray-300 h-auto p-2">
                    <CompanyAvatar
                      logoUrl={profile?.logo_url}
                      companyName={profile?.nome_azienda || 'Azienda'}
                      size="md"
                    />
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">
                        {profile?.nome_azienda || 'Azienda'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {profile?.settore || 'Account Azienda'}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
                  <DropdownMenuItem 
                    onClick={() => setShowProfileModal(true)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Il mio profilo
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={onSignOut}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Esci dall'account
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DeleteAccountDialog trigger={
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Gestione account
                    </DropdownMenuItem>
                  } />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <CompanyProfileModal 
        open={showProfileModal} 
        onOpenChange={setShowProfileModal} 
      />

      <div className="container mx-auto p-4">
        <Tabs defaultValue="proposals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="proposals" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Proposte Ricevute
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2 relative">
              <MessageSquare className="h-4 w-4" />
              Messaggi
              {unreadCount > 0 && (
                <Badge
                  variant="default"
                  className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground animate-pulse"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="offers" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Le Mie Offerte
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="proposals">
            <CompanyProposalsDashboard />
          </TabsContent>

          <TabsContent value="messages">
            <CompanyMessagesSection />
          </TabsContent>
          
          <TabsContent value="offers">
            <CompanyOffersDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

// Admin Dashboard Layout
function AdminDashboardLayout({ 
  onBack, 
  onSignOut 
}: { 
  onBack?: () => void; 
  onSignOut: () => void; 
}) {
  return (
    <>
      {/* Navigation Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Torna al Sito
                </Button>
              )}
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-lg">Admin Panel</span>
              </div>
            </div>
            
            {/* Admin Actions */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Amministratore
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </div>
    </>
  );
}
