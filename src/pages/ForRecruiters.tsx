import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Users, Target, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandedGradient from "@/components/ui/animated/BrandedGradient";

const ForRecruiters = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/auth');
  };

  const benefits = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Accesso a Top Talent",
      description: "Connettiti con i migliori professionisti del settore e costruisci la tua rete"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Matching Intelligente",
      description: "Algoritmi avanzati per trovare i candidati perfetti per ogni posizione"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Cresci Professionalmente",
      description: "Sviluppa la tua carriera e aumenta le tue performance con strumenti dedicati"
    }
  ];

  const features = [
    "Dashboard personalizzata per gestire tutte le tue ricerche",
    "Sistema di notifiche in tempo reale per non perdere opportunità",
    "Analytics dettagliate sulle tue performance e risultati",
    "Strumenti di comunicazione integrati con aziende e candidati",
    "Supporto dedicato e formazione continua per recruiter",
    "Sistema di valutazione e badge per crescere nella community"
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
                <span className="text-foreground">Più opportunità,</span>
                <br />
                <span className="bg-gradient-to-r from-[hsl(var(--primary-start))] to-[hsl(var(--primary-end))] bg-clip-text text-transparent">più guadagni,</span>
                <br />
                <span className="text-foreground">più visibilità.</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Trasforma il tuo modo di fare recruiting. Accedi a una piattaforma innovativa 
              che ti permette di trovare i candidati migliori in modo più efficiente.
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
                Perché Scegliere la Nostra Piattaforma
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
                  Funzionalità Dedicate
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
                    Pronto a Rivoluzionare il Tuo Recruiting?
                  </CardTitle>
                  <CardDescription className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                    Unisciti alla community di recruiter che stanno già ottenendo risultati straordinari.
                    Inizia oggi e trasforma la tua carriera.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    size="lg" 
                    className="text-lg px-10 py-4 h-14 shadow-lg hover:shadow-xl transition-all duration-300" 
                    onClick={handleRegisterClick}
                  >
                    Registrati Come Recruiter
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

export default ForRecruiters;