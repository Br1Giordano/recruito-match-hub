import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, CheckCircle } from "lucide-react";

const NewHowItWorks = () => {
  const steps = [
    {
      step: "01",
      icon: <Briefcase className="h-8 w-8" />,
      title: "L'Azienda Pubblica",
      description: "Crea un annuncio di lavoro dettagliato con requisiti specifici e budget trasparente.",
      color: "bg-blue-500"
    },
    {
      step: "02", 
      icon: <Users className="h-8 w-8" />,
      title: "I Recruiter si Attivano",
      description: "I migliori recruiter della rete valutano l'opportunità e inviano le loro proposte.",
      color: "bg-purple-500"
    },
    {
      step: "03",
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Il Candidato viene Selezionato",
      description: "L'azienda sceglie il recruiter e il candidato perfetto per la posizione.",
      color: "bg-green-500"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Come Funziona</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            3 Semplici Passi
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Il processo ottimizzato che connette aziende e recruiter in modo efficace
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="border-0 shadow-startup hover-startup relative">
              <CardContent className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.color} text-white mb-6 mt-4`}>
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewHowItWorks;