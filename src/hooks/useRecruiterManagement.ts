
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Funzione per validare e sanitizzare email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Funzione per sanitizzare input
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>\"']/g, '').trim();
};

export const useRecruiterManagement = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const ensureRecruiterExists = async () => {
    if (!user?.email || !userProfile) {
      throw new Error('Utente non autenticato o profilo mancante');
    }

    // Validazione email
    if (!validateEmail(user.email)) {
      throw new Error('Email non valida');
    }

    console.log('Verificando esistenza recruiter per:', user.email);

    try {
      // Prima verifica se esiste già un recruiter con l'ID del profilo
      let { data: recruiterData, error: recruiterError } = await supabase
        .from('recruiter_registrations')
        .select('id, email')
        .eq('id', userProfile.registration_id)
        .maybeSingle();

      console.log('Recruiter by registration_id:', recruiterData);

      // Se non trovato, cerca per email (con nuove RLS policy)
      if (!recruiterData && !recruiterError) {
        const { data: recruiterByEmail, error: emailError } = await supabase
          .from('recruiter_registrations')
          .select('id, email')
          .eq('email', user.email)
          .maybeSingle();

        console.log('Recruiter by email:', recruiterByEmail);

        if (recruiterByEmail && !emailError) {
          // Aggiorna il profilo utente con l'ID corretto
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ registration_id: recruiterByEmail.id })
            .eq('id', userProfile.id);
          
          if (updateError) {
            console.error('Error updating user profile:', updateError);
          } else {
            recruiterData = recruiterByEmail;
            console.log('Profilo utente aggiornato con registration_id corretto');
          }
        } else {
          // Crea un nuovo record recruiter con validazione
          console.log('Creando nuovo record recruiter');
          
          const sanitizedFirstName = sanitizeInput(user.user_metadata?.first_name || 'Nome');
          const sanitizedLastName = sanitizeInput(user.user_metadata?.last_name || 'Cognome');
          
          const { data: newRecruiter, error: createError } = await supabase
            .from('recruiter_registrations')
            .insert({
              email: user.email,
              nome: sanitizedFirstName,
              cognome: sanitizedLastName,
              status: 'active'
            })
            .select('id, email')
            .single();

          if (createError) {
            console.error('Errore creazione recruiter:', createError);
            
            if (createError.message.includes('RLS') || createError.message.includes('policy')) {
              throw new Error('Permessi insufficienti per creare il profilo recruiter');
            } else {
              throw new Error('Impossibile creare il profilo recruiter');
            }
          }

          // Aggiorna il profilo utente con il nuovo ID
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ registration_id: newRecruiter.id })
            .eq('id', userProfile.id);

          if (updateError) {
            console.error('Error updating user profile with new recruiter ID:', updateError);
          }

          recruiterData = newRecruiter;
          console.log('Nuovo recruiter creato e profilo aggiornato con sicurezza');
        }
      }

      if (recruiterError) {
        console.error('Error fetching recruiter:', recruiterError);
        
        if (recruiterError.message.includes('RLS') || recruiterError.message.includes('policy')) {
          throw new Error('Non hai i permessi per accedere a questo profilo recruiter');
        } else {
          throw new Error('Errore nel recupero del profilo recruiter');
        }
      }

      return recruiterData;
    } catch (error) {
      console.error('Error in ensureRecruiterExists:', error);
      throw error;
    }
  };

  const validateUserAccess = () => {
    if (!user) {
      toast({
        title: "Errore di Autenticazione",
        description: "Devi essere autenticato per inviare proposte",
        variant: "destructive",
      });
      return false;
    }

    if (!validateEmail(user.email || '')) {
      toast({
        title: "Errore",
        description: "Email utente non valida",
        variant: "destructive",
      });
      return false;
    }

    if (!userProfile || userProfile.user_type !== 'recruiter') {
      toast({
        title: "Accesso Negato",
        description: "Devi avere un profilo recruiter per inviare proposte",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return {
    ensureRecruiterExists,
    validateUserAccess
  };
};
