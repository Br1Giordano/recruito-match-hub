
import { Link, useLocation } from 'react-router-dom';

const NavigationFooter = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleNavClick = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <div className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <button 
            onClick={() => handleNavClick('come-funziona')} 
            className="text-gray-600 hover:text-recruito-blue transition-colors"
          >
            Come Funziona
          </button>
          <button 
            onClick={() => handleNavClick('problema')} 
            className="text-gray-600 hover:text-recruito-blue transition-colors"
          >
            Problema
          </button>
          <button 
            onClick={() => handleNavClick('soluzione')} 
            className="text-gray-600 hover:text-recruito-blue transition-colors"
          >
            Soluzione
          </button>
          <button 
            onClick={() => handleNavClick('mercato')} 
            className="text-gray-600 hover:text-recruito-blue transition-colors"
          >
            Mercato
          </button>
          <button 
            onClick={() => handleNavClick('business')} 
            className="text-gray-600 hover:text-recruito-blue transition-colors"
          >
            Business
          </button>
          <span className="text-gray-400">|</span>
          <Link 
            to="/privacy-policy" 
            className="text-gray-600 hover:text-recruito-blue transition-colors"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/terms-of-service" 
            className="text-gray-600 hover:text-recruito-blue transition-colors"
          >
            Termini di Servizio
          </Link>
          <Link 
            to="/cookie-policy" 
            className="text-gray-600 hover:text-recruito-blue transition-colors"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavigationFooter;
