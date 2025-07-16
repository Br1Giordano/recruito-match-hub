/**
 * Assicura che un URL abbia il protocollo corretto
 */
export function ensureHttpsProtocol(url: string): string {
  if (!url) return '';
  
  // Se l'URL inizia già con http:// o https://, restituiscilo così com'è
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Altrimenti aggiungi https://
  return `https://${url}`;
}

/**
 * Formatta specificamente un URL LinkedIn
 */
export function formatLinkedInUrl(url: string): string {
  if (!url) return '';
  
  // Rimuovi eventuali protocolli esistenti
  let cleanUrl = url.replace(/^https?:\/\//, '');
  
  // Assicurati che inizi con www.linkedin.com se non c'è già
  if (!cleanUrl.startsWith('linkedin.com') && !cleanUrl.startsWith('www.linkedin.com')) {
    cleanUrl = `www.linkedin.com/in/${cleanUrl}`;
  }
  
  // Aggiungi il protocollo https://
  return `https://${cleanUrl}`;
}