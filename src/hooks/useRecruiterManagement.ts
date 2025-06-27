
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useRecruiterManagement = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const ensureRecruiterExists = async () => {
    if (!user?.email || !userProfile) {
      throw new Error('Utente non autenticato');
    }

    console.log('Verificando esistenza recruiter per:', user.email);

    // Prima verifica se esiste già un recruiter con l'ID del profilo
    let { data: recruiterData, error: recruiterError } = await supabase
      .from('recruiter_registrations')
      .select('id, email')
      .eq('id', userProfile.registration_id)
      .maybeSingle();

    console.log('Recruiter by registration_id:', recruiterData);

    // Se non trovato, cerca per email
    if (!recruiterData) {
      const { data: recruiterByEmail } = await supabase
        .from('recruiter_registrations')
        .select('id, email')
        .eq('email', user.email)
        .maybeSingle();

      console.log('Recruiter by email:', recruiterByEmail);

      if (recruiterByEmail) {
        // Aggiorna il profilo utente con l'ID corretto
        await supabase
          .from('user_profiles')
          .update({ registration_id: recruiterByEmail.id })
          .eq('id', userProfile.id);
        
        recruiterData = recruiterByEmail;
        console.log('Profilo utente aggiornato con registration_id corretto');
      } else {
        // Crea un nuovo record recruiter
        console.log('Creando nuovo record recruiter');
        
        const { data: newRecruiter, error: createError } = await supabase
          .from('recruiter_registrations')
          .insert({
            email: user.email,
            nome: user.user_metadata?.first_name || 'Nome',
            cognome: user.user_metadata?.last_name || 'Cognome',
            status: 'active'
          })
          .select('id, email')
          .single();

        if (createError) {
          console.error('Errore creazione recruiter:', createError);
          throw new Error('Impossibile creare il profilo recruiter');
        }

        // Aggiorna il profilo utente con il nuovo ID
        await supabase
          .from('user_profiles')
          .update({ registration_id: newRecruiter.id })
          .eq('id', userProfile.id);

        recruiterData = newRecruiter;
        console.log('Nuovo recruiter creato e profilo aggiornato');
      }
    }

    return recruiterData;
  };

  const validateUserAccess = () => {
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per inviare proposte",
        variant: "destructive",
      });
      return false;
    }

    if (!userProfile || userProfile.user_type !== 'recruiter') {
      toast({
        title: "Errore",
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
