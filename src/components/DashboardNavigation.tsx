
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import ProposalForm from "./ProposalForm";
import RecruiterDashboard from "./RecruiterDashboard";
import CompanyOffersDashboard from "./CompanyOffersDashboard";
import CompanyProposalsDashboard from "./CompanyProposalsDashboard";
import { User, Building2, FileText, Briefcase, MessageSquare, Plus, ArrowLeft, Home, LogOut } from "lucide-react";

interface DashboardNavigationProps {
  onBack?: () => void;
}

export default function DashboardNavigation({ onBack }: DashboardNavigationProps) {
  const { userProfile, signOut, loading } = useAuth();
  const [userType, setUserType] = useState<"recruiter" | "company" | null>(null);

  const handleSignOut = async () => {
    await signOut();
    if (onBack) onBack();
  };

  // Show loading while determining user type
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
        {/* If user has a profile, use that; otherwise show selection */}
        {userProfile ? (
          userProfile.user_type === "recruiter" ? (
            <RecruiterDashboardLayout onBack={onBack} onSignOut={handleSignOut} />
          ) : (
            <CompanyDashboardLayout onBack={onBack} onSignOut={handleSignOut} />
          )
        ) : !userType ? (
          <UserTypeSelection onSelectType={setUserType} onBack={onBack} onSignOut={handleSignOut} />
        ) : userType === "recruiter" ? (
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
            <p className="text-muted-foreground text-lg">
              Scegli il tuo ruolo per accedere al dashboard appropriato e testare tutte le funzionalità
            </p>
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
            <Button variant="ghost" onClick={onSignOut} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Esci
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <Tabs defaultValue="proposals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="proposals" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Le Mie Candidature
            </TabsTrigger>
            <TabsTrigger value="new-proposal" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Invia Proposta
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="proposals">
            <RecruiterDashboard />
          </TabsContent>
          
          <TabsContent value="new-proposal">
            <ProposalForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function CompanyDashboardLayout({ onBack, onSignOut }: { onBack?: () => void; onSignOut: () => void }) {
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
                <div className="w-8 h-8 bg-recruito-teal rounded-lg flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-semibold">Dashboard Azienda</h1>
              </div>
            </div>
            <Button variant="ghost" onClick={onSignOut} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Esci
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <Tabs defaultValue="proposals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="proposals" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Proposte Ricevute
            </TabsTrigger>
            <TabsTrigger value="offers" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Le Mie Offerte
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="proposals">
            <CompanyProposalsDashboard />
          </TabsContent>
          
          <TabsContent value="offers">
            <CompanyOffersDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
