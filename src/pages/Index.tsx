import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ProblemSolution from "@/components/ProblemSolution";
import Market from "@/components/Market";
import BusinessModel from "@/components/BusinessModel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardNavigation from "@/components/DashboardNavigation";
import AuthPage from "@/components/auth/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { LogIn } from "lucide-react";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  // Auto-redirect to dashboard after successful login
  useEffect(() => {
    if (user && !loading) {
      setShowDashboard(true);
      setShowAuth(false);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Caricamento...</div>
      </div>
    );
  }

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  if (showDashboard) {
    return <DashboardNavigation onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        
        {/* Demo Section with improved styling */}
        <div 
          className="py-20 bg-gradient-to-r from-recruito-blue/5 via-recruito-teal/5 to-recruito-green/5 relative overflow-hidden"
          data-demo-section
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-recruito-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-recruito-teal/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 text-gradient">🚀 Prova la Demo</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Esplora in anteprima il sistema completo di gestione proposte e candidature. 
                Testa tutte le funzionalità per recruiter e aziende in un ambiente completamente funzionale.
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover-lift">
                {user ? (
                  <Button 
                    onClick={() => setShowDashboard(true)} 
                    size="lg" 
                    className="gradient-recruito text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Accedi alla Demo Interattiva
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Button 
                      onClick={() => setShowAuth(true)} 
                      size="lg" 
                      className="gradient-recruito text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Accedi / Registrati
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Devi essere autenticato per accedere alla demo
                    </p>
                  </div>
                )}
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-recruito-blue rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Dashboard Recruiter</h4>
                      <p className="text-sm text-muted-foreground">Invia proposte e gestisci candidature</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-recruito-teal rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Dashboard Azienda</h4>
                      <p className="text-sm text-muted-foreground">Ricevi proposte e gestisci offerte</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <HowItWorks />
        <ProblemSolution />
        <Market />
        <BusinessModel />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
