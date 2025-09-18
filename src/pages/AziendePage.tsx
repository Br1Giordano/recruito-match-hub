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
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <Badge className="bg-green-100 text-green-800 px-4 py-2">
                    Per Aziende
                  </Badge>
                  <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                    Trova i{" "}
                    <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      talenti giusti
                    </span>{" "}
                    in meno tempo.
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Accedi alla rete di recruiter più qualificata d'Italia. Zero costi fissi, 
                    paghi solo a successo e riduci drasticamente i tempi di assunzione.
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handleCTAClick}
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:opacity-90"
                  >
                    Inizia a cercare talenti
                  </Button>
                  <Button variant="outline" size="lg">
                    Richiedi demo
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">15</div>
                    <div className="text-sm text-gray-600">Giorni medi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">€0</div>
                    <div className="text-sm text-gray-600">Costi fissi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">500+</div>
                    <div className="text-sm text-gray-600">Recruiter attivi</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="/assets/company-mockup.jpg" 
                  alt="Dashboard Azienda" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
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
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Come funziona Recruito per le aziende
              </h2>
              <p className="text-xl text-gray-600">
                Un processo semplice e trasparente per trovare i migliori talenti
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Pubblica l'Annuncio</h3>
                <p className="text-gray-600">
                  Crea il job posting con l'aiuto della nostra AI per massimizzare la visibilità.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Ricevi Proposte</h3>
                <p className="text-gray-600">
                  I recruiter specializzati nel tuo settore si proporranno per lavorare sulla posizione.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Seleziona i Candidati</h3>
                <p className="text-gray-600">
                  Ricevi candidati pre-screened e valuta i profili direttamente in piattaforma.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-4">Assumi e Paga</h3>
                <p className="text-gray-600">
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