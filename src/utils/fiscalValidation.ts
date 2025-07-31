/**
 * Utility functions for validating Italian fiscal data
 */

// Validate Italian Codice Fiscale
export function validateCodiceFiscale(cf: string): boolean {
  if (!cf || cf.length !== 16) return false;
  
  const cfRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
  return cfRegex.test(cf.toUpperCase());
}

// Validate Italian Partita IVA
export function validatePartitaIva(piva: string): boolean {
  if (!piva || piva.length !== 11) return false;
  
  // Check if all characters are digits
  if (!/^\d{11}$/.test(piva)) return false;
  
  // Calculate check digit
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    let digit = parseInt(piva[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(piva[10]);
}

// Validate IBAN format
export function validateIban(iban: string): boolean {
  if (!iban) return true; // IBAN is optional
  
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Basic format check for Italian IBAN
  if (cleanIban.startsWith('IT')) {
    return /^IT\d{2}[A-Z]\d{10}[A-Z0-9]{12}$/.test(cleanIban);
  }
  
  // Basic format check for other IBANs
  return /^[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}$/.test(cleanIban);
}

// Validate PEC email format
export function validatePec(pec: string): boolean {
  if (!pec) return true; // PEC is optional
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(pec);
}

// Validate Italian CAP (postal code)
export function validateCap(cap: string): boolean {
  if (!cap) return true; // CAP is optional
  
  return /^\d{5}$/.test(cap);
}

// Validate Italian province code
export function validateProvincia(provincia: string): boolean {
  if (!provincia) return true; // Provincia is optional
  
  return /^[A-Z]{2}$/.test(provincia.toUpperCase());
}

// Validate Codice SDI
export function validateCodiceSdi(sdi: string): boolean {
  if (!sdi) return true; // SDI is optional
  
  return /^[A-Z0-9]{7}$/.test(sdi.toUpperCase());
}

// Check if all required fiscal data is complete
export function isFiscalDataComplete(data: any): boolean {
  return !!(
    data.codice_fiscale &&
    data.partita_iva &&
    data.ragione_sociale &&
    data.indirizzo_fatturazione &&
    data.cap_fatturazione &&
    data.citta_fatturazione &&
    data.provincia_fatturazione
  );
}