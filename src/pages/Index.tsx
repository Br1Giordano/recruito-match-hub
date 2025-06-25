
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ProblemSolution from "@/components/ProblemSolution";
import Market from "@/components/Market";
import BusinessModel from "@/components/BusinessModel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardNavigation from "@/components/DashboardNavigation";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <DashboardNavigation />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        
        {/* Demo Button */}
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <Button 
              onClick={() => setShowDashboard(true)}
              size="lg"
              className="mb-8"
            >
              🚀 Demo Dashboard Sistema Proposte
            </Button>
            <p className="text-muted-foreground">
              Clicca qui per testare il sistema di gestione proposte e candidature
            </p>
          </div>
        </div>
        
        <HowItWorks />
        <ProblemSolution />
        <Market />
        <BusinessModel />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
