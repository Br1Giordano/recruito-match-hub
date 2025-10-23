import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardMaintenancePage() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleDemo = () => {
    navigate('/#demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12 shadow-lg">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-amber-100 p-6">
              <Wrench className="h-16 w-16 text-amber-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Dashboard Temporaneamente Sospese
            </h1>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-left">
              <p className="text-amber-900 font-medium mb-2">
                ⚠️ Accesso alle dashboard temporaneamente disabilitato
              </p>
              <p className="text-amber-800 text-sm">
                A causa dell'elevato numero di richieste ricevute, abbiamo temporaneamente sospeso 
                l'accesso alle dashboard per recruiter e aziende.
              </p>
            </div>

            <p className="text-gray-600 text-lg">
              Stiamo lavorando per gestire al meglio tutte le richieste ricevute. 
              Nel frattempo, puoi:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Contattaci</h3>
                <p className="text-sm text-gray-600">
                  Scrivici per informazioni o richieste specifiche
                </p>
                <a 
                  href="mailto:contact.recruito@gmail.com"
                  className="inline-block"
                >
                  <Button variant="outline" size="sm">
                    contact.recruito@gmail.com
                  </Button>
                </a>
              </div>
            </Card>

            <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <Wrench className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Prenota una Demo</h3>
                <p className="text-sm text-gray-600">
                  Richiedi una dimostrazione personalizzata
                </p>
                <Button 
                  onClick={handleDemo}
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  Vai al Form Demo
                </Button>
              </div>
            </Card>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              className="flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Torna alla Homepage
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
