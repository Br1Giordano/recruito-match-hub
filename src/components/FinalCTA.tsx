import { Button } from "@/components/ui/button";

interface FinalCTAProps {
  onShowAuth?: () => void;
}

const FinalCTA = ({ onShowAuth }: FinalCTAProps) => {
  const handleClick = () => {
    if (onShowAuth) {
      onShowAuth();
    }
  };

  return (
    <section className="py-20 gradient-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Inizia Ora
        </h2>
        <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed">
          Unisciti alle centinaia di aziende e recruiter che hanno già scelto Recruito. 
          La registrazione è gratuita e puoi iniziare subito.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            size="lg" 
            variant="secondary"
            onClick={handleClick}
            className="w-full sm:w-auto min-w-[220px] bg-white text-primary hover:bg-gray-100"
          >
            Sono un'Azienda
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={handleClick}
            className="w-full sm:w-auto min-w-[220px] border-2 border-white text-white hover:bg-white hover:text-primary"
          >
            Sono un Recruiter
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;