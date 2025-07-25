
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Users, ArrowRight, ArrowDown, Sparkles, UserPlus } from "lucide-react";

const BusinessModel = () => {
  const scrollToDemo = () => {
    console.log('scrollToDemo called from BusinessModel - looking for demo section');
    
    // Try multiple selectors to find the demo section
    let demoElement = document.querySelector('[data-demo-section]');
    
    if (!demoElement) {
      console.log('data-demo-section not found, trying #demo');
      demoElement = document.getElementById('demo');
    }
    
    if (!demoElement) {
      console.log('#demo not found, trying .demo-section');
      demoElement = document.querySelector('.demo-section');
    }
    
    if (demoElement) {
      console.log('Demo section found, scrolling...', demoElement);
      demoElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.error('Demo section not found with any selector');
      // Fallback: scroll to a reasonable position
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="business" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Business Model <span className="text-gradient">Scalabile</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un modello sostenibile che cresce con il successo dei nostri clienti
          </p>
        </div>

        {/* Revenue Example Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Esempio con RAL €40k
          </h3>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl mb-6">
              <span className="text-lg font-semibold text-gray-900">RAL Candidato</span>
              <span className="text-2xl font-bold text-gray-900">€40.000</span>
            </div>

            <div className="flex justify-center mb-6">
              <ArrowDown className="h-8 w-8 text-gray-400" />
            </div>

            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Success Fee (15%)</span>
                <span className="text-2xl font-bold text-blue-600">€6.000</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-6 rounded-xl text-center">
                <div className="text-sm text-gray-600 mb-2">Al Recruiter (70%)</div>
                <div className="text-2xl font-bold text-green-600">€4.200</div>
              </div>
              <div className="bg-teal-50 p-6 rounded-xl text-center">
                <div className="text-sm text-gray-600 mb-2">A Recruito (30%)</div>
                <div className="text-2xl font-bold text-teal-600">€1.800</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <DollarSign className="h-8 w-8 text-recruito-green" />
                <span>Revenue Model</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-gray-900">15%</div>
              <p className="text-gray-600">
                della RAL annuale, trattenuta dalla success fee pagata dalle aziende 
                solo a assunzione completata. Il 70% va direttamente al recruiter.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Esempio:</strong> Su una RAL di €50.000, l'azienda paga €7.500<br/>
                  • Recruiter riceve: €5.250 (70%)<br/>
                  • Recruito trattiene: €2.250 (30%)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-recruito-blue" />
                <span>Scalabilità</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-gray-900">Asset-Light</div>
              <p className="text-gray-600">
                Modello completamente digitale senza costi fissi per le aziende. 
                Margini crescenti con i volumi.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Network effect bilaterale</li>
                <li>• Costi marginali decrescenti</li>
                <li>• Scalabilità geografica rapida</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-recruito-teal" />
                <span>Growth Strategy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-gray-900">Go-to-Market</div>
              <p className="text-gray-600">
                Strategia di crescita focalizzata su qualità del servizio 
                e network effect organico.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Partner recruiter selezionati</li>
                <li>• PMI tech e digital first</li>
                <li>• Espansione per referral</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Pronto a rivoluzionare il tuo recruiting?
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Unisciti alle PMI che stanno già assumendo più velocemente e 
                spendendo meno con Recruito.
              </p>
              <div className="flex flex-col gap-4">
                {/* Elemento grafico principale che collega alla demo */}
                <div 
                  onClick={scrollToDemo}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover-lift cursor-pointer group transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 gradient-recruito rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-recruito-blue transition-colors">Inizia come Azienda</h4>
                      <p className="text-gray-600">Prova subito la demo completa</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-recruito-blue group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Demo disponibile ora</span>
                  </div>
                </div>
                
                {/* Elemento grafico per Partner Recruiter collegato alla demo */}
                <div 
                  onClick={scrollToDemo}
                  className="bg-gradient-to-br from-recruito-teal/10 to-recruito-green/10 rounded-2xl p-6 shadow-lg border border-recruito-teal/20 hover-lift cursor-pointer group transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-recruito-teal to-recruito-green rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserPlus className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-recruito-teal transition-colors">Diventa Partner Recruiter</h4>
                      <p className="text-gray-600">Guadagna con le tue competenze</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-recruito-teal group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-recruito-teal rounded-full animate-pulse"></div>
                    <span>Accedi alla beta demo</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Setup in 5 minuti</h4>
                  <p className="text-gray-600 text-sm">Pubblica la tua prima ricerca oggi stesso</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Prime proposte in 24h</h4>
                  <p className="text-gray-600 text-sm">I recruiter iniziano subito a lavorare</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Paghi solo a successo</h4>
                  <p className="text-gray-600 text-sm">Zero rischi, massimo risultato</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModel;
