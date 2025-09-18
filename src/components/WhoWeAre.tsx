import { LinkedinIcon, Users, Target, Heart } from "lucide-react";

const WhoWeAre = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Chi siamo
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Un team di esperti del recruiting e della tecnologia, uniti dalla missione di rivoluzionare il mondo del lavoro.
          </p>
        </div>

        {/* Founders */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Founder 1 */}
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20">
              <Users className="h-16 w-16 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Marco Bianchi</h3>
              <p className="text-primary font-medium">CEO & Co-Founder</p>
              <p className="text-sm text-muted-foreground mt-2">
                15 anni nel recruiting tech, ex-Head of Talent presso unicorn europee
              </p>
            </div>
          </div>

          {/* Founder 2 */}
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20">
              <Target className="h-16 w-16 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Sofia Rossi</h3>
              <p className="text-primary font-medium">CTO & Co-Founder</p>
              <p className="text-sm text-muted-foreground mt-2">
                Ex-Tech Lead Google, esperta di AI e machine learning per HR
              </p>
            </div>
          </div>

          {/* Founder 3 */}
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20">
              <Heart className="h-16 w-16 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Luigi Ferrari</h3>
              <p className="text-primary font-medium">CPO & Co-Founder</p>
              <p className="text-sm text-muted-foreground mt-2">
                Product Manager senior, specializzato in UX per piattaforme B2B
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">La nostra missione</h3>
              <p className="text-muted-foreground leading-relaxed">
                Democratizzare l'accesso ai migliori talenti attraverso la tecnologia. 
                Crediamo che ogni azienda, indipendentemente dalle dimensioni, meriti di 
                lavorare con i recruiter più qualificati d'Italia.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">I nostri valori</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-foreground">Trasparenza:</span>
                    <span className="text-muted-foreground ml-2">Fee chiare, processi aperti, risultati misurabili</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-foreground">Qualità:</span>
                    <span className="text-muted-foreground ml-2">Solo i migliori recruiter, solo candidati pre-selezionati</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <span className="font-semibold text-foreground">Innovazione:</span>
                    <span className="text-muted-foreground ml-2">AI, gamification e tech per risultati superiori</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              Perché abbiamo creato Recruito
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Dopo anni nel recruiting tradizionale, abbiamo vissuto le frustrazioni 
                di aziende e recruiter: processi lenti, costi elevati, risultati incerti.
              </p>
              <p>
                Abbiamo immaginato un mondo dove la tecnologia abilita relazioni 
                trasparenti, competitive e orientate al risultato.
              </p>
              <p className="font-medium text-foreground">
                Recruito è questa visione che diventa realtà.
              </p>
            </div>
          </div>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-gradient">2024</div>
            <div className="text-sm text-muted-foreground">Anno di fondazione</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-gradient">€2M</div>
            <div className="text-sm text-muted-foreground">Seed funding raccolto</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-gradient">15+</div>
            <div className="text-sm text-muted-foreground">Team members</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-gradient">Milano</div>
            <div className="text-sm text-muted-foreground">Headquarters</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;