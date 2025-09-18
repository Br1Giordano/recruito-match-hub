import { Monitor, Smartphone, Eye, BarChart3, Users, MessageSquare } from "lucide-react";

const Mockups = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            <span className="text-gradient">Dashboard</span> intuitive e moderne
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Interfacce progettate per massimizzare produttività ed esperienza utente.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Company Dashboard Mockup */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                  <Monitor className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Dashboard Aziende</h3>
              </div>
              <p className="text-muted-foreground">
                Gestisci tutte le tue ricerche, monitora i progressi e comunica con i recruiter in un'unica interfaccia.
              </p>
            </div>

            {/* Mockup Card */}
            <div className="bg-background rounded-2xl shadow-lg p-6 border border-border">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h4 className="font-semibold text-foreground">Le tue ricerche attive</h4>
                  <div className="text-sm text-muted-foreground">3 posizioni aperte</div>
                </div>

                {/* Job Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">Senior Frontend Developer</div>
                      <div className="text-sm text-muted-foreground">Milano • 50-70k</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">5 candidati</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">Product Manager</div>
                      <div className="text-sm text-muted-foreground">Roma • 60-80k</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-orange-600 font-medium">In ricerca</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">DevOps Engineer</div>
                      <div className="text-sm text-muted-foreground">Firenze • 55-75k</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-blue-600 font-medium">2 proposte</span>
                    </div>
                  </div>
                </div>

                {/* Features Icons */}
                <div className="flex items-center justify-around pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>Tracciamento</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>Messaggi</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recruiter Dashboard Mockup */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Dashboard Recruiter</h3>
              </div>
              <p className="text-muted-foreground">
                Visualizza opportunità, gestisci candidati e monitora le tue performance con sistema di gamification.
              </p>
            </div>

            {/* Mockup Card */}
            <div className="bg-background rounded-2xl shadow-lg p-6 border border-border">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h4 className="font-semibold text-foreground">Le tue opportunità</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">★</span>
                    </div>
                    <span className="text-sm font-medium text-gradient">Rating: 4.8</span>
                  </div>
                </div>

                {/* Opportunity Cards */}
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-foreground">Data Scientist</div>
                      <div className="text-sm font-medium text-green-600">Urgente</div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">Milano • Fintech • 70-90k</div>
                    <div className="text-xs text-green-600 font-medium">Fee: €12.000 • Match: 95%</div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-foreground">UX Designer</div>
                      <div className="text-sm font-medium text-blue-600">Attiva</div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">Roma • E-commerce • 45-60k</div>
                    <div className="text-xs text-blue-600 font-medium">Fee: €8.000 • Match: 88%</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gradient">15</div>
                    <div className="text-xs text-muted-foreground">Posizioni chiuse</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gradient">€180k</div>
                    <div className="text-xs text-muted-foreground">Guadagni totali</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gradient">96%</div>
                    <div className="text-xs text-muted-foreground">Successo rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-foreground">CRM Integrato</h4>
            <p className="text-sm text-muted-foreground">Gestione completa dei candidati</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-foreground">Analytics Avanzate</h4>
            <p className="text-sm text-muted-foreground">KPI e metriche in tempo reale</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-foreground">Chat Integrata</h4>
            <p className="text-sm text-muted-foreground">Comunicazione diretta e veloce</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-foreground">Tracking Completo</h4>
            <p className="text-sm text-muted-foreground">Monitoraggio stato in tempo reale</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mockups;