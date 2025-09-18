
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, Zap, Sparkles, TrendingUp, Building2 } from "lucide-react";


interface HeroProps {
  onShowAuth?: () => void;
  onShowDashboard?: () => void;
}

const Hero = ({ onShowAuth, onShowDashboard }: HeroProps) => {
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
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
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
              <button 
                onClick={scrollToDemo}
                className="inline-flex items-center gap-2 gradient-primary text-white px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 cursor-pointer shadow-startup hover:shadow-startup-hover transform hover:scale-105 ripple"
              >
                <Building2 className="h-5 w-5" />
                Unisciti come azienda
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button 
                onClick={scrollToDemo}
                className="inline-flex items-center gap-2 gradient-primary text-white px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 cursor-pointer shadow-startup hover:shadow-startup-hover transform hover:scale-105 ripple"
              >
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
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover-lift">
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold text-gradient mb-2">Recruiter Verificati</h3>
                  <p className="text-gray-600 text-sm">Solo i migliori professionisti, selezionati e valutati</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover-lift">
                  <Zap className="h-12 w-12 text-primary-end mb-4" />
                  <h3 className="font-semibold text-gradient mb-2">Risultati Rapidi</h3>
                  <p className="text-gray-600 text-sm">Profili qualificati in giorni, non mesi</p>
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover-lift">
                  <Target className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold text-gradient mb-2">Solo a Successo</h3>
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
