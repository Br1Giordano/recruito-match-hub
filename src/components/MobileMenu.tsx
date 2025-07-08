
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
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-muted"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 w-64 bg-card border border-border rounded-lg shadow-lg z-50 mt-2">
            <div className="p-4 space-y-3">
              <button 
                onClick={() => handleNavClick('come-funziona')} 
                className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors py-2 px-2 rounded hover:bg-muted"
              >
                Come Funziona
              </button>
              <button 
                onClick={() => handleNavClick('problema')} 
                className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors py-2 px-2 rounded hover:bg-muted"
              >
                Problema
              </button>
              <button 
                onClick={() => handleNavClick('soluzione')} 
                className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors py-2 px-2 rounded hover:bg-muted"
              >
                Soluzione
              </button>
              <button 
                onClick={() => handleNavClick('mercato')} 
                className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors py-2 px-2 rounded hover:bg-muted"
              >
                Mercato
              </button>
              <button 
                onClick={() => handleNavClick('business')} 
                className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors py-2 px-2 rounded hover:bg-muted"
              >
                Business
              </button>
              
              <div className="border-t border-border pt-3 mt-4 space-y-2">
                <Button
                  size="sm"
                  className="w-full gradient-recruito text-white border-0 hover:opacity-90"
                  onClick={() => {
                    setIsOpen(false);
                    // Add appropriate navigation logic here
                  }}
                >
                  Azienda
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full hover:bg-muted border-border"
                  onClick={() => {
                    setIsOpen(false);
                    // Add appropriate navigation logic here
                  }}
                >
                  Recruiter
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
