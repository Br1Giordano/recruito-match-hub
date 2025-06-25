
import { useState, useEffect } from 'react';

export type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

const COOKIE_CONSENT_KEY = 'recruito-cookie-consent';
const COOKIE_CONSENT_VERSION = '1.0';

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        if (parsed.version === COOKIE_CONSENT_VERSION) {
          setConsent(parsed.consent);
          setShowBanner(false);
        } else {
          // Version mismatch, show banner again
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const updateConsent = (newConsent: CookieConsent) => {
    setConsent(newConsent);
    setShowBanner(false);
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      consent: newConsent,
      version: COOKIE_CONSENT_VERSION,
      timestamp: new Date().toISOString()
    }));

    // Handle analytics cookies
    if (newConsent.analytics) {
      // Initialize analytics (Google Analytics, etc.)
      console.log('Analytics cookies accepted');
    } else {
      // Disable analytics
      console.log('Analytics cookies rejected');
    }

    // Handle marketing cookies
    if (newConsent.marketing) {
      console.log('Marketing cookies accepted');
    } else {
      console.log('Marketing cookies rejected');
    }
  };

  const acceptAll = () => {
    updateConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    });
  };

  const acceptNecessary = () => {
    updateConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    });
  };

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setConsent(null);
    setShowBanner(true);
  };

  return {
    consent,
    showBanner,
    updateConsent,
    acceptAll,
    acceptNecessary,
    resetConsent
  };
};
