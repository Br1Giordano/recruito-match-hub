
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
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-blob absolute top-20 left-20 w-32 h-32 bg-primary/10 animate-float stagger-1" />
        <div className="floating-blob absolute top-40 right-32 w-24 h-24 bg-primary-glow/15 animate-float stagger-3" />
        <div className="floating-blob absolute bottom-32 left-1/3 w-28 h-28 bg-primary/8 animate-float stagger-5" />
      </div>
      
      <div className="container-modern py-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12 animate-fade-in-up">
            <div className="space-y-8">
              <h1 className="text-6xl lg:text-8xl font-black text-foreground leading-[0.9] tracking-tight">
                Il recruiting che 
                <span className="text-gradient block animate-glow">funziona davvero</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-medium max-w-2xl">
                Connetti la tua azienda con i migliori recruiter freelance d'Italia. 
                Assumi profili qualificati in tempi rapidi, pagando solo a risultato.
              </p>
            </div>

            {/* Modern CTAs with advanced effects */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8 animate-scale-in stagger-2">
              <button 
                onClick={scrollToDemo}
                className="group relative inline-flex items-center gap-3 gradient-primary hover:shadow-glow text-primary-foreground px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-500 cursor-pointer shadow-strong hover:shadow-strong hover:scale-105 ripple-effect overflow-hidden"
              >
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Building2 className="h-6 w-6 transition-transform group-hover:scale-110" />
                <span>Unisciti come azienda</span>
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button 
                onClick={scrollToDemo}
                className="group relative inline-flex items-center gap-3 glass-card hover:shadow-medium text-foreground px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-500 cursor-pointer hover:scale-105 ripple-effect overflow-hidden border border-border/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Users className="h-6 w-6 transition-transform group-hover:scale-110" />
                <span>Unisciti come recruiter</span>
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 animate-fade-in-up stagger-3">
              <div className="group text-center space-y-3 p-6 rounded-xl hover-lift transition-all duration-300">
                <div className="text-4xl font-black text-foreground group-hover:text-primary transition-colors">Solo successo</div>
                <div className="text-lg text-muted-foreground font-medium">Paghi solo a risultato ottenuto</div>
              </div>
              <div className="group text-center space-y-3 p-6 rounded-xl hover-lift transition-all duration-300">
                <div className="text-4xl font-black text-foreground group-hover:text-primary transition-colors">Qualità garantita</div>
                <div className="text-lg text-muted-foreground font-medium">Recruiter selezionati e verificati</div>
              </div>
              <div className="group text-center space-y-3 p-6 rounded-xl hover-lift transition-all duration-300">
                <div className="text-4xl font-black text-foreground group-hover:text-primary transition-colors">Processo digitale</div>
                <div className="text-lg text-muted-foreground font-medium">Piattaforma moderna ed efficiente</div>
              </div>
            </div>
          </div>

          <div className="relative animate-slide-in stagger-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="group gradient-card p-8 rounded-3xl shadow-medium hover-float border border-border/20">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Recruiter Verificati</h3>
                  <p className="text-muted-foreground leading-relaxed">Solo i migliori professionisti, selezionati e valutati con standard elevati</p>
                </div>
                <div className="group gradient-card p-8 rounded-3xl shadow-medium hover-float border border-border/20">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Risultati Rapidi</h3>
                  <p className="text-muted-foreground leading-relaxed">Profili qualificati in giorni, non mesi. Efficienza garantita</p>
                </div>
              </div>
              <div className="space-y-8 md:pt-12">
                <div className="group gradient-card p-8 rounded-3xl shadow-medium hover-float border border-border/20">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Solo a Successo</h3>
                  <p className="text-muted-foreground leading-relaxed">Paghi solo quando trovi e assumi il candidato giusto. Zero rischi</p>
                </div>
                <div className="group gradient-card p-8 rounded-3xl shadow-medium hover-float border border-border/20">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">AI Powered</h3>
                  <p className="text-muted-foreground leading-relaxed">Matching intelligente tra aziende e recruiter per risultati ottimali</p>
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
