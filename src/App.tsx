
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import Index from "./pages/Index";
import ForRecruiters from "./pages/ForRecruiters";
import ForCompanies from "./pages/ForCompanies";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import AuthPage from "./components/auth/AuthPage";
import MaintenancePage from "./components/MaintenancePage";
import CookieBanner from "./components/CookieBanner";

const AppContent = () => {
  useRealTimeNotifications();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/for-recruiters" element={<ForRecruiters />} />
        <Route path="/for-companies" element={<ForCompanies />} />
        <Route path="/auth" element={<AuthPage onBack={() => window.history.back()} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  );
};

const queryClient = new QueryClient();

// 🚨 MODALITÀ MANUTENZIONE 🚨
// Cambia questo valore a 'true' per attivare la modalità manutenzione
// Cambia questo valore a 'false' per disattivare la modalità manutenzione
const MAINTENANCE_MODE = false;

// 🤖 FUNZIONALITÀ AI DISABILITATE 🤖
export const AI_FEATURES_ENABLED = false;

const App = () => {
  // Se la modalità manutenzione è attiva, mostra solo la pagina di manutenzione
  if (MAINTENANCE_MODE) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <MaintenancePage />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Altrimenti mostra l'app normale con autenticazione
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
