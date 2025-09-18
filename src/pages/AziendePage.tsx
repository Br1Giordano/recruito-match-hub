import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthPage from "@/components/auth/AuthPage";
import DashboardNavigation from "@/components/DashboardNavigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  Clock, 
  CheckCircle, 
  Shield, 
  Target, 
  TrendingDown,
  Users,
  Star,
  Zap,
  Brain
} from "lucide-react";

const AziendePage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { user, userProfile } = useAuth();

  const handleCTAClick = () => {
    if (user) {
      setShowDashboard(true);
    } else {
      setShowAuth(true);
    }
  };

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  if (showDashboard) {
    return <DashboardNavigation onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onShowAuth={() => setShowAuth(true)}
        onShowDashboard={() => setShowDashboard(true)}
      />
      
      <main>
        {/* Hero Section */}
        <section className="py-32 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <div className="space-y-8">
                <Badge className="bg-green-100 text-green-800 px-6 py-3 text-lg font-medium">
                  Per Aziende
                </Badge>
                
                <div className="space-y-8">
                  <h1 className="text-7xl font-bold leading-tight">
                    <span className="text-gray-900">Trova</span>{" "}
                    <span className="text-gray-900">i</span>{" "}
                    <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      talenti giusti
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      in meno tempo
                    </span>
                    <span className="text-gray-900">.</span>
                  </h1>
                  
                  <p className="text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                    Accedi alla rete di recruiter più qualificata d'Italia. Zero costi fissi, 
                    paghi solo a successo e riduci drasticamente i tempi di assunzione.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                  <Button 
                    onClick={handleCTAClick}
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:opacity-90 text-xl px-12 py-6"
                  >
                    Inizia a cercare talenti
                  </Button>
                  <Button variant="outline" size="lg" className="text-xl px-12 py-6 border-2">
                    Richiedi demo
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                  <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="text-5xl font-bold text-green-600 mb-2">15</div>
                    <div className="text-lg text-gray-600 font-medium">Giorni medi</div>
                  </div>
                  <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="text-5xl font-bold text-blue-600 mb-2">€0</div>
                    <div className="text-lg text-gray-600 font-medium">Costi fissi</div>
                  </div>
                  <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="text-5xl font-bold text-purple-600 mb-2">500+</div>
                    <div className="text-lg text-gray-600 font-medium">Recruiter attivi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Perché scegliere Recruito?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                La soluzione completa per le tue esigenze di recruitment, senza i costi e le complessità tradizionali.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-8 border-2 hover:border-green-200 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Time-to-Hire Ridotto</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Riduci i tempi di assunzione del 70% grazie alla nostra rete di recruiter specializzati.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Media 15 giorni vs 60 tradizionali</li>
                  <li>• Candidati pre-screened</li>
                  <li>• Process ottimizzati</li>
                </ul>
              </Card>

              <Card className="p-8 border-2 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Zero Costi Fissi</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Modello solo a successo. Paghi unicamente per le assunzioni completate.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Nessun costo di setup</li>
                  <li>• Fee competitive 15-25%</li>
                  <li>• Garanzia sostituzione 6 mesi</li>
                </ul>
              </Card>

              <Card className="p-8 border-2 hover:border-purple-200 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Recruiter Verificati</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Lavora solo con recruiter certificati e specializzati nel tuo settore.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Background verificato</li>
                  <li>• Competenze certificate</li>
                  <li>• Rating e recensioni</li>
                </ul>
              </Card>

              <Card className="p-8 border-2 hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Brain className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Powered</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Intelligenza artificiale per ottimizzare annunci e matching dei candidati.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Ottimizzazione automatica JD</li>
                  <li>• Scoring intelligente candidati</li>
                  <li>• Insights predittivi</li>
                </ul>
              </Card>

              <Card className="p-8 border-2 hover:border-red-200 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Zap className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Dashboard Completa</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Monitora tutto il processo di recruitment da un'unica piattaforma.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Tracking candidature real-time</li>
                  <li>• Analytics e reportistica</li>
                  <li>• Comunicazione integrata</li>
                </ul>
              </Card>

              <Card className="p-8 border-2 hover:border-teal-200 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Supporto Dedicato</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Team di esperti a tua disposizione per massimizzare i risultati.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Account manager dedicato</li>
                  <li>• Consulenza strategica</li>
                  <li>• Support 24/7</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Come funziona Recruito per le aziende
              </h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
                Un processo semplice e trasparente per trovare i migliori talenti
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                  <div className="absolute -inset-3 bg-green-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Pubblica l'Annuncio</h3>
                <p className="text-gray-600 leading-relaxed">
                  Crea il job posting con l'aiuto della nostra AI per massimizzare la visibilità.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                  <div className="absolute -inset-3 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Ricevi Proposte</h3>
                <p className="text-gray-600 leading-relaxed">
                  I recruiter specializzati nel tuo settore si proporranno per lavorare sulla posizione.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  <div className="absolute -inset-3 bg-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Seleziona i Candidati</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ricevi candidati pre-screened e valuta i profili direttamente in piattaforma.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    4
                  </div>
                  <div className="absolute -inset-3 bg-orange-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Assumi e Paga</h3>
                <p className="text-gray-600 leading-relaxed">
                  Finalizza l'assunzione e paga la fee solo a successo completato.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Aziende che si fidano di noi
              </h2>
              <p className="text-xl text-gray-600">
                Da startup innovative a grandi corporate, tutti scelgono Recruito
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "Recruito ha ridotto i nostri tempi di assunzione del 60%. La qualità dei candidati è eccezionale."
                </p>
                <div className="font-semibold">Marco Rossi</div>
                <div className="text-sm text-gray-500">HR Director, TechCorp</div>
              </Card>

              <Card className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "Finalmente una piattaforma che funziona davvero. Zero sprechi, solo risultati concreti."
                </p>
                <div className="font-semibold">Laura Bianchi</div>
                <div className="text-sm text-gray-500">CEO, StartupXYZ</div>
              </Card>

              <Card className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "I recruiter su Recruito sono di un livello completamente diverso. Professionalità al top."
                </p>
                <div className="font-semibold">Giuseppe Verdi</div>
                <div className="text-sm text-gray-500">Head of Talent, BigCorp</div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">
                Pronto a trovare i migliori talenti in tempo record?
              </h2>
              <p className="text-xl text-green-100 mb-8">
                Unisciti a centinaia di aziende che hanno già rivoluzionato il loro recruitment con Recruito.
              </p>
              <Button 
                onClick={handleCTAClick}
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                Pubblica il primo annuncio
              </Button>
              <p className="text-sm text-green-100 mt-4">
                Setup gratuito • Prima posizione gratis • Supporto dedicato incluso
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AziendePage;