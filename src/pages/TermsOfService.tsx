
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Termini di Servizio</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">Ultimo aggiornamento: 25 giugno 2025</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Accettazione dei Termini</h2>
              <p className="mb-4">
                Utilizzando la piattaforma Recruito, accettate integralmente questi Termini di Servizio. 
                Se non accettate questi termini, non potete utilizzare i nostri servizi.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Descrizione del Servizio</h2>
              <p className="mb-4">
                Recruito è una piattaforma digitale che connette piccole e medie imprese italiane 
                con recruiter freelance qualificati. Facilitiamo il matching tra domanda e offerta 
                nel settore delle risorse umane.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Registrazione e Account</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>La registrazione è riservata a maggiorenni</li>
                <li>Le informazioni fornite devono essere accurate e veritiere</li>
                <li>Siete responsabili della sicurezza del vostro account</li>
                <li>Un account per persona/azienda</li>
                <li>Ci riserviamo il diritto di sospendere account che violano i termini</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Obblighi degli Utenti</h2>
              <h3 className="text-xl font-semibold mb-3">4.1 Per le Aziende:</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Fornire descrizioni accurate delle posizioni lavorative</li>
                <li>Rispettare i contratti con i recruiter selezionati</li>
                <li>Effettuare i pagamenti nei tempi concordati</li>
                <li>Non discriminare candidati per motivi illegali</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">4.2 Per i Recruiter:</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Possedere le qualifiche e l'esperienza dichiarate</li>
                <li>Fornire servizi professionali di qualità</li>
                <li>Rispettare la riservatezza delle informazioni ricevute</li>
                <li>Non contattare direttamente i candidati per altre opportunità senza consenso</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Comportamenti Vietati</h2>
              <p className="mb-4">È vietato:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Utilizzare la piattaforma per attività illegali</li>
                <li>Pubblicare contenuti falsi, diffamatori o inappropriati</li>
                <li>Tentare di accedere ad account di altri utenti</li>
                <li>Aggirare le commissioni della piattaforma</li>
                <li>Utilizzare bot o sistemi automatizzati</li>
                <li>Copiare o rivendere i nostri servizi</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Commissioni e Pagamenti</h2>
              <p className="mb-4">
                I dettagli su commissioni e modalità di pagamento sono specificati separatamente 
                e possono variare. Tutti i prezzi sono comunicati chiaramente prima della conclusione 
                di qualsiasi accordo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Proprietà Intellettuale</h2>
              <p className="mb-4">
                Tutti i contenuti della piattaforma (design, testi, logo, software) sono di proprietà 
                di Recruito o dei rispettivi proprietari e sono protetti da copyright e altri diritti 
                di proprietà intellettuale.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Limitazione di Responsabilità</h2>
              <p className="mb-4">
                Recruito funge da intermediario. Non siamo responsabili per:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>La qualità dei servizi forniti dai recruiter</li>
                <li>Le decisioni di assunzione delle aziende</li>
                <li>Dispute tra aziende e recruiter</li>
                <li>Perdite economiche derivanti dall'uso della piattaforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Risoluzione delle Controversie</h2>
              <p className="mb-4">
                Eventuali controversie saranno risolte tramite mediazione. In caso di insuccesso, 
                sarà competente il Foro di Milano. Si applica la legge italiana.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Modifiche ai Termini</h2>
              <p className="mb-4">
                Ci riserviamo il diritto di modificare questi termini. Gli utenti saranno notificati 
                delle modifiche sostanziali con almeno 30 giorni di preavviso.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Sospensione e Chiusura</h2>
              <p className="mb-4">
                Possiamo sospendere o chiudere account che violano questi termini, con o senza preavviso, 
                a nostra discrezione.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Contatti</h2>
              <p className="mb-4">
                Per questioni legali o sui termini di servizio:<br />
                Email: contact.recruito@gmail.com<br />
                Telefono: +39 3440554181<br />
                Indirizzo: Milano, Italia
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
