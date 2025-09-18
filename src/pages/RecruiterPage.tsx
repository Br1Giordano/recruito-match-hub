import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardNavigation from "@/components/DashboardNavigation";
import AuthPage from "@/components/auth/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, Target, Users, Award, Briefcase, Clock } from "lucide-react";
import BrandedGradient from "@/components/ui/animated/BrandedGradient";

const RecruiterPage = () => {
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
      icon: TrendingUp,
      title: "Marginalità più vantaggiose",
      description: "Ottieni compensi maggiori per ogni match di successo con il 70% della success fee"
    },
    {
      icon: Briefcase,
      title: "Portafoglio di posizioni aperte",
      description: "Accesso a una lista completa di posizioni visibili ai recruiter specializzati"
    },
    {
      icon: Clock,
      title: "Time-to-hire minore",
      description: "Riduci i tempi di placement grazie a processi ottimizzati e AI"
    },
    {
      icon: Target,
      title: "KPIs ranking pubblico",
      description: "Sistema di ranking basato su risultati e tempistiche per merito"
    },
    {
      icon: Award,
      title: "Gamification",
      description: "Incentivi alla performance con dinamiche di gamification e obiettivi"
    },
    {
      icon: Users,
      title: "Network specializzato",
      description: "Fai parte di una rete di top recruiter verificati per settori specifici"
    }
  ];

  const features = [
    "Lista di posizioni aperte visibili ai recruiter",
    "Dashboard per tracciare le candidature inviate", 
    "Obiettivi raggiunti dal recruiter (gamification)"
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
                Più opportunità, più guadagni, più visibilità
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                Unisciti alla rete di recruiter freelance verificati di Recruito. 
                Accedi a marginalità vantaggiose, un portafoglio di posizioni specializzate e 
                un sistema di ranking che premia il merito.
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
                    Inizia come Recruiter
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
                La piattaforma che connette recruiter freelance verificati con le migliori opportunità del mercato
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

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                La tua dashboard recruiter
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-recruito-blue to-recruito-teal rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                      {index + 1}
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
                Pronto a aumentare i tuoi guadagni?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Entra a far parte della rete di recruiter specializzati di Recruito e 
                scopri un nuovo modo di fare recruiting.
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
                  Registrati ora
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

export default RecruiterPage;