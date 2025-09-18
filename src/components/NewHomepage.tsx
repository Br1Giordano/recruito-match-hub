import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Building2, 
  CheckCircle, 
  Clock, 
  Target, 
  Star,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";

interface NewHomepageProps {
  onShowAuth: () => void;
  onShowDashboard: () => void;
}

const NewHomepage = ({ onShowAuth, onShowDashboard }: NewHomepageProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCompanyClick = () => {
    navigate('/aziende');
  };

  const handleRecruiterClick = () => {
    navigate('/recruiter');
  };

  const handleCTAClick = () => {
    if (user) {
      onShowDashboard();
    } else {
      onShowAuth();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-lg">
              La piattaforma di recruitment che funziona
            </Badge>
            
            <h1 className="text-6xl font-bold text-gray-900 leading-tight">
              Trova i{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                migliori recruiter
              </span>,{" "}
              oggi.
            </h1>
            
            <p className="text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              La prima piattaforma italiana che connette aziende e recruiter di qualità. 
              Zero costi fissi, solo risultati garantiti.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button 
                onClick={handleCompanyClick}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:opacity-90 text-lg px-8 py-4"
              >
                <Building2 className="mr-2 h-5 w-5" />
                Sono un'Azienda
              </Button>
              <Button 
                onClick={handleRecruiterClick}
                variant="outline" 
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
              >
                <Users className="mr-2 h-5 w-5" />
                Sono un Recruiter
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Recruiter verificati</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">15</div>
                <div className="text-gray-600">Giorni medi di hiring</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-gray-600">Tasso di successo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Come Funziona */}
      <section id="come-funziona" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Come funziona Recruito
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un processo semplice e trasparente per connettere le migliori aziende con i recruiter più qualificati
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4">Pubblica o Candidati</h3>
              <p className="text-gray-600 text-lg">
                Le aziende pubblicano le posizioni aperte, i recruiter si candidano per lavorarci.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4">Match Intelligente</h3>
              <p className="text-gray-600 text-lg">
                La nostra AI crea il match perfetto tra competenze del recruiter e esigenze dell'azienda.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4">Risultati Garantiti</h3>
              <p className="text-gray-600 text-lg">
                Pagamenti solo a successo. Recruiter motivati, aziende soddisfatte, candidati di qualità.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vantaggi Condivisi */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perché scegliere Recruito
            </h2>
            <p className="text-xl text-gray-600">
              I vantaggi che rendono Recruito la scelta numero uno per aziende e recruiter
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Qualità Garantita</h3>
              </div>
              <p className="text-gray-600">
                Tutti i recruiter sono verificati e certificati. Solo professionisti con track record comprovato.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Solo a Successo</h3>
              </div>
              <p className="text-gray-600">
                Zero costi fissi, paghi solo per i risultati. Modello win-win che incentiva la performance.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Risultati Rapidi</h3>
              </div>
              <p className="text-gray-600">
                Time-to-hire ridotto del 70%. I nostri recruiter lavorano in modalità sprint per risultati veloci.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold">AI Powered</h3>
              </div>
              <p className="text-gray-600">
                Algoritmi avanzati per il matching perfetto e ottimizzazione continua delle performance.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-teal-200 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold">Crescita Continua</h3>
              </div>
              <p className="text-gray-600">
                Sistema di gamification e ranking che premia l'eccellenza e stimola il miglioramento continuo.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-pink-200 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Target className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold">Trasparenza Totale</h3>
              </div>
              <p className="text-gray-600">
                Tracking completo del processo, comunicazione in tempo reale e reportistica dettagliata.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Vedi Recruito in azione
            </h2>
            <p className="text-xl text-gray-600">
              Scopri come aziende e recruiter stanno già utilizzando la nostra piattaforma
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Per le Aziende
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Dashboard completa per gestire tutte le posizioni</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">AI assistant per ottimizzare gli annunci</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Sistema di ranking dei recruiter</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Analytics e reportistica avanzata</span>
                </div>
              </div>
              <Button 
                onClick={handleCompanyClick}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white"
              >
                Scopri per le Aziende
              </Button>
            </div>
            
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Per i Recruiter
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Accesso a posizioni esclusive e ben remunerate</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Sistema di gamification e badge</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Profilo pubblico e sistema di rating</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Tools avanzati per la gestione candidati</span>
                </div>
              </div>
              <Button 
                onClick={handleRecruiterClick}
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Scopri per i Recruiter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cosa dicono di noi
            </h2>
            <p className="text-xl text-gray-600">
              Testimonianze reali da aziende e recruiter che usano Recruito
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="flex justify-center mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "Finalmente una piattaforma che funziona davvero. I tempi si sono ridotti drasticamente e la qualità è eccezionale."
              </p>
              <div className="font-semibold">Marco Rossi</div>
              <div className="text-sm text-gray-500">HR Director, TechCorp</div>
              <Badge className="mt-2 bg-blue-100 text-blue-800">Azienda</Badge>
            </Card>

            <Card className="p-8 text-center">
              <div className="flex justify-center mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "Come recruiter, Recruito mi ha aperto un mondo di opportunità. Le posizioni sono di qualità e ben remunerate."
              </p>
              <div className="font-semibold">Laura Bianchi</div>
              <div className="text-sm text-gray-500">Senior Recruiter</div>
              <Badge className="mt-2 bg-green-100 text-green-800">Recruiter</Badge>
            </Card>

            <Card className="p-8 text-center">
              <div className="flex justify-center mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "Il sistema di matching è incredibile. Ogni proposta che ricevo è perfettamente in linea con le mie competenze."
              </p>
              <div className="font-semibold">Giuseppe Verdi</div>
              <div className="text-sm text-gray-500">Head Hunter</div>
              <Badge className="mt-2 bg-green-100 text-green-800">Recruiter</Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Finale */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6">
              Pronto a rivoluzionare il tuo recruitment?
            </h2>
            <p className="text-2xl text-blue-100 mb-10">
              Unisciti a centinaia di aziende e recruiter che hanno già scelto Recruito
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={handleCompanyClick}
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                <Building2 className="mr-2 h-5 w-5" />
                Inizia come Azienda
              </Button>
              <Button 
                onClick={handleRecruiterClick}
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
              >
                <Users className="mr-2 h-5 w-5" />
                Unisciti come Recruiter
              </Button>
            </div>
            
            <p className="text-blue-100 mt-8 text-lg">
              Setup gratuito • Nessun costo fisso • Supporto dedicato incluso
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewHomepage;