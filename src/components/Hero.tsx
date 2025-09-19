import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, Zap, Sparkles, TrendingUp, Building2 } from "lucide-react";
import BrandedGradient from "@/components/ui/animated/BrandedGradient";
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
    <section className="relative min-h-screen flex items-center justify-center">
      <BrandedGradient />
      {/* Optional announcement banner like Paraform */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 text-sm text-muted-foreground shadow-sm">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          Unisciti ai migliori recruiter d'Italia
        </div>
      </div>

      <div className="container mx-auto px-4 text-center max-w-5xl">
        <div className="space-y-8 animate-fade-in">
          {/* Main headline - inspired by Paraform's clean approach */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
            Dove le aziende innovative assumono i loro{' '}
            <span className="text-gradient">migliori talenti</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Connettiti con recruiter esperti e riempi le tue posizioni più difficili.
          </p>

          {/* Single CTA - clean like Paraform */}
          <div className="pt-12 pb-8">
            <Button 
              onClick={scrollToDemo}
              size="lg"
              className="text-lg px-12 py-6 h-auto min-w-[200px]"
            >
              Inizia ora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;