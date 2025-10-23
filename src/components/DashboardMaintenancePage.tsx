import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Mail, Home } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardMaintenancePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-2xl border-2">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Wrench className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Dashboard Temporaneamente Sospese</CardTitle>
          <CardDescription className="text-base">
            Le dashboard per recruiter e aziende sono momentaneamente sospese per gestire le numerose richieste.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-lg">Come possiamo aiutarti?</h3>
            <p className="text-muted-foreground">
              Stiamo lavorando per riattivare le funzionalità al più presto. Nel frattempo:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Usa il form "Prenota una Demo" sulla homepage per essere ricontattato</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Contattaci direttamente via email per qualsiasi necessità urgente</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Torna alla Home
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a href="mailto:contact.recruito@gmail.com">
                <Mail className="h-4 w-4 mr-2" />
                Contattaci
              </a>
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Ci scusiamo per il disagio e ti ringraziamo per la pazienza.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMaintenancePage;
