/**
 * Input sanitization utilities for security
 */

/**
 * Sanitizes text input by trimming, limiting length, and encoding HTML
 */
export function sanitizeText(value: string, maxLength: number = 255): string {
  if (!value) return '';
  
  // Trim whitespace and limit length
  let sanitized = value.trim().substring(0, maxLength);
  
  // Basic HTML encoding to prevent XSS
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized;
}

/**
 * Sanitizes email input with proper validation
 */
export function sanitizeEmail(email: string): { value: string; isValid: boolean } {
  if (!email) return { value: '', isValid: false };
  
  const sanitized = email.trim().toLowerCase().substring(0, 255);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(sanitized);
  
  return { value: sanitized, isValid };
}

/**
 * Sanitizes phone number input
 */
export function sanitizePhone(phone: string): { value: string; isValid: boolean } {
  if (!phone) return { value: '', isValid: true }; // Phone is optional
  
  // Remove all non-digit characters except +, spaces, and hyphens
  let sanitized = phone.trim().replace(/[^\d\+\-\s]/g, '');
  
  // Limit length
  sanitized = sanitized.substring(0, 20);
  
  // Basic phone validation (starts with + or digit, reasonable length)
  const phoneRegex = /^[\+]?[\d\s\-]{7,20}$/;
  const isValid = phoneRegex.test(sanitized);
  
  return { value: sanitized, isValid };
}

/**
 * Sanitizes URL input (for LinkedIn profiles, websites, etc.)
 */
export function sanitizeUrl(url: string): { value: string; isValid: boolean } {
  if (!url) return { value: '', isValid: true }; // URL is optional
  
  let sanitized = url.trim().substring(0, 500);
  
  try {
    // Try to create a URL object to validate format
    if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
      sanitized = 'https://' + sanitized;
    }
    
    const urlObj = new URL(sanitized);
    const isValid = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    
    return { value: sanitized, isValid };
  } catch {
    return { value: sanitized, isValid: false };
  }
}

/**
 * Comprehensive input sanitization for form data
 */
export function sanitizeFormData<T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, { maxLength?: number; type?: 'text' | 'email' | 'phone' | 'url' }>
): { sanitized: T; errors: Record<string, string> } {
  const sanitized = { ...data } as T;
  const errors: Record<string, string> = {};
  
  for (const [key, config] of Object.entries(schema)) {
    const value = data[key];
    const { maxLength = 255, type = 'text' } = config;
    
    switch (type) {
      case 'email': {
        const { value: sanitizedValue, isValid } = sanitizeEmail(value);
        (sanitized as any)[key] = sanitizedValue;
        if (value && !isValid) {
          errors[key] = 'Email non valida';
        }
        break;
      }
      case 'phone': {
        const { value: sanitizedValue, isValid } = sanitizePhone(value);
        (sanitized as any)[key] = sanitizedValue;
        if (value && !isValid) {
          errors[key] = 'Numero di telefono non valido';
        }
        break;
      }
      case 'url': {
        const { value: sanitizedValue, isValid } = sanitizeUrl(value);
        (sanitized as any)[key] = sanitizedValue;
        if (value && !isValid) {
          errors[key] = 'URL non valido';
        }
        break;
      }
      default: {
        (sanitized as any)[key] = sanitizeText(value, maxLength);
        break;
      }
    }
  }
  
  return { sanitized, errors };
}