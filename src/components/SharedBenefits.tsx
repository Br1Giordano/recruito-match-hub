import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Target, TrendingUp } from "lucide-react";

const SharedBenefits = () => {
  const benefits = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Tempo Ridotto",
      description: "Processi di hiring 3x più veloci rispetto ai metodi tradizionali"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Fee Trasparenti",
      description: "Costi chiari e competitivi, nessuna sorpresa o costo nascosto"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Profili Più Adatti",
      description: "Matching intelligente tra competenze richieste e candidate"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Qualità Verificata",
      description: "Tutti i recruiter sono controllati e valutati dalla community"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Perché Scegliere Recruito
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Vantaggi concreti per aziende e recruiter. Una piattaforma pensata 
            per massimizzare i risultati di entrambe le parti.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-0 shadow-startup hover-startup">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full gradient-primary text-white mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SharedBenefits;