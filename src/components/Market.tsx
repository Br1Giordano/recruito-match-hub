import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users2, TrendingUp, Target } from "lucide-react";

const Market = () => {
  return (
    <section id="mercato" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Un mercato da <span className="text-gradient">€2.5 miliardi</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Il recruiting in Italia è frammentato e inefficiente. Noi lo stiamo rivoluzionando.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-recruito-blue" />
                <span>Chi ha bisogno del prodotto?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">PMI in crescita</h4>
                <p className="text-gray-600">
                  Aziende nei settori tech, digital, ingegneria e commerciale che necessitano 
                  di profili qualificati senza i costi delle agenzie tradizionali.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recruiter freelance</h4>
                <p className="text-gray-600">
                  Professionisti qualificati che vogliono accedere a richieste strutturate 
                  senza dover gestire marketing e contratti.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Tech</Badge>
                <Badge variant="secondary">Digital</Badge>
                <Badge variant="secondary">Engineering</Badge>
                <Badge variant="secondary">Sales</Badge>
                <Badge variant="secondary">Export</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-recruito-green" />
                <span>Perché è un buon mercato?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-recruito-blue rounded-full mt-2"></div>
                <p className="text-gray-600">
                  <strong>Mercato ampio:</strong> Il recruiting è ricorrente e strutturalmente inefficiente
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-recruito-teal rounded-full mt-2"></div>
                <p className="text-gray-600">
                  <strong>Poco digitalizzato:</strong> Nessuna piattaforma ha standardizzato l'incontro
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-recruito-green rounded-full mt-2"></div>
                <p className="text-gray-600">
                  <strong>Scalabile:</strong> Modello asset-light con margini progressivi
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              La nostra differenziazione
            </h3>
            <p className="text-gray-600">
              Prima piattaforma italiana che connette aziende con recruiter freelance qualificati
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-recruito-blue mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Velocità</h4>
              <p className="text-sm text-gray-600">Proposte da più recruiter in parallelo</p>
            </div>
            <div className="text-center">
              <Users2 className="h-12 w-12 text-recruito-teal mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Qualità</h4>
              <p className="text-sm text-gray-600">Rating continuo dei recruiter</p>
            </div>
            <div className="text-center">
              <Building2 className="h-12 w-12 text-recruito-green mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Trasparenza</h4>
              <p className="text-sm text-gray-600">Processo completamente digitale</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-recruito-blue mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Efficienza</h4>
              <p className="text-sm text-gray-600">Solo fee di successo del 15%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Market;
