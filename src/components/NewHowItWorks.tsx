import { Target, Users, CheckCircle, ArrowRight } from "lucide-react";

const NewHowItWorks = () => {
  const steps = [
    {
      icon: <Target className="h-10 w-10" />,
      title: "Pubblica la tua ricerca",
      description: "Le aziende pubblicano le posizioni aperte dettagliando i requisiti e il budget disponibile."
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "I recruiter si attivano",
      description: "I recruiter verificati della nostra rete competono per trovare il candidato perfetto."
    },
    {
      icon: <CheckCircle className="h-10 w-10" />,
      title: "Scegli e assumi",
      description: "Ricevi le proposte migliori, scegli il candidato e procedi con l'assunzione in pochi giorni."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            Come Funziona
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Il processo è semplice e trasparente. In soli 3 passaggi puoi trovare 
            il talento che stai cercando attraverso la nostra rete di recruiter verificati.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex flex-col items-center text-center max-w-xs">
                <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block">
                  <ArrowRight className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewHowItWorks;