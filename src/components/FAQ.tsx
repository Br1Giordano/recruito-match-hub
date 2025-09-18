import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "Come funziona il sistema di fee?",
      answer: "Paghi solo quando assumi con successo un candidato presentato tramite Recruito. La fee è del 15% del salario annuo lordo, competitiva rispetto al mercato (15-25%). Nessun costo di attivazione o abbonamento."
    },
    {
      question: "Come vengono selezionati i recruiter?",
      answer: "I recruiter passano attraverso un processo di verifica rigoroso: track record, specializzazioni, referenze e test pratici. Solo il top 1% viene accettato sulla piattaforma e il rating dinamico garantisce qualità costante."
    },
    {
      question: "Quanto tempo ci vuole per ricevere i primi candidati?",
      answer: "In media, i primi candidati qualificati vengono presentati entro 1-2 settimane dalla pubblicazione. I recruiter hanno 24-48 ore per confermare interesse e iniziare la ricerca attiva."
    },
    {
      question: "Cosa succede se non sono soddisfatto dei candidati?",
      answer: "Se i candidati non soddisfano i requisiti, puoi fornire feedback dettagliato. I recruiter dovranno adeguare la ricerca. Non paghi nulla finché non assumi il candidato giusto."
    },
    {
      question: "Posso pubblicare ricerche in esclusiva?",
      answer: "Sì, puoi scegliere tra modalità competitiva (più recruiter lavorano sulla stessa posizione) o esclusiva (un solo recruiter selezionato). L'esclusiva garantisce focus maggiore e fee leggermente ridotte."
    },
    {
      question: "Come viene garantita la qualità dei candidati?",
      answer: "I recruiter pre-selezionano i candidati con colloqui preliminari, verifiche competenze e referenze. Solo profili con match ≥80% vengono presentati. Ricevi CV anonimizzati con assessment dettagliato."
    },
    {
      question: "Cosa include il servizio per i recruiter?",
      answer: "Dashboard completa, CRM integrato, sistema di matching AI, gamification con rating, comunicazione diretta con aziende, analytics performance e supporto dedicato per massimizzare il successo."
    },
    {
      question: "Ci sono garanzie sui candidati assunti?",
      answer: "Sì, offriamo 3 mesi di garanzia. Se il candidato lascia o viene licenziato entro 90 giorni per motivi di performance, rimborsiamo il 100% della fee o forniamo sostituzione gratuita."
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Domande frequenti
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tutto quello che devi sapere per iniziare con Recruito
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-background rounded-xl border border-border overflow-hidden">
              <button
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => toggleItem(index)}
              >
                <h3 className="text-lg font-semibold text-foreground pr-4">
                  {faq.question}
                </h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-5">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Non trovi la risposta che cerchi?
          </p>
          <button className="text-primary font-medium hover:underline">
            Contatta il nostro team →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;