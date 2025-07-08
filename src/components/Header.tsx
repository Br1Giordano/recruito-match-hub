import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import MobileMenu from "./MobileMenu";
import RecruiterProfileButton from "./recruiter/RecruiterProfileButton";

interface HeaderProps {
  onShowAuth?: () => void;
  onShowDashboard?: () => void;
}

const Header = ({ onShowAuth, onShowDashboard }: HeaderProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, userProfile } = useAuth();

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
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/2b14001c-d6fa-47cf-84de-a64fba53c4fb.png" 
              alt="Recruito Logo" 
              className="h-10 sm:h-12 w-auto cursor-pointer"
            />
          </Link>
        </div>
        
        <nav className="hidden lg:flex items-center space-x-6">
          <button 
            onClick={() => handleNavClick('come-funziona')} 
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm font-medium"
          >
            Come Funziona
          </button>
          <button 
            onClick={() => handleNavClick('problema')} 
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm font-medium"
          >
            Problema
          </button>
          <button 
            onClick={() => handleNavClick('soluzione')} 
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm font-medium"
          >
            Soluzione
          </button>
          <button 
            onClick={() => handleNavClick('mercato')} 
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm font-medium"
          >
            Mercato
          </button>
          <button 
            onClick={() => handleNavClick('business')} 
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm font-medium"
          >
            Business
          </button>
        </nav>

        <div className="flex items-center space-x-3">
          {/* Pulsanti per utenti autenticati o guest */}
          {user && userProfile ? (
            <>
              {userProfile.user_type === 'recruiter' ? (
                <RecruiterProfileButton />
              ) : (
                <Button
                  onClick={onShowDashboard}
                  size="sm"
                  className="gradient-recruito text-white border-0 hover:opacity-90 hidden sm:inline-flex"
                >
                  Dashboard
                </Button>
              )}
            </>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                onClick={handleCompanyButtonClick}
                size="sm"
                className="gradient-recruito text-white border-0 hover:opacity-90"
              >
                Azienda
              </Button>
              <Button
                onClick={handleRecruiterButtonClick}
                size="sm"
                variant="outline"
                className="hover:bg-muted border-border"
              >
                Recruiter
              </Button>
            </div>
          )}
          
          {/* Mobile menu */}
          <div className="lg:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
