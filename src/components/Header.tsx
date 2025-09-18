import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import MobileMenu from "./MobileMenu";
import RecruiterProfileButton from "./recruiter/RecruiterProfileButton";
import { MessageIcon } from "./messaging/MessageIcon";
import { MessageCenter } from "./messaging/MessageCenter";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { Building2 } from "lucide-react";
import { useState } from "react";

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
          <Link 
            to="/" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/recruiter" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Per Recruiter
          </Link>
          <Link 
            to="/aziende" 
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
              <>
                <Button
                  onClick={handleCompanyButtonClick}
                  size="sm"
                  className="gradient-recruito text-white border-0 hover:opacity-90"
                >
                  Prova Beta - Azienda
                </Button>
                <Button
                  onClick={handleRecruiterButtonClick}
                  size="sm"
                  variant="outline"
                  className="hover:bg-gray-50"
                >
                  Demo Recruiter
                </Button>
              </>
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
