import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, Zap } from "lucide-react";

interface HeroProps {
  onShowAuth?: () => void;
  onShowDashboard?: () => void;
}

const Hero = ({ onShowAuth, onShowDashboard }: HeroProps) => {
  const scrollToDemo = () => {
    // Usa un timeout per assicurarti che il DOM sia completamente caricato
    setTimeout(() => {
      const demoElement = document.getElementById('demo');
      if (demoElement) {
        console.log('Scrolling to demo section');
        demoElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.error('Demo section not found');
        // Scroll manuale alla posizione approssimativa
        window.scrollTo({
          top: 800, // Posizione approssimativa della sezione demo
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById('come-funziona');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-recruito opacity-5"></div>
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Il recruiting che 
                <span className="text-gradient block">funziona davvero</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
                Connetti la tua azienda con i migliori recruiter freelance d'Italia. 
                Assumi profili qualificati in tempi rapidi, pagando solo a risultato.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                size="lg" 
                className="gradient-recruito text-white border-0 hover:opacity-90 text-lg px-10 py-5"
                onClick={scrollToDemo}
                type="button"
              >
                Inizia subito la tua ricerca
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 py-5"
                onClick={scrollToHowItWorks}
                type="button"
              >
                Come Funziona
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-gray-900">Solo successo</div>
                <div className="text-base text-gray-600">Paghi solo a risultato ottenuto</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-gray-900">Qualità garantita</div>
                <div className="text-base text-gray-600">Recruiter selezionati e verificati</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-gray-900">Processo digitale</div>
                <div className="text-base text-gray-600">Piattaforma moderna ed efficiente</div>
              </div>
            </div>
          </div>

          <div className="relative animate-slide-in">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover-lift">
                  <Users className="h-12 w-12 text-recruito-blue mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Recruiter Verificati</h3>
                  <p className="text-gray-600 text-sm">Solo i migliori professionisti, selezionati e valutati</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover-lift">
                  <Zap className="h-12 w-12 text-recruito-green mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Risultati Rapidi</h3>
                  <p className="text-gray-600 text-sm">Profili qualificati in giorni, non mesi</p>
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover-lift">
                  <Target className="h-12 w-12 text-recruito-teal mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Solo a Successo</h3>
                  <p className="text-gray-600 text-sm">Paghi solo quando trovi e assumi il candidato giusto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
