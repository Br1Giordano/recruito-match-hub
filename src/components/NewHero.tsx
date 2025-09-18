import { Button } from "@/components/ui/button";
import { Users, Target, Zap } from "lucide-react";

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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-heading">
              Il recruiting che{" "}
              <span className="text-gradient">funziona davvero</span>
            </h1>
            
            <p className="text-xl text-readable leading-relaxed max-w-lg">
              Connetti la tua azienda con i migliori recruiter freelance 
              d'Italia. Assumi profili qualificati in tempi rapidi, pagando solo 
              a risultato.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                variant="default"
                onClick={handleCompanyClick}
                className="gradient-primary text-white border-0 hover:opacity-90 min-w-[240px]"
              >
                📋 Unisciti come azienda →
              </Button>
              <Button 
                size="lg" 
                variant="default"
                onClick={handleRecruiterClick}
                className="gradient-primary text-white border-0 hover:opacity-90 min-w-[240px]"
              >
                👥 Unisciti come recruiter →
              </Button>
            </div>
          </div>

          {/* Right Column - Benefit Cards */}
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary">Recruiter Verificati</h3>
              <p className="text-readable">
                Solo i migliori professionisti, selezionati e valutati
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary">Solo a Successo</h3>
              <p className="text-readable">
                Paghi solo quando trovi e assumi il candidato giusto
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-variant" />
              </div>
              <h3 className="text-xl font-semibold text-primary">Risultati Rapidi</h3>
              <p className="text-readable">
                Profili qualificati in giorni, non mesi
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Three Sections */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20 pt-16 border-t border-gray-200">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-gradient">Solo successo</h3>
            <p className="text-readable">Paghi solo a risultato ottenuto</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-gradient">Qualità garantita</h3>
            <p className="text-readable">Recruiter selezionati e verificati</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-gradient">Processo digitale</h3>
            <p className="text-readable">Tutto gestito online in modo semplice</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHero;