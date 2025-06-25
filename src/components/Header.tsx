
import { Link, useLocation } from "react-router-dom";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
        </nav>

        <div className="flex items-center">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
