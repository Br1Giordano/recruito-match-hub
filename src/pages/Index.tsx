
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardNavigation from "@/components/DashboardNavigation";
import AuthPage from "@/components/auth/AuthPage";
import { DemoRequestForm } from "@/components/DemoRequestForm";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, Wrench } from "lucide-react";
import BrandedGradient from "@/components/ui/animated/BrandedGradient";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DASHBOARD_MAINTENANCE_MODE } from "@/App";

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

  // Auto-redirect alla dashboard se l'utente è già autenticato
  useEffect(() => {
    if (user && !showAuth && !showDashboard && !DASHBOARD_MAINTENANCE_MODE) {
      console.log('User authenticated, auto-redirecting to dashboard');
      setShowDashboard(true);
    }
  }, [user, showAuth, showDashboard]);

  // Gestione chiusura dashboard da URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('closeDashboard') === '1') {
      console.log('Closing dashboard from URL parameter');
      setShowDashboard(false);
      // Pulisci l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Mostra il loading screen solo per i primi 2 secondi massimo
  if (loading && !loadingTimeout) {
    return <LoadingScreen />;
  }

  const handleAuthSuccess = () => {
    console.log('Auth success, redirecting to dashboard');
    setShowAuth(false);
    // Aspetta un piccolo delay per permettere al useAuth di aggiornare lo stato
    setTimeout(() => {
      setShowDashboard(true);
    }, 100);
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
        
        {/* Demo Section with improved styling */}
        <div className="py-20 bg-gradient-to-r from-recruito-blue/5 via-recruito-teal/5 to-recruito-green/5 relative overflow-hidden" data-demo-section id="demo">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-recruito-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-recruito-teal/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 text-gradient">🚀 Join the Beta</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Esplora in anteprima il sistema completo di gestione proposte e candidature. 
                Testa tutte le funzionalità per recruiter e aziende in un ambiente completamente funzionale.
              </p>
              <p className="text-sm text-muted-foreground/70 mb-6">
                Accesso in pausa per manutenzione dovuta alle numerose richieste
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover-lift">
                {user ? (
                  DASHBOARD_MAINTENANCE_MODE ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block">
                            <Button 
                              disabled
                              size="lg" 
                              className="gradient-recruito text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-lg opacity-60 cursor-not-allowed flex items-center gap-2"
                            >
                              <Wrench className="h-5 w-5" />
                              Accedi ai primi test
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-center">
                            Dashboard temporaneamente sospese per gestire le numerose richieste.<br/>
                            Usa il form "Prenota una Demo" qui sotto!
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Button onClick={() => setShowDashboard(true)} size="lg" className="gradient-recruito text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Accedi ai primi test
                    </Button>
                  )
                ) : (
                  <div className="space-y-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block">
                            <Button 
                              disabled
                              size="lg" 
                              className="gradient-recruito text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-lg opacity-60 cursor-not-allowed flex items-center gap-2"
                            >
                              <Wrench className="h-5 w-5" />
                              Accedi / Registrati
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-center">
                            Sistema temporaneamente in manutenzione per gestire le numerose richieste.<br/>
                            Usa il form "Prenota una Demo" qui sotto!
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <p className="text-sm text-muted-foreground">
                      Sistema in manutenzione - Prenota una demo per essere ricontattato
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
        <DemoRequestForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
