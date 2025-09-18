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
  Search, 
  TrendingUp, 
  Star, 
  Target, 
  Award, 
  Users,
  DollarSign,
  Eye,
  Trophy
} from "lucide-react";

const RecruiterPage = () => {
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
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                    Per Recruiter
                  </Badge>
                  <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                    Più opportunità,{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      più guadagni
                    </span>,{" "}
                    più visibilità.
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Accedi alla rete di aziende più esclusiva d'Italia. Costruisci la tua reputazione, 
                    aumenta i tuoi ricavi e diventa il recruiter di riferimento nel tuo settore.
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handleCTAClick}
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:opacity-90"
                  >
                    Registrati come Recruiter
                  </Button>
                  <Button variant="outline" size="lg">
                    Scopri di più
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">500+</div>
                    <div className="text-sm text-gray-600">Posizioni attive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">€25k</div>
                    <div className="text-sm text-gray-600">Guadagno medio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">95%</div>
                    <div className="text-sm text-gray-600">Tasso successo</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="/assets/recruiter-mockup.jpg" 
                  alt="Dashboard Recruiter" 
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
                La piattaforma che trasforma il tuo lavoro di recruiter in un business scalabile e redditizio.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-8 border-2 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Più Opportunità</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Accesso esclusivo a centinaia di posizioni aperte dalle migliori aziende italiane.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Posizioni executive e specialistiche</li>
                  <li>• Aziende pre-validate</li>
                  <li>• Brief dettagliati e completi</li>
                </ul>
              </Card>

              <Card className="p-8 border-2 hover:border-green-200 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Più Guadagni</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Fee competitive e trasparenti. Pagamenti garantiti a 30 giorni.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Fee dal 15% al 25%</li>
                  <li>• Bonus performance mensili</li>
                  <li>• Sistema di incentivi progressivi</li>
                </ul>
              </Card>

              <Card className="p-8 border-2 hover:border-purple-200 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Più Visibilità</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Costruisci la tua reputazione con il nostro sistema di ranking pubblico.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Profilo pubblico verificato</li>
                  <li>• Recensioni e rating</li>
                  <li>• Badge di specializzazione</li>
                </ul>
              </Card>

              <Card className="p-8 border-2 hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Matching Intelligente</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  AI che ti propone le posizioni più adatte al tuo profilo e competenze.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Match score personalizzato</li>
                  <li>• Notifiche in tempo reale</li>
                  <li>• Analisi predittiva successo</li>
                </ul>
              </Card>

              <Card className="p-8 border-2 hover:border-red-200 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Trophy className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Gamification</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Sistema di punti, badge e classifiche per rendere il lavoro più coinvolgente.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Livelli e achievement</li>
                  <li>• Leaderboard mensili</li>
                  <li>• Premi e riconoscimenti</li>
                </ul>
              </Card>

              <Card className="p-8 border-2 hover:border-teal-200 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <Users className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Community</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Entra a far parte della community di recruiter più esclusiva d'Italia.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Eventi networking esclusivi</li>
                  <li>• Formazione continua</li>
                  <li>• Supporto dedicato</li>
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
                Come iniziare su Recruito
              </h2>
              <p className="text-xl text-gray-600">
                Tre semplici step per iniziare a guadagnare come recruiter
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Registrati e Completa il Profilo</h3>
                <p className="text-gray-600">
                  Crea il tuo account, carica il CV e completa il profilo con le tue specializzazioni e competenze.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Ricevi Proposte Personalizzate</h3>
                <p className="text-gray-600">
                  La nostra AI ti proporrà le posizioni più adatte al tuo profilo e alle tue competenze.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Chiudi e Guadagna</h3>
                <p className="text-gray-600">
                  Presenta i candidati, chiudi le posizioni e ricevi le tue fee direttamente in piattaforma.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">
                Pronto a diventare il recruiter #1 del tuo settore?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Unisciti a centinaia di recruiter che hanno già trasformato il loro business con Recruito.
              </p>
              <Button 
                onClick={handleCTAClick}
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                Inizia ora - È gratis
              </Button>
              <p className="text-sm text-blue-100 mt-4">
                Nessun costo di setup • Prime 3 proposte gratuite • Supporto dedicato
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RecruiterPage;