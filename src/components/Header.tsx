
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import MobileMenu from "./MobileMenu";

interface HeaderProps {
  onShowAuth?: () => void;
  onShowDashboard?: () => void;
}

const Header = ({ onShowAuth, onShowDashboard }: HeaderProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user } = useAuth();

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
          <button 
            onClick={() => handleNavClick('problema')} 
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Problema
          </button>
          <button 
            onClick={() => handleNavClick('soluzione')} 
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Soluzione
          </button>
          <button 
            onClick={() => handleNavClick('mercato')} 
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Mercato
          </button>
          <button 
            onClick={() => handleNavClick('business')} 
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Business
          </button>
          
          <div className="flex items-center space-x-4 ml-8">
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
          </div>
        </nav>

        <div className="flex items-center">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
