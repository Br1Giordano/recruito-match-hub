import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface NewHeroProps {
  onShowAuth?: () => void;
}

const NewHero = ({ onShowAuth }: NewHeroProps) => {
  const handleCompanyClick = () => {
    if (onShowAuth) {
      onShowAuth();
    }
  };

  const handleRecruiterClick = () => {
    if (onShowAuth) {
      onShowAuth();
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-heading">
            Trova i migliori recruiter, <span className="text-gradient">oggi.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-readable max-w-3xl mx-auto leading-relaxed">
            Recruito è la piattaforma che collega aziende e recruiter freelance 
            per assunzioni rapide, trasparenti ed efficaci.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              variant="default"
              onClick={handleCompanyClick}
              className="w-full sm:w-auto min-w-[220px]"
            >
              Sono un'Azienda
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleRecruiterClick}
              className="w-full sm:w-auto min-w-[220px] border-2 border-primary text-primary hover:bg-primary hover:text-white"
            >
              Sono un Recruiter
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-readable">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-lg">Recruiter Verificati</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-readable">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-lg">Risultati Rapidi</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-readable">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-lg">Solo a Successo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHero;