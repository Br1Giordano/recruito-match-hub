
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
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
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button 
              onClick={() => handleNavClick('come-funziona')} 
              className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors py-2"
            >
              Come Funziona
            </button>
            <button 
              onClick={() => handleNavClick('problema')} 
              className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors py-2"
            >
              Problema
            </button>
            <button 
              onClick={() => handleNavClick('soluzione')} 
              className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors py-2"
            >
              Soluzione
            </button>
            <button 
              onClick={() => handleNavClick('mercato')} 
              className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors py-2"
            >
              Mercato
            </button>
            <button 
              onClick={() => handleNavClick('business')} 
              className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors py-2"
            >
              Business
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
