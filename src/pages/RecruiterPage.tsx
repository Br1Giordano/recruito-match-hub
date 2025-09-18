import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Award, Target } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BrandedGradient from "@/components/ui/animated/BrandedGradient";

const RecruiterPage = () => {
  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Più Opportunità",
      description: "Accedi a centinaia di posizioni aperte da aziende verificate"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Marginalità Migliori",
      description: "Fee competitive e trasparenti per ogni placement riuscito"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Ranking Pubblico",
      description: "Costruisci la tua reputazione con recensioni e classifiche"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Gamification",
      description: "Sblocca badge e obiettivi per crescere professionalmente"
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
            Più opportunità,<br />
            <span className="text-gradient">più guadagni</span>,<br />
            più visibilità.
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Unisciti alla rete di recruiter freelance più qualificata d'Italia. 
            Lavora con le migliori aziende e costruisci la tua reputazione.
          </p>
          <Button size="lg" className="mb-8">
            Registrati come Recruiter
          </Button>
          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Registrazione gratuita</span>
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Verifiche incluse</span>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perché Scegliere Recruito?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La piattaforma che ti aiuta a crescere come recruiter professionista
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
              La Tua Dashboard Personale
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gestisci le tue candidature, monitora i progressi e sblocca nuovi obiettivi
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-startup border-0">
              <CardContent className="p-0">
                <img 
                  src="/assets/recruiter-dashboard.png" 
                  alt="Dashboard Recruiter" 
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">Obiettivi</Badge>
              <h3 className="text-lg font-semibold mb-2">Raggiungi Traguardi</h3>
              <p className="text-muted-foreground">Completa obiettivi mensili e sblocca bonus esclusivi</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">Badge</Badge>
              <h3 className="text-lg font-semibold mb-2">Colleziona Riconoscimenti</h3>
              <p className="text-muted-foreground">Guadagna badge per le tue competenze e successi</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">Ranking</Badge>
              <h3 className="text-lg font-semibold mb-2">Scala la Classifica</h3>
              <p className="text-muted-foreground">Migliora il tuo ranking e ottieni più visibilità</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto a Iniziare?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Unisciti a centinaia di recruiter che hanno già scelto Recruito per far crescere il loro business.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
            Registrati Ora - È Gratis
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RecruiterPage;