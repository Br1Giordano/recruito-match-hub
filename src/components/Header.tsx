import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import MobileMenu from "./MobileMenu";
import RecruiterProfileButton from "./recruiter/RecruiterProfileButton";
import { MessageIcon } from "./messaging/MessageIcon";
import { MessageCenter } from "./messaging/MessageCenter";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { Building2, Wrench } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DASHBOARD_MAINTENANCE_MODE } from "@/App";

interface HeaderProps {
  onShowAuth?: () => void;
  onShowDashboard?: () => void;
}

const Header = ({ onShowAuth, onShowDashboard }: HeaderProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, userProfile } = useAuth();
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
  const { hasNewMessages, clearMessageNotifications } = useRealTimeNotifications();

  const handleOpenMessageCenter = () => {
    setIsMessageCenterOpen(true);
    clearMessageNotifications();
  };

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavClick = (sectionId: string) => {
    if (isHomePage) {
      scrollToSection(sectionId);
    } else {
      // Se non siamo nella homepage, naviga prima alla homepage e poi scrolla
      window.location.href = `/#${sectionId}`;
    }
  };

  const handleDemoNavigation = () => {
    if (isHomePage) {
      // Cerca l'elemento con data-demo-section
      const demoElement = document.querySelector('[data-demo-section]');
      if (demoElement) {
        demoElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = '/#demo';
    }
  };

  const handleCompanyButtonClick = () => {
    console.log('Company button clicked in header', { user });
    if (user) {
      onShowDashboard?.();
    } else {
      onShowAuth?.();
    }
  };

  const handleRecruiterButtonClick = () => {
    console.log('Recruiter button clicked in header', { user });
    if (user) {
      onShowDashboard?.();
    } else {
      onShowAuth?.();
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img 
              src="/lovable-uploads/2b14001c-d6fa-47cf-84de-a64fba53c4fb.png" 
              alt="Recruito Logo" 
              className="h-12 w-auto cursor-pointer"
            />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => handleNavClick('come-funziona')} 
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Come Funziona
          </button>
          <Link 
            to="/for-recruiters" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Per Recruiter
          </Link>
          <Link 
            to="/for-companies" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Per Aziende
          </Link>
          
          <div className="flex items-center space-x-4 ml-8">
            {/* Se l'utente è autenticato, mostra il profilo o i pulsanti in base al tipo utente */}
            {user && userProfile ? (
              <>
                <MessageIcon onClick={handleOpenMessageCenter} hasNotification={hasNewMessages} />
                {userProfile.user_type === 'recruiter' ? (
                  <RecruiterProfileButton />
                ) : DASHBOARD_MAINTENANCE_MODE ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            size="sm"
                            disabled
                            className="gradient-recruito text-white border-0 opacity-60 cursor-not-allowed flex items-center gap-2"
                          >
                            <Wrench className="h-4 w-4" />
                            Dashboard Azienda
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-center">
                          Dashboard temporaneamente sospese per gestire le numerose richieste. 
                          Usa il form "Prenota una Demo" per essere ricontattato!
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button
                    onClick={onShowDashboard}
                    size="sm"
                    className="gradient-recruito text-white border-0 hover:opacity-90 flex items-center gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    Dashboard Azienda
                  </Button>
                )}
              </>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        size="sm"
                        disabled
                        className="gradient-recruito text-white border-0 opacity-60 cursor-not-allowed flex items-center gap-2"
                      >
                        <Wrench className="h-4 w-4" />
                        Join Us
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-center">
                      Sistema temporaneamente in manutenzione per gestire le numerose richieste. 
                      Usa il form "Prenota una Demo" per essere ricontattato!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </nav>

        <div className="flex items-center space-x-2">
          <MobileMenu />
        </div>
      </div>
      
      {user && userProfile && (
        <MessageCenter
          isOpen={isMessageCenterOpen}
          onClose={() => setIsMessageCenterOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
