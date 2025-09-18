import { Building2, Users, Star, Target, TrendingUp, Shield, Zap, Trophy } from "lucide-react";

const WhyChooseRecruitо = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Perché scegliere <span className="text-gradient">Recruito</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            La piattaforma che mette al centro aziende e recruiter, garantendo valore per entrambi.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* For Companies */}
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Per le Aziende</h3>
              <p className="text-muted-foreground">
                Accedi al network più qualificato di recruiter specializzati
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Network verificato</h4>
                  <p className="text-muted-foreground">Solo recruiter con track record comprovato e specializzazioni specifiche</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <Target className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Zero costi fissi</h4>
                  <p className="text-muted-foreground">Nessun costo di attivazione, abbonamento o fee fisse. Paghi solo quando assumi</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <Star className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Profili già selezionati</h4>
                  <p className="text-muted-foreground">Candidati pre-intervistati e validati dai recruiter prima della presentazione</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <Zap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Processo digitale</h4>
                  <p className="text-muted-foreground">Dashboard completa per gestire tutto il processo in un'unica piattaforma</p>
                </div>
              </div>
            </div>
          </div>

          {/* For Recruiters */}
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Per i Recruiter</h3>
              <p className="text-muted-foreground">
                Massimizza le tue opportunità e costruisci la tua reputazione
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <TrendingUp className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Più opportunità</h4>
                  <p className="text-muted-foreground">Accesso continuo a posizioni aperte dalle migliori aziende italiane</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <Trophy className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Fee più alte</h4>
                  <p className="text-muted-foreground">Commissioni competitive e trasparenti, con bonus per performance eccellenti</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <Star className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Visibilità tramite rating</h4>
                  <p className="text-muted-foreground">Sistema di gamification che premia qualità e velocità con maggiore visibilità</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <Zap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Strumenti avanzati</h4>
                  <p className="text-muted-foreground">AI per matching, CRM integrato e analytics per ottimizzare le performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-gradient">500+</div>
            <div className="text-sm text-muted-foreground">Aziende registrate</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-gradient">200+</div>
            <div className="text-sm text-muted-foreground">Recruiter attivi</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-gradient">95%</div>
            <div className="text-sm text-muted-foreground">Tasso di successo</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-gradient">2.5x</div>
            <div className="text-sm text-muted-foreground">Velocità vs tradizionale</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseRecruitо;