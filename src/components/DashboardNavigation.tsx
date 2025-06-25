
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProposalForm from "./ProposalForm";
import RecruiterDashboard from "./RecruiterDashboard";
import CompanyOffersDashboard from "./CompanyOffersDashboard";
import CompanyProposalsDashboard from "./CompanyProposalsDashboard";
import { User, Building2, FileText, Briefcase, MessageSquare, Plus } from "lucide-react";

export default function DashboardNavigation() {
  const [userType, setUserType] = useState<"recruiter" | "company" | null>(null);

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Seleziona Tipo Utente</CardTitle>
            <p className="text-muted-foreground">
              Scegli il tuo ruolo per accedere al dashboard appropriato
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setUserType("recruiter")}
              className="w-full justify-start h-16"
              variant="outline"
            >
              <User className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Recruiter</div>
                <div className="text-sm text-muted-foreground">
                  Invia proposte e gestisci candidature
                </div>
              </div>
            </Button>
            <Button
              onClick={() => setUserType("company")}
              className="w-full justify-start h-16"
              variant="outline"
            >
              <Building2 className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Azienda</div>
                <div className="text-sm text-muted-foreground">
                  Gestisci offerte e ricevi proposte
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userType === "recruiter") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-6 w-6" />
                <h1 className="text-xl font-semibold">Dashboard Recruiter</h1>
              </div>
              <Button variant="outline" onClick={() => setUserType(null)}>
                Cambia Ruolo
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <h1 className="text-xl font-semibold">Dashboard Azienda</h1>
            </div>
            <Button variant="outline" onClick={() => setUserType(null)}>
              Cambia Ruolo
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
    </div>
  );
}
