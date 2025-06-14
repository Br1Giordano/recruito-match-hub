
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/2b14001c-d6fa-47cf-84de-a64fba53c4fb.png" 
            alt="Recruito Logo" 
            className="h-12 w-auto"
          />
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#come-funziona" className="text-gray-600 hover:text-gray-900 transition-colors">
            Come Funziona
          </a>
          <a href="#problema" className="text-gray-600 hover:text-gray-900 transition-colors">
            Problema
          </a>
          <a href="#soluzione" className="text-gray-600 hover:text-gray-900 transition-colors">
            Soluzione
          </a>
          <a href="#mercato" className="text-gray-600 hover:text-gray-900 transition-colors">
            Mercato
          </a>
          <a href="#business" className="text-gray-600 hover:text-gray-900 transition-colors">
            Business
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" className="hidden sm:inline-flex">
            Sono un Recruiter
          </Button>
          <Button className="gradient-recruito text-white border-0 hover:opacity-90">
            Sono un'Azienda
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
