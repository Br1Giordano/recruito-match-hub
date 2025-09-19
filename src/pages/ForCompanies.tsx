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
              <span className="text-foreground">Trova i talenti giusti</span>
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

        {/* Before/After Comparison Section */}
        <div className="bg-card/50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Prima e dopo <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Recruito</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Senza Recruito */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-red-600">Senza Recruito</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Tempi lunghi</p>
                    <p className="text-sm text-muted-foreground">3-6 mesi per trovare il candidato giusto</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-red-500 mt-1 flex-shrink-0 flex items-center justify-center text-sm font-bold">€</div>
                  <div>
                    <p className="font-medium text-foreground">Costi elevati</p>
                    <p className="text-sm text-muted-foreground">Fee elevate + costi fissi e anticipi</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-red-500 mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-foreground">Qualità incerta</p>
                    <p className="text-sm text-muted-foreground">Profili generici senza pre-selezione accurata</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Con Recruito */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-green-600">Con Recruito</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 mt-1 flex-shrink-0 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Velocità garantita</p>
                    <p className="text-sm text-muted-foreground">Prime proposte entro una settimana</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-green-500 mt-1 flex-shrink-0 flex items-center justify-center text-sm font-bold">€</div>
                  <div>
                    <p className="font-medium text-foreground">Solo a successo</p>
                    <p className="text-sm text-muted-foreground">Paghi solo se assumi il candidato</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 mt-1 flex-shrink-0 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Qualità certificata</p>
                    <p className="text-sm text-muted-foreground">Recruiter specializzati e profili pre-qualificati</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-card/50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
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
              <CardTitle className="text-2xl mb-4">
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