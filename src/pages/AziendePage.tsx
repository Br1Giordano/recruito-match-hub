import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardNavigation from "@/components/DashboardNavigation";
import AuthPage from "@/components/auth/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { Users, DollarSign, Clock, Target, Brain, BarChart3 } from "lucide-react";
import BrandedGradient from "@/components/ui/animated/BrandedGradient";

const AziendePage = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setShowDashboard(true);
  };

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} onAuthSuccess={handleAuthSuccess} />;
  }

  if (showDashboard) {
    return <DashboardNavigation onBack={() => setShowDashboard(false)} />;
  }

  const benefits = [
    {
      icon: Users,
      title: "Network di top recruiter verificati",
      description: "Accesso a recruiter specializzati per settori e ruoli specifici, tutti verificati"
    },
    {
      icon: DollarSign,
      title: "Zero costi fissi, solo a successo",
      description: "Paga solo quando assumi. Nessun costo fisso o anticipo richiesto"
    },
    {
      icon: Target,
      title: "Proposte di profili già selezionati",
      description: "Ricevi candidature pre-filtrate e selezionate dai migliori recruiter"
    },
    {
      icon: Clock,
      title: "Time-to-hire minore",
      description: "Riduci drasticamente i tempi di assunzione grazie a più recruiter che lavorano sulla stessa posizione"
    },
    {
      icon: Brain,
      title: "AI features integrate",
      description: "Scrittura guidata degli annunci e filtri intelligenti per ottimizzare le ricerche"
    },
    {
      icon: BarChart3,
      title: "Classifica recruiter trasparente",
      description: "Sistema di ranking dei recruiter basato su risultati e tempistiche"
    }
  ];

  const features = [
    "Proposte ricevute dall'azienda prese in esame",
    "Dashboard per gestire le posizioni pubblicate",
    "Classifica dei recruiter su risultati e tempistiche"
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Pubblica la posizione",
      description: "Crea un annuncio dettagliato con l'aiuto dell'AI per attirare i migliori recruiter"
    },
    {
      step: "2", 
      title: "Ricevi proposte",
      description: "I recruiter specializzati inviano candidature pre-selezionate e qualificate"
    },
    {
      step: "3",
      title: "Valuta e assumi",
      description: "Scegli i candidati migliori e finalizza l'assunzione con il recruiter"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BrandedGradient position="fixed" />
      <Header onShowAuth={() => setShowAuth(true)} onShowDashboard={() => setShowDashboard(true)} />
      
      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-32 relative">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient leading-tight">
                Trova i talenti giusti in meno tempo
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                Accedi alla rete di recruiter freelance specializzati di Recruito. 
                Zero costi fissi, pagamento solo a successo, tempi di assunzione ridotti.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Button 
                    onClick={() => setShowDashboard(true)} 
                    size="lg" 
                    className="gradient-recruito text-white text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Accedi alla Dashboard
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setShowAuth(true)} 
                    size="lg" 
                    className="gradient-recruito text-white text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Inizia come Azienda
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-recruito-blue/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-recruito-teal/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50/50 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Perché scegliere Recruito</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                La piattaforma che connette aziende con i migliori recruiter freelance verificati
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-recruito-blue to-recruito-teal text-white group-hover:scale-110 transition-transform">
                        <benefit.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold">{benefit.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Come funziona</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Sulla piattaforma si interfacciano aziende, pubblicando posizioni, e recruiter, proponendo candidature
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {howItWorks.map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-recruito-blue to-recruito-teal rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-recruito-blue/30 to-recruito-teal/30 transform -translate-x-1/2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                La tua dashboard aziendale
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-recruito-blue to-recruito-teal rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                      {index + 6}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-recruito-blue/5 via-recruito-teal/5 to-recruito-green/5 relative">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pronto a trovare i migliori talenti?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Unisciti alle aziende che hanno già scoperto un nuovo modo di assumere 
                con Recruito. Nessun costo fisso, solo risultati.
              </p>
              
              {user ? (
                <Button 
                  onClick={() => setShowDashboard(true)} 
                  size="lg" 
                  className="gradient-recruito text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Vai alla Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={() => setShowAuth(true)} 
                  size="lg" 
                  className="gradient-recruito text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Inizia ora
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AziendePage;