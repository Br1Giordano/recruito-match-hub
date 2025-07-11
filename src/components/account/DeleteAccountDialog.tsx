import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteAccountDialogProps {
  trigger?: React.ReactNode;
}

export default function DeleteAccountDialog({ trigger }: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    if (confirmText !== 'ELIMINA' || !user) {
      toast({
        title: "Errore",
        description: "Devi digitare 'ELIMINA' per confermare",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    try {
      // 1. Elimina tutti i dati associati all'utente
      if (userProfile?.user_type === 'recruiter') {
        // Elimina proposte del recruiter
        await supabase
          .from('proposals')
          .delete()
          .eq('recruiter_email', user.email);

        // Elimina registrazione recruiter
        await supabase
          .from('recruiter_registrations')
          .delete()
          .eq('email', user.email);

        // Elimina recensioni del recruiter
        await supabase
          .from('recruiter_reviews')
          .delete()
          .eq('recruiter_email', user.email);
      } else if (userProfile?.user_type === 'company') {
        // Elimina offerte di lavoro dell'azienda
        const { data: jobOffers } = await supabase
          .from('job_offers')
          .select('id')
          .eq('contact_email', user.email);

        if (jobOffers && jobOffers.length > 0) {
          const jobOfferIds = jobOffers.map(job => job.id);
          
          // Elimina proposte per queste offerte
          await supabase
            .from('proposals')
            .delete()
            .in('job_offer_id', jobOfferIds);
        }

        // Elimina le offerte di lavoro
        await supabase
          .from('job_offers')
          .delete()
          .eq('contact_email', user.email);

        // Elimina registrazione azienda
        await supabase
          .from('company_registrations')
          .delete()
          .eq('email', user.email);

        // Elimina response alle proposte
        await supabase
          .from('proposal_responses')
          .delete()
          .eq('company_id', user.email);
      }

      // 2. Elimina il profilo utente
      await supabase
        .from('user_profiles')
        .delete()
        .eq('auth_user_id', user.id);

      // 3. Elimina l'account auth di Supabase
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        // Se non riesce a eliminare l'account auth, prova a fare logout
        console.error('Error deleting user from auth:', deleteError);
        await signOut();
      }

      toast({
        title: "Account eliminato",
        description: "Il tuo account è stato eliminato con successo",
      });

      // Reindirizza alla homepage
      window.location.href = '/';

    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione dell'account",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Elimina Account
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Elimina Account
          </DialogTitle>
          <DialogDescription className="text-left">
            <strong className="text-red-600">ATTENZIONE: Questa azione è irreversibile!</strong>
            <br /><br />
            Eliminando il tuo account verranno cancellati permanentemente:
            <ul className="list-disc list-inside mt-2 space-y-1">
              {userProfile?.user_type === 'recruiter' ? (
                <>
                  <li>Il tuo profilo recruiter</li>
                  <li>Tutte le tue proposte inviate</li>
                  <li>Le tue recensioni e valutazioni</li>
                  <li>I dati di accesso</li>
                </>
              ) : (
                <>
                  <li>Il profilo della tua azienda</li>
                  <li>Tutte le offerte di lavoro pubblicate</li>
                  <li>Le proposte ricevute</li>
                  <li>I dati di accesso</li>
                </>
              )}
            </ul>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-delete">
              Per confermare, digita <span className="font-bold text-red-600">ELIMINA</span>
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Digita ELIMINA"
              className="border-red-300 focus:border-red-500"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annulla
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={confirmText !== 'ELIMINA' || isDeleting}
          >
            {isDeleting ? 'Eliminazione...' : 'Elimina Definitivamente'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}