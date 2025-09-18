import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Users, Sparkles } from "lucide-react";

interface FinalCTAProps {
  onShowAuth?: () => void;
}

const FinalCTA = ({ onShowAuth }: FinalCTAProps) => {
  return (
    <section id="final-cta" className="py-24 gradient-primary relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Main Headline */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-white" />
              <span className="text-white/90 text-lg font-medium">È il momento giusto</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Inizia subito a trovare o proporre 
              <span className="block">i migliori talenti</span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Unisciti alla piattaforma che sta rivoluzionando il recruiting in Italia. 
              Zero costi fissi, fee solo a successo, risultati garantiti.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={onShowAuth}
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto min-w-[250px] text-lg h-14 bg-white text-primary hover:bg-white/90 hover:text-primary border-none"
            >
              <Building2 className="mr-3 h-6 w-6" />
              Registrati come Azienda
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            
            <Button 
              onClick={onShowAuth}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto min-w-[250px] text-lg h-14 border-2 border-white text-white hover:bg-white hover:text-primary"
            >
              <Users className="mr-3 h-6 w-6" />
              Registrati come Recruiter
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>

          {/* Trust Elements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-white/20">
            <div className="text-center space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-white">500+</div>
              <div className="text-white/80">Aziende che ci scelgono</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-white">95%</div>
              <div className="text-white/80">Tasso di successo</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-white">15%</div>
              <div className="text-white/80">Fee solo a risultato</div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="pt-8">
            <p className="text-white/70 text-sm">
              ✨ Registrazione gratuita • Nessun costo di attivazione • Supporto dedicato
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;