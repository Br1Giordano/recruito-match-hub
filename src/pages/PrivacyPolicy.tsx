
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">Ultimo aggiornamento: 25 giugno 2025</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Informazioni Generali</h2>
              <p className="mb-4">
                Recruito ("noi", "nostro" o "la Società") si impegna a proteggere la privacy degli utenti 
                della nostra piattaforma. Questa Privacy Policy descrive come raccogliamo, utilizziamo e 
                proteggiamo le vostre informazioni personali in conformità al Regolamento Generale sulla 
                Protezione dei Dati (GDPR) dell'Unione Europea.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Titolare del Trattamento</h2>
              <p className="mb-4">
                Il titolare del trattamento dei dati è:<br />
                Recruito<br />
                Email: contact.recruito@gmail.com<br />
                Telefono: +39 3440554181<br />
                Sede: Milano, Italia
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Dati Raccolti</h2>
              <p className="mb-4">Raccogliamo i seguenti tipi di dati personali:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Dati di registrazione: nome, cognome, email, telefono</li>
                <li>Dati professionali: azienda, esperienza lavorativa, settori di competenza</li>
                <li>Dati di navigazione: indirizzo IP, cookie, log di accesso</li>
                <li>Comunicazioni: messaggi inviati tramite i nostri form di contatto</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Finalità del Trattamento</h2>
              <p className="mb-4">Utilizziamo i vostri dati per:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Fornire i nostri servizi di matching tra aziende e recruiter</li>
                <li>Gestire le registrazioni e gli account utente</li>
                <li>Comunicare con voi riguardo ai nostri servizi</li>
                <li>Migliorare la nostra piattaforma e l'esperienza utente</li>
                <li>Adempiere agli obblighi legali</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Base Giuridica</h2>
              <p className="mb-4">
                Il trattamento dei vostri dati si basa su:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Consenso per le comunicazioni marketing</li>
                <li>Esecuzione del contratto per i servizi richiesti</li>
                <li>Interesse legittimo per il miglioramento dei servizi</li>
                <li>Obbligo legale per la conservazione di alcuni dati</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. I Vostri Diritti</h2>
              <p className="mb-4">Avete il diritto di:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Accedere ai vostri dati personali</li>
                <li>Rettificare dati inesatti o incompleti</li>
                <li>Cancellare i vostri dati ("diritto all'oblio")</li>
                <li>Limitare il trattamento</li>
                <li>Portabilità dei dati</li>
                <li>Opporvi al trattamento</li>
                <li>Revocare il consenso</li>
              </ul>
              <p className="mb-4">
                Per esercitare questi diritti, contattate: contact.recruito@gmail.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Conservazione dei Dati</h2>
              <p className="mb-4">
                Conserviamo i vostri dati per il tempo necessario a fornire i nostri servizi e in 
                conformità agli obblighi legali. I dati di registrazione vengono conservati per 
                la durata dell'account attivo più 2 anni dalla chiusura.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Sicurezza</h2>
              <p className="mb-4">
                Implementiamo misure di sicurezza tecniche e organizzative appropriate per proteggere 
                i vostri dati personali contro accessi non autorizzati, alterazioni, divulgazioni o distruzioni.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Cookie</h2>
              <p className="mb-4">
                Il nostro sito utilizza cookie per migliorare l'esperienza utente. Per maggiori informazioni, 
                consultate la nostra <a href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Modifiche</h2>
              <p className="mb-4">
                Potremmo aggiornare questa Privacy Policy periodicamente. Le modifiche saranno pubblicate 
                su questa pagina con la data di ultimo aggiornamento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contatti</h2>
              <p className="mb-4">
                Per qualsiasi domanda riguardo questa Privacy Policy, contattate:<br />
                Email: contact.recruito@gmail.com<br />
                Telefono: +39 3440554181
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
