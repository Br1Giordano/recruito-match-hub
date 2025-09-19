import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, Zap, Sparkles, TrendingUp, Building2 } from "lucide-react";
interface HeroProps {
  onShowAuth?: () => void;
  onShowDashboard?: () => void;
}
const Hero = ({
  onShowAuth,
  onShowDashboard
}: HeroProps) => {
  const scrollToDemo = () => {
    console.log('scrollToDemo called - looking for demo section');

    // Try multiple selectors to find the demo section
    let demoElement = document.querySelector('[data-demo-section]');
    if (!demoElement) {
      console.log('data-demo-section not found, trying #demo');
      demoElement = document.getElementById('demo');
    }
    if (!demoElement) {
      console.log('#demo not found, trying .demo-section');
      demoElement = document.querySelector('.demo-section');
    }
    if (demoElement) {
      console.log('Demo section found, scrolling...', demoElement);
      demoElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.error('Demo section not found with any selector');
      // Fallback: scroll to a reasonable position
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };
  const scrollToHowItWorks = () => {
    const element = document.getElementById('come-funziona');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background handled globally on Index page */}
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

            {/* Pulsanti con i colori del brand Recruito */}
            <div className="flex justify-center gap-4 pt-8">
              <button onClick={scrollToDemo} className="inline-flex items-center gap-2 gradient-primary text-white px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 cursor-pointer shadow-startup hover:shadow-startup-hover transform hover:scale-105 ripple">
                <Building2 className="h-5 w-5" />
                Unisciti come azienda
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button onClick={scrollToDemo} className="inline-flex items-center gap-2 gradient-primary text-white px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 cursor-pointer shadow-startup hover:shadow-startup-hover transform hover:scale-105 ripple">
                <Users className="h-5 w-5" />
                Unisciti come recruiter
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-gradient">Solo successo</div>
                <div className="text-base text-gray-600">Paghi solo a risultato ottenuto</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-gradient">Qualità garantita</div>
                <div className="text-base text-gray-600">Recruiter selezionati e verificati</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-gradient">Processo digitale</div>
                <div className="text-base text-gray-600">Piattaforma moderna ed efficiente</div>
              </div>
            </div>
          </div>

          <div className="relative animate-slide-in">
            {/* Visual elements per la sezione destra */}
            <div className="relative flex items-center justify-center min-h-[500px]">
              {/* Floating cards con statistiche */}
              <div className="relative z-10 space-y-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-600">Recruiter attivo</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-gray-900">+500</div>
                    <div className="text-sm text-gray-500">candidati trovati</div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 transform -rotate-2 hover:rotate-0 transition-transform duration-300 ml-8">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-600">Match perfetto</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-gray-900">98%</div>
                    <div className="text-sm text-gray-500">successo placement</div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-600">Tempo medio</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-gray-900">15</div>
                    <div className="text-sm text-gray-500">giorni per assunzione</div>
                  </div>
                </div>
              </div>

              {/* Background decorative elements */}
              <div className="absolute top-10 right-10 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent/20 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;