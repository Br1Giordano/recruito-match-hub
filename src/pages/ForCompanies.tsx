import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Building, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForCompanies = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/auth');
  };
  const benefits = [
    {
      icon: <Building className="h-6 w-6" />,
      title: "Recruiter Qualificati",
      description: "Accedi a una rete di recruiter professionali verificati"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Tempi Ridotti",
      description: "Riduci drasticamente i tempi di assunzione"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Processo Sicuro",
      description: "Piattaforma sicura e conforme alle normative"
    }
  ];

  const features = [
    "Pubblicazione semplificata delle offerte di lavoro",
    "Sistema di valutazione dei recruiter",
    "Gestione centralizzata di tutte le candidature",
    "Report dettagliati sui processi di selezione",
    "Supporto dedicato per le aziende"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-4xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">Trova i talenti giusti</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">in meno tempo.</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Semplifica il processo di recruiting della tua azienda. 
            Accedi ai migliori talenti attraverso la nostra rete di recruiter qualificati.
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
            Soluzioni per le Aziende
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
                Trova i Recruiter Giusti per la Tua Azienda
              </CardTitle>
              <CardDescription className="text-lg mb-6">
                Unisciti alle aziende che hanno già ottimizzato il loro processo di recruiting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="text-lg px-8 py-3" onClick={handleRegisterClick}>
                Registra la Tua Azienda
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForCompanies;