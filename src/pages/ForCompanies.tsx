import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Building, Clock, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandedGradient from "@/components/ui/animated/BrandedGradient";

const ForCompanies = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/auth');
  };

  const benefits = [
    {
      icon: <Building className="h-8 w-8" />,
      title: "Recruiter Qualificati",
      description: "Accedi a una rete di recruiter professionali verificati e specializzati"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Tempi Ridotti",
      description: "Riduci drasticamente i tempi di assunzione con processi ottimizzati"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Processo Sicuro",
      description: "Piattaforma sicura e conforme alle normative con massima protezione dati"
    }
  ];

  const features = [
    "Pubblicazione semplificata delle offerte di lavoro",
    "Sistema di valutazione e recensioni dei recruiter",
    "Gestione centralizzata di tutte le candidature",
    "Report dettagliati sui processi di selezione",
    "Supporto dedicato per le aziende",
    "Strumenti di comunicazione integrati e sicuri"
  ];

  return (
    <div className="min-h-screen relative">
      <BrandedGradient />
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-foreground">Trova i talenti giusti</span>
                <br />
                <span className="bg-gradient-to-r from-[hsl(var(--primary-start))] to-[hsl(var(--primary-end))] bg-clip-text text-transparent">in meno tempo.</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Semplifica il processo di recruiting della tua azienda. 
              Accedi ai migliori talenti attraverso la nostra rete di recruiter qualificati.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-10 py-4 h-14 shadow-lg hover:shadow-xl transition-all duration-300" 
              onClick={handleRegisterClick}
            >
              Inizia Ora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Vantaggi per la Tua Azienda
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm h-full">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary transition-transform duration-300 hover:scale-110">
                        {benefit.icon}
                      </div>
                      <CardTitle className="text-xl mb-3">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <CardDescription className="text-center text-base leading-relaxed">
                        {benefit.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                  Soluzioni per le Aziende
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary/5 transition-colors duration-200">
                      <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground text-base leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Card className="border-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 md:p-12 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-3xl md:text-4xl mb-6 leading-tight">
                    Trova i Recruiter Giusti per la Tua Azienda
                  </CardTitle>
                  <CardDescription className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                    Unisciti alle aziende che hanno già ottimizzato il loro processo di recruiting.
                    Inizia oggi e accelera le tue assunzioni.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    size="lg" 
                    className="text-lg px-10 py-4 h-14 shadow-lg hover:shadow-xl transition-all duration-300" 
                    onClick={handleRegisterClick}
                  >
                    Registra la Tua Azienda
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ForCompanies;