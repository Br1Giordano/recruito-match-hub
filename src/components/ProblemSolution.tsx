
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, DollarSign, TrendingUp } from "lucide-react";

const ProblemSolution = () => {
  return (
    <section id="problema" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Problem Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Il problema che risolviamo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Le aziende italiane sono bloccate da processi di recruiting costosi, lenti e inefficaci
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="hover-lift">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Tempi Lunghi</h3>
              <p className="text-gray-600">
                I processi tradizionali richiedono mesi per trovare il candidato giusto, 
                bloccando la crescita aziendale.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-8 text-center">
              <DollarSign className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Costi Elevati</h3>
              <p className="text-gray-600">
                Le agenzie tradizionali hanno fee del 18-20% con costi fissi 
                che molte aziende non possono sostenere.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-8 text-center">
              <Clock className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Scarsa Qualità</h3>
              <p className="text-gray-600">
                I portali generano sovraccarico informativo senza garantire 
                la qualità dei profili proposti.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Solution Section */}
        <div id="soluzione" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            La nostra <span className="text-gradient">soluzione</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una piattaforma che connette aziende e recruiter freelance qualificati per un recruiting efficace e trasparente
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover-lift bg-white">
            <CardContent className="p-8">
              <CheckCircle className="h-12 w-12 text-recruito-green mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recruiter Selezionati</h3>
              <p className="text-gray-600">
                Solo professionisti verificati e valutati attraverso un sistema di rating continuo 
                che premia l'efficacia.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-white">
            <CardContent className="p-8">
              <TrendingUp className="h-12 w-12 text-recruito-blue mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Processo Digitale</h3>
              <p className="text-gray-600">
                Tutto online: dalla pubblicazione della ricerca alla selezione del candidato, 
                con trasparenza totale.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-white">
            <CardContent className="p-8">
              <DollarSign className="h-12 w-12 text-recruito-teal mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Solo a Successo</h3>
              <p className="text-gray-600">
                Fee del 15% della RAL pagata solo quando l'assunzione va a buon fine. 
                Zero costi fissi o anticipi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
