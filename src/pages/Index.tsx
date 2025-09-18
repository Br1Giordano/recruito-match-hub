
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ProblemSolution from "@/components/ProblemSolution";
import WhyChooseRecruitо from "@/components/WhyChooseRecruitо";
import Mockups from "@/components/Mockups";
import WhoWeAre from "@/components/WhoWeAre";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardNavigation from "@/components/DashboardNavigation";
import AuthPage from "@/components/auth/AuthPage";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
    <div className="relative min-h-screen">
      <BrandedGradient />
      
      <Header onShowAuth={handleShowAuth} onShowDashboard={handleShowDashboard} />
      
      <main>
        <Hero onShowAuth={handleShowAuth} onShowDashboard={handleShowDashboard} />
        <ProblemSolution />
        <HowItWorks />
        <WhyChooseRecruitо />
        <Mockups />
        <div id="chi-siamo">
          <WhoWeAre />
        </div>
        <FAQ />
        <FinalCTA onShowAuth={handleShowAuth} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
