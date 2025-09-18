import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Shield, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BrandedGradient from "@/components/ui/animated/BrandedGradient";

const AziendePage = () => {
  const benefits = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Recruiter Verificati",
      description: "Accedi a una rete di professionisti controllati e qualificati"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Zero Costi Fissi",
      description: "Paghi solo a successo, nessun costo anticipato o abbonamento"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Time-to-Hire Ridotto",
      description: "Trova i candidati giusti 3x più velocemente del normale"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI per Annunci",
      description: "Scrivi job description efficaci con l'assistente intelligente"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <BrandedGradient />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Trova i talenti giusti<br />
            <span className="text-gradient">in meno tempo</span>.
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Connettiti con i migliori recruiter freelance d'Italia. 
            Assumi più velocemente, spendi solo a successo.
          </p>
          <Button size="lg" className="mb-8">
            Inizia a Cercare Talenti
          </Button>
          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Setup gratuito</span>
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Solo costi a successo</span>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perché le Aziende Scelgono Recruito?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La soluzione completa per le tue esigenze di recruiting
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-startup hover-startup">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full gradient-primary text-white mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              La Tua Dashboard Aziendale
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gestisci offerte di lavoro, valuta proposte e monitora i recruiter
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-startup border-0">
              <CardContent className="p-0">
                <img 
                  src="/assets/company-dashboard.png" 
                  alt="Dashboard Azienda" 
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">Proposte</Badge>
              <h3 className="text-lg font-semibold mb-2">Ricevi Candidature</h3>
              <p className="text-muted-foreground">Visualizza e valuta le proposte dei migliori recruiter</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">Classifica</Badge>
              <h3 className="text-lg font-semibold mb-2">Scegli i Migliori</h3>
              <p className="text-muted-foreground">Consulta il ranking e le recensioni dei recruiter</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">Analytics</Badge>
              <h3 className="text-lg font-semibold mb-2">Monitora i Progressi</h3>
              <p className="text-muted-foreground">Analizza performance e tempo di hiring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prezzi Trasparenti
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Nessun costo fisso, paghi solo quando assumi con successo
            </p>
            
            <Card className="border-0 shadow-startup overflow-hidden">
              <CardContent className="p-8 gradient-primary text-white">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Solo a Successo</h3>
                  <div className="text-4xl font-bold mb-2">15-20%</div>
                  <p className="text-white/90 mb-6">del salario annuo lordo</p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span>Nessun costo di setup o abbonamento</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span>Fee competitive e trasparenti</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span>Garanzia di sostituzione inclusa</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span>Supporto dedicato incluso</span>
                    </li>
                  </ul>
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                    Inizia Subito
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto ad Assumere?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Migliaia di aziende hanno già trovato i loro talenti con Recruito. Unisciti a loro oggi stesso.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
            Pubblica la Prima Offerta
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AziendePage;