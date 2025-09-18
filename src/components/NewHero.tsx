import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Trova i migliori recruiter,<br />
          <span className="text-gradient">oggi</span>.
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Recruito è la piattaforma che collega aziende e recruiter freelance 
          per assunzioni rapide, trasparenti ed efficaci.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            onClick={() => navigate('/aziende')}
            className="w-full sm:w-auto min-w-[200px]"
          >
            Sono un'Azienda
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate('/recruiter')}
            className="w-full sm:w-auto min-w-[200px]"
          >
            Sono un Recruiter
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Registrazione gratuita</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Recruiter verificati</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Pagamento solo a successo</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHero;