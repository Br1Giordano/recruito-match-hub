
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2 } from "lucide-react";

interface HeroProps {
  onShowAuth?: () => void;
  onShowDashboard?: () => void;
}

const Hero = ({ onShowAuth, onShowDashboard }: HeroProps) => {
  const scrollToRegistration = () => {
    const element = document.getElementById('final-cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-8xl font-bold text-foreground leading-tight tracking-tight">
              Trova i migliori
              <span className="text-gradient block">recruiter, oggi.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Recruito è la piattaforma che collega aziende e recruiter freelance per assunzioni rapide, trasparenti ed efficaci.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              onClick={onShowAuth}
              size="lg"
              className="w-full sm:w-auto min-w-[200px] text-lg"
            >
              <Building2 className="mr-2 h-5 w-5" />
              Sono un'Azienda
            </Button>
            
            <Button 
              onClick={onShowAuth}
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto min-w-[200px] text-lg border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Users className="mr-2 h-5 w-5" />
              Sono un Recruiter
            </Button>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            <div className="space-y-3">
              <div className="text-3xl font-bold text-gradient">15%</div>
              <div className="text-lg font-medium text-foreground">Fee solo a successo</div>
              <div className="text-sm text-muted-foreground">vs 15-25% dei metodi tradizionali</div>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-gradient">Top 1%</div>
              <div className="text-lg font-medium text-foreground">Recruiter verificati</div>
              <div className="text-sm text-muted-foreground">Network selezionato e qualificato</div>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-gradient">Zero</div>
              <div className="text-lg font-medium text-foreground">Costi fissi</div>
              <div className="text-sm text-muted-foreground">Paghi solo quando assumi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

};

export default Hero;
