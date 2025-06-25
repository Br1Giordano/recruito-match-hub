
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useCookieConsent, CookieConsent } from '@/hooks/useCookieConsent';
import { Cookie, Settings, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const { showBanner, acceptAll, acceptNecessary, updateConsent } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [customConsent, setCustomConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  if (!showBanner) return null;

  const handleCustomSave = () => {
    updateConsent(customConsent);
    setShowSettings(false);
  };

  const updateCustomConsent = (category: keyof CookieConsent, value: boolean) => {
    setCustomConsent(prev => ({
      ...prev,
      [category]: category === 'necessary' ? true : value // Necessary cookies cannot be disabled
    }));
  };

  return (
    <>
      {/* Banner principale */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg animate-slide-in">
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Cookie className="h-6 w-6 text-recruito-blue flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium mb-1">🍪 Utilizziamo i cookie</p>
                <p className="text-muted-foreground">
                  Utilizziamo cookie essenziali per il funzionamento del sito e cookie opzionali per migliorare la tua esperienza. 
                  <Link to="/cookie-policy" className="text-recruito-blue hover:underline ml-1">
                    Scopri di più
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Settings className="h-4 w-4 mr-2" />
                    Personalizza
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Impostazioni Cookie</DialogTitle>
                    <DialogDescription>
                      Gestisci le tue preferenze sui cookie. I cookie necessari sono sempre attivi per garantire il funzionamento del sito.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Cookie Necessari */}
                    <div className="flex items-start justify-between p-4 border rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-semibold">Cookie Necessari</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Essenziali per il funzionamento del sito web. Non possono essere disattivati.
                        </p>
                      </div>
                      <Checkbox checked={true} disabled className="mt-1" />
                    </div>

                    {/* Cookie Analitici */}
                    <div className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">Cookie Analitici</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ci aiutano a capire come i visitatori interagiscono con il sito raccogliendo informazioni anonime.
                        </p>
                      </div>
                      <Checkbox 
                        checked={customConsent.analytics}
                        onCheckedChange={(checked) => updateCustomConsent('analytics', checked as boolean)}
                        className="mt-1"
                      />
                    </div>

                    {/* Cookie di Marketing */}
                    <div className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">Cookie di Marketing</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Utilizzati per tracciare i visitatori sui siti web per mostrare annunci pertinenti e coinvolgenti.
                        </p>
                      </div>
                      <Checkbox 
                        checked={customConsent.marketing}
                        onCheckedChange={(checked) => updateCustomConsent('marketing', checked as boolean)}
                        className="mt-1"
                      />
                    </div>

                    {/* Cookie di Preferenze */}
                    <div className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">Cookie di Preferenze</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Permettono al sito di ricordare le informazioni che cambiano il comportamento del sito.
                        </p>
                      </div>
                      <Checkbox 
                        checked={customConsent.preferences}
                        onCheckedChange={(checked) => updateCustomConsent('preferences', checked as boolean)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setShowSettings(false)}>
                      Annulla
                    </Button>
                    <Button onClick={handleCustomSave} className="gradient-recruito text-white">
                      Salva Preferenze
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm" onClick={acceptNecessary} className="w-full sm:w-auto">
                Solo Necessari
              </Button>
              
              <Button 
                onClick={acceptAll} 
                size="sm" 
                className="gradient-recruito text-white w-full sm:w-auto"
              >
                Accetta Tutti
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieBanner;
