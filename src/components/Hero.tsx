import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, CheckCircle, Zap, Play } from "lucide-react";

interface HeroProps {
  onShowAuth?: () => void;
  onShowDashboard?: () => void;
}

const Hero = ({ onShowAuth, onShowDashboard }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="container mx-auto px-6 py-24">
        <div className="text-center space-y-12 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="w-4 h-4" />
            La rivoluzione del recruiting è qui
          </div>

          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Il recruiting che{" "}
              <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                funziona davvero
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connetti la tua azienda con i migliori recruiter freelance d'Italia. 
              Assumi profili qualificati in tempi rapidi, pagando solo a risultato.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={onShowAuth}
              className="w-full sm:w-auto"
            >
              <Building2 className="w-5 h-5 mr-2" />
              Inizia come azienda
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={onShowAuth}
              className="w-full sm:w-auto"
            >
              <Users className="w-5 h-5 mr-2" />
              Diventa recruiter
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Solo a risultato
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Recruiter verificati
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Processo digitale
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative mt-16 max-w-4xl mx-auto">
            <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border/50 overflow-hidden">
              {/* Mockup placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <Play className="w-12 h-12 text-primary ml-1" />
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-border/50">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute top-8 right-8 w-16 h-16 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-border/50">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50">
                <span className="text-sm font-medium text-foreground">Connessione istantanea</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;