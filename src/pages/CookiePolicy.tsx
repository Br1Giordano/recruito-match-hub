
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationFooter from "@/components/NavigationFooter";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <NavigationFooter />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">Ultimo aggiornamento: 25 giugno 2025</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Cosa sono i Cookie</h2>
              <p className="mb-4">
                I cookie sono piccoli file di testo che vengono memorizzati sul vostro dispositivo 
                quando visitate un sito web. Permettono al sito di ricordare le vostre azioni e 
                preferenze per un certo periodo di tempo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Come Utilizziamo i Cookie</h2>
              <p className="mb-4">
                Utilizziamo i cookie per:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Mantenere le vostre preferenze di navigazione</li>
                <li>Migliorare le prestazioni del sito</li>
                <li>Analizzare il traffico e l'utilizzo del sito</li>
                <li>Fornire funzionalità di sicurezza</li>
                <li>Personalizzare l'esperienza utente</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Tipi di Cookie Utilizzati</h2>
              
              <h3 className="text-xl font-semibold mb-3">3.1 Cookie Strettamente Necessari</h3>
              <p className="mb-4">
                Questi cookie sono essenziali per il funzionamento del sito e non possono essere disattivati. 
                Includono cookie per la sicurezza, l'autenticazione e il mantenimento delle sessioni.
              </p>

              <h3 className="text-xl font-semibold mb-3">3.2 Cookie di Prestazione</h3>
              <p className="mb-4">
                Raccolgono informazioni su come i visitatori utilizzano il sito web, quali pagine 
                vengono visitate più spesso e se gli utenti ricevono messaggi di errore.
              </p>

              <h3 className="text-xl font-semibold mb-3">3.3 Cookie di Funzionalità</h3>
              <p className="mb-4">
                Permettono al sito di ricordare le scelte fatte dall'utente (come il nome utente, 
                la lingua o la regione) e fornire funzionalità avanzate e personalizzate.
              </p>

              <h3 className="text-xl font-semibold mb-3">3.4 Cookie Analitici</h3>
              <p className="mb-4">
                Ci aiutano a capire come i visitatori interagiscono con il sito web raccogliendo 
                e segnalando informazioni in modo anonimo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Cookie di Terze Parti</h2>
              <p className="mb-4">
                Il nostro sito può utilizzare servizi di terze parti che impostano i propri cookie:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Google Analytics:</strong> Per analizzare il traffico del sito</li>
                <li><strong>Servizi di sicurezza:</strong> Per proteggere da attacchi e spam</li>
                <li><strong>Servizi di hosting:</strong> Per garantire le prestazioni del sito</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Durata dei Cookie</h2>
              <p className="mb-4">I cookie hanno diverse durate:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Cookie di sessione:</strong> Vengono eliminati quando chiudete il browser</li>
                <li><strong>Cookie persistenti:</strong> Rimangono memorizzati per un periodo prestabilito</li>
                <li><strong>Cookie tecnici:</strong> Durata variabile da alcune ore a alcuni mesi</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Come Gestire i Cookie</h2>
              <p className="mb-4">
                Potete controllare e/o eliminare i cookie come desiderate. Potete eliminare tutti 
                i cookie già presenti sul vostro computer e impostare la maggior parte dei browser 
                per impedire che vengano memorizzati.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">6.1 Impostazioni del Browser</h3>
              <p className="mb-4">Istruzioni per i browser più comuni:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Chrome:</strong> Menu → Impostazioni → Avanzate → Privacy e sicurezza → Impostazioni sito → Cookie</li>
                <li><strong>Firefox:</strong> Menu → Opzioni → Privacy e sicurezza → Cookie e dati dei siti web</li>
                <li><strong>Safari:</strong> Preferenze → Privacy → Gestisci dati siti web</li>
                <li><strong>Edge:</strong> Menu → Impostazioni → Privacy, ricerca e servizi → Cookie</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Consenso</h2>
              <p className="mb-4">
                Continuando a navigare sul nostro sito, acconsentite all'uso dei cookie in conformità 
                a questa policy. Per i cookie non essenziali, richiediamo il vostro consenso esplicito 
                tramite il banner dei cookie.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Modifiche a Questa Policy</h2>
              <p className="mb-4">
                Possiamo aggiornare questa Cookie Policy per riflettere cambiamenti nelle nostre 
                pratiche o per altri motivi operativi, legali o normativi.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Contatti</h2>
              <p className="mb-4">
                Se avete domande sui cookie o su questa policy, contattate:<br />
                Email: contact.recruito@gmail.com<br />
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

export default CookiePolicy;
