
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ProblemSolution from "@/components/ProblemSolution";
import Market from "@/components/Market";
import BusinessModel from "@/components/BusinessModel";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <ProblemSolution />
      <Market />
      <BusinessModel />
      <Footer />
    </div>
  );
};

export default Index;
