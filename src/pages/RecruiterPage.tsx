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
        <section className="py-32 bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <div className="space-y-8">
                <Badge className="bg-blue-100 text-blue-800 px-6 py-3 text-lg font-medium">
                  Per Recruiter
                </Badge>
                
                <div className="space-y-8">
                  <h1 className="text-7xl font-bold leading-tight">
                    <span className="text-gray-900">Più</span>{" "}
                    <span className="text-gray-900">opportunità,</span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      più guadagni
                    </span>
                    <span className="text-gray-900">,</span>
                    <br />
                    <span className="text-gray-900">più visibilità.</span>
                  </h1>
                  
                  <p className="text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                    Accedi alla rete di aziende più esclusiva d'Italia. Costruisci la tua reputazione, 
                    aumenta i tuoi ricavi e diventa il recruiter di riferimento nel tuo settore.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                  <Button 
                    onClick={handleCTAClick}
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:opacity-90 text-xl px-12 py-6"
                  >
                    Registrati come Recruiter
                  </Button>
                  <Button variant="outline" size="lg" className="text-xl px-12 py-6 border-2">
                    Scopri di più
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                  <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="text-5xl font-bold text-blue-600 mb-2">500+</div>
                    <div className="text-lg text-gray-600 font-medium">Posizioni attive</div>
                  </div>
                  <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="text-5xl font-bold text-green-600 mb-2">€25k</div>
                    <div className="text-lg text-gray-600 font-medium">Guadagno medio</div>
                  </div>
                  <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="text-5xl font-bold text-purple-600 mb-2">95%</div>
                    <div className="text-lg text-gray-600 font-medium">Tasso successo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse delay-700"></div>
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
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
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Come iniziare su Recruito
              </h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
                Tre semplici step per iniziare a guadagnare come recruiter
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                  <div className="absolute -inset-4 bg-green-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Registrati e Completa il Profilo</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Crea il tuo account, carica il CV e completa il profilo con le tue specializzazioni e competenze.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                  <div className="absolute -inset-4 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Ricevi Proposte Personalizzate</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  La nostra AI ti proporrà le posizioni più adatte al tuo profilo e alle tue competenze.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  <div className="absolute -inset-4 bg-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Chiudi e Guadagna</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
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