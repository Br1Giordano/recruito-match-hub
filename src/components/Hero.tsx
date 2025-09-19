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
            {/* Recruiting Process Visualization */}
            <div className="relative flex items-center justify-center min-h-[500px]">
              
              {/* Central Connection Flow */}
              <div className="relative z-10 flex items-center justify-center">
                
                {/* Company Side */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-end rounded-2xl flex items-center justify-center shadow-lg animate-float-slow">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-700">Aziende</div>
                </div>

                {/* Connection Flow */}
                <div className="mx-8 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
                  
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full border-2 border-primary/20 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse [animation-delay:0.6s]"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse [animation-delay:0.8s]"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse [animation-delay:1s]"></div>
                  </div>
                </div>

                {/* Recruiter Side */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg animate-float-slow [animation-delay:1s]">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-700">Recruiter</div>
                </div>
              </div>

              {/* Floating Process Icons */}
              <div className="absolute top-16 left-16 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg animate-float-slow border border-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>

              <div className="absolute bottom-20 right-16 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg animate-float-slow [animation-delay:2s] border border-secondary/10">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>

              <div className="absolute top-32 right-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md animate-float-slow [animation-delay:1.5s] border border-accent/10">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>

              {/* Abstract Brand Elements */}
              <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-primary/10 to-primary-end/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-12 left-12 w-40 h-40 bg-gradient-to-tr from-secondary/10 to-accent/10 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-8 w-20 h-20 bg-gradient-to-br from-accent/15 to-primary/15 rounded-full blur-xl"></div>
              
              {/* Geometric Shapes */}
              <div className="absolute top-20 left-1/3 w-6 h-6 border-2 border-primary/30 rotate-45 animate-spin-slow"></div>
              <div className="absolute bottom-24 right-1/3 w-4 h-4 bg-secondary/40 rounded-full animate-bounce-slow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;