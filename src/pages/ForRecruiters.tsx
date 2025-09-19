import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Users, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForRecruiters = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/auth');
  };
  const benefits = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Accesso a Top Talent",
      description: "Connettiti con i migliori professionisti del settore"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Matching Intelligente",
      description: "Algoritmi avanzati per trovare i candidati perfetti"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Cresci Professionalmente",
      description: "Sviluppa la tua rete e aumenta le tue performance"
    }
  ];

  const features = [
    "Dashboard personalizzata per gestire tutte le tue ricerche",
    "Sistema di notifiche in tempo reale",
    "Analytics dettagliate sulle tue performance",
    "Strumenti di comunicazione integrati",
    "Supporto dedicato per recruiter"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-4xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">Più opportunità,</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">più guadagni,</span>
              <br />
              <span className="bg-gradient-to-r from-primary/70 to-foreground bg-clip-text text-transparent">più visibilità.</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Trasforma il tuo modo di fare recruiting. Accedi a una piattaforma innovativa 
            che ti permette di trovare i candidati migliori in modo più efficiente.
          </p>
          <Button size="lg" className="text-lg px-8 py-3" onClick={handleRegisterClick}>
            Inizia Ora
          </Button>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                  {benefit.icon}
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-card/50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Funzionalità Dedicate
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-0 bg-gradient-to-r from-primary/10 to-primary/5 p-8">
            <CardHeader>
              <CardTitle className="text-2xl mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Pronto a Rivoluzionare il Tuo Recruiting?
              </CardTitle>
              <CardDescription className="text-lg mb-6">
                Unisciti alla community di recruiter che stanno già ottenendo risultati straordinari.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="text-lg px-8 py-3" onClick={handleRegisterClick}>
                Registrati Come Recruiter
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForRecruiters;