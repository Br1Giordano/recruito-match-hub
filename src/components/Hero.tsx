
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, Zap, Sparkles, TrendingUp } from "lucide-react";

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

            {/* Sostituisco i pulsanti con elementi grafici accattivanti */}
            <div className="space-y-6">
              {/* Elemento grafico principale */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover-lift">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 gradient-recruito rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Inizia subito la tua ricerca</h3>
                    <p className="text-gray-600">Trova i migliori candidati in pochi giorni</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Disponibile ora</span>
                  </div>
                  <ArrowRight className="h-6 w-6 text-recruito-blue" />
                </div>
              </div>

              {/* Sezione Come Funziona */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-recruito-blue/10 to-recruito-teal/10 rounded-2xl p-6 hover-lift border border-recruito-blue/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-recruito-blue/20 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-recruito-blue" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Come Funziona</h4>
                      <p className="text-sm text-gray-600">Scopri il processo</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Processo semplificato
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-recruito-teal/10 to-recruito-green/10 rounded-2xl p-6 hover-lift border border-recruito-teal/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-recruito-teal/20 rounded-xl flex items-center justify-center">
                      <Target className="h-6 w-6 text-recruito-teal" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Inizia come Azienda</h4>
                      <p className="text-sm text-gray-600">Diventa Partner Recruiter</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      Opportunità illimitate
                    </span>
                  </div>
                </div>
              </div>
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
