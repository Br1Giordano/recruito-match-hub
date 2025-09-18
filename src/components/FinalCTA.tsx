import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 gradient-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Inizia Ora
        </h2>
        <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          Unisciti alle centinaia di aziende e recruiter che hanno già scelto Recruito. 
          La registrazione è gratuita e puoi iniziare subito.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/aziende')}
            className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto min-w-[200px]"
          >
            Sono un'Azienda
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/recruiter')}
            className="border-white text-white hover:bg-white/10 w-full sm:w-auto min-w-[200px]"
          >
            Sono un Recruiter
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;