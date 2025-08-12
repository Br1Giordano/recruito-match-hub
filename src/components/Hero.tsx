
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Typewriter from "@/components/ui/animated/Typewriter";
import IsometricNetwork from "@/components/ui/animated/IsometricNetwork";

interface HeroProps {
  onShowAuth?: () => void;
  onShowDashboard?: () => void;
}

const Hero = ({ onShowAuth, onShowDashboard }: HeroProps) => {
  const scrollToDemo = () => {
    const demoElement = document.querySelector('[data-demo-section]') ||
      document.getElementById('demo') ||
      document.querySelector('.demo-section');

    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient brand teal */}
      <div className="absolute inset-0 gradient-brand-teal opacity-10" aria-hidden="true"></div>

      <div className="container-startup py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-navy">
            La piattaforma che connette aziende e recruiter.
          </h1>
          <p className="text-2xl text-muted-foreground">
            <Typewriter
              words={["velocemente", "in modo trasparente", "senza costi fissi"]}
            />
          </p>

          <div className="pt-4">
            <Button size="lg" onClick={scrollToDemo} className="hover-scale">
              Scopri la demo
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>

        <div className="relative animate-slide-in">
          <IsometricNetwork className="w-full max-w-[560px] mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
