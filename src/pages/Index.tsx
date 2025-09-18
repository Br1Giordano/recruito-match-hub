
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogIn } from "lucide-react";
import BrandedGradient from "@/components/ui/animated/BrandedGradient";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const { user, loading } = useAuth();
  const { toast } = useToast();

  // Gestione URL di conferma email
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const type = urlParams.get('type');
      
      if (token && type === 'email') {
        console.log('Processing email confirmation...');
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email'
          });
          
          if (error) {
            console.error('Email confirmation error:', error);
            toast({
              title: "Errore conferma email",
              description: "Si è verificato un errore durante la conferma dell'email. Prova ad accedere normalmente.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Email confermata!",
              description: "La tua email è stata confermata con successo. Benvenuto!",
            });
            // Pulisci l'URL dai parametri
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('Unexpected email confirmation error:', error);
          toast({
            title: "Errore",
            description: "Si è verificato un errore imprevisto.",
            variant: "destructive",
          });
        }
      }
    };

    handleEmailConfirmation();
  }, [toast]);

  // Timeout di sicurezza ridotto a 2 secondi per un'esperienza più veloce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn('Loading timeout reached after 2s, forcing app to show');
        setLoadingTimeout(true);
      }
    }, 2000); // Ridotto da 10 a 2 secondi

    return () => clearTimeout(timer);
  }, [loading]);

  // Mostra il loading screen solo per i primi 2 secondi massimo
  if (loading && !loadingTimeout) {
    return <LoadingScreen />;
  }

  const handleAuthSuccess = () => {
    console.log('Auth success, redirecting to dashboard');
    setShowAuth(false);
    setShowDashboard(true);
  };

  const handleShowAuth = () => {
    console.log('Showing auth page');
    setShowAuth(true);
  };

  const handleShowDashboard = () => {
    console.log('Showing dashboard');
    setShowDashboard(true);
  };

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} onAuthSuccess={handleAuthSuccess} />;
  }

  if (showDashboard) {
    return <DashboardNavigation onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BrandedGradient position="fixed" />
      <Header onShowAuth={handleShowAuth} onShowDashboard={handleShowDashboard} />
      <main>
        <Hero onShowAuth={handleShowAuth} onShowDashboard={handleShowDashboard} />
        
        {/* Target Audience Section */}
        <section className="py-20 bg-gradient-to-r from-recruito-blue/5 via-recruito-teal/5 to-recruito-green/5 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-gradient">Chi siamo qui per servire</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recruiter Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover-lift group">
                  <div className="text-6xl mb-6">🎯</div>
                  <h3 className="text-2xl font-bold mb-4">Sei un Recruiter?</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Marginalità più vantaggiose, portafoglio di posizioni aperte, 
                    ranking pubblico basato sul merito e sistema di gamification.
                  </p>
                  <Link to="/recruiter">
                    <Button className="gradient-recruito text-white w-full py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      Scopri di più
                    </Button>
                  </Link>
                </div>
                
                {/* Azienda Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover-lift group">
                  <div className="text-6xl mb-6">🏢</div>
                  <h3 className="text-2xl font-bold mb-4">Sei un'Azienda?</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Network di recruiter verificati, zero costi fissi, 
                    time-to-hire ridotto e AI per ottimizzare gli annunci.
                  </p>
                  <Link to="/aziende">
                    <Button variant="outline" className="w-full py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 group-hover:scale-105">
                      Scopri di più
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-recruito-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-recruito-teal/10 rounded-full blur-3xl"></div>
        </section>

        {/* Demo Section */}
        <section className="py-20" data-demo-section id="demo">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">🚀 Testa la piattaforma</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                La piattaforma che connette aziende e recruiter freelance verificati. 
                Accesso a rete di top recruiter specializzati per settore.
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                {user ? (
                  <Button onClick={() => setShowDashboard(true)} size="lg" className="gradient-recruito text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Accedi alla Dashboard
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Button onClick={() => setShowAuth(true)} size="lg" className="gradient-recruito text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <LogIn className="h-5 w-5 mr-2" />
                      Accedi / Registrati
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Devi essere autenticato per accedere alla demo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
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
