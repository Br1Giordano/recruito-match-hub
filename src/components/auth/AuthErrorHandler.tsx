
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AuthErrorHandlerProps {
  error: string | null;
}

export default function AuthErrorHandler({ error }: AuthErrorHandlerProps) {
  if (!error) return null;

  // Map internal errors to user-friendly messages
  const getErrorMessage = (errorString: string): string => {
    const lowerError = errorString.toLowerCase();
    
    if (lowerError.includes('invalid_credentials') || lowerError.includes('invalid login')) {
      return 'Email o password non corretti. Riprova.';
    }
    
    if (lowerError.includes('email not confirmed')) {
      return 'Email non confermata. Controlla la tua casella di posta.';
    }
    
    if (lowerError.includes('too_many_requests')) {
      return 'Troppi tentativi. Riprova tra qualche minuto.';
    }
    
    if (lowerError.includes('weak_password')) {
      return 'La password deve essere di almeno 6 caratteri.';
    }
    
    if (lowerError.includes('email_address_invalid')) {
      return 'Indirizzo email non valido.';
    }
    
    if (lowerError.includes('user_already_registered')) {
      return 'Un utente con questa email è già registrato.';
    }
    
    // Default safe error message
    return 'Si è verificato un errore. Riprova più tardi.';
  };

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {getErrorMessage(error)}
      </AlertDescription>
    </Alert>
  );
}
