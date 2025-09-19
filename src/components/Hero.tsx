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
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-12 animate-fade-in">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-navy leading-tight">
                Il recruiting che{' '}
                <span className="text-gradient block">funziona davvero</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg">
                Connetti la tua azienda con i migliori recruiter freelance d'Italia. 
                Assumi profili qualificati in tempi rapidi, pagando solo a risultato.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={scrollToDemo} 
                className="inline-flex items-center justify-center gap-3 gradient-primary text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-startup hover:shadow-startup-hover transform hover:scale-105 ripple min-w-[280px]"
              >
                <Building2 className="h-6 w-6" />
                Unisciti come azienda
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button 
                onClick={scrollToDemo} 
                className="inline-flex items-center justify-center gap-3 gradient-primary text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-startup hover:shadow-startup-hover transform hover:scale-105 ripple min-w-[280px]"
              >
                <Users className="h-6 w-6" />
                Unisciti come recruiter
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Visualization */}
          <div className="relative animate-slide-in flex items-center justify-center min-h-[600px]">
            {/* Clean illustration matching the reference */}
            <div className="relative z-10 flex items-center justify-center">
              
              {/* Company Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
                <div className="text-lg font-semibold text-navy">Aziende</div>
              </div>

              {/* Connection Flow */}
              <div className="mx-12 flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:0.3s]"></div>
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:0.6s]"></div>
                </div>
                
                <div className="w-20 h-20 bg-white rounded-full border-2 border-primary/20 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-primary animate-pulse" />
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse [animation-delay:0.9s]"></div>
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse [animation-delay:1.2s]"></div>
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse [animation-delay:1.5s]"></div>
                </div>
              </div>

              {/* Recruiter Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-primary-end rounded-3xl flex items-center justify-center shadow-lg">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <div className="text-lg font-semibold text-navy">Recruiter</div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute top-16 right-8 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8 text-primary" />
            </div>

            <div className="absolute bottom-20 left-8 w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>

            <div className="absolute top-32 left-16 w-10 h-10 bg-primary-end/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-end" />
            </div>

            {/* Subtle geometric background shapes */}
            <div className="absolute top-12 right-16 w-20 h-20 border-2 border-primary/10 rounded-full"></div>
            <div className="absolute bottom-16 right-20 w-6 h-6 bg-accent/30 rotate-45"></div>
            <div className="absolute top-1/2 left-4 w-8 h-8 bg-primary-end/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;