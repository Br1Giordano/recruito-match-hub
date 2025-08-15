
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeFormData } from "@/utils/inputSanitizer";
import { ContractAcceptanceStep } from "@/components/legal/ContractAcceptanceStep";

const CompanyRegistrationForm = () => {
  const [formData, setFormData] = useState({
    nome_azienda: "",
    settore: "",
    email: "",
    telefono: "",
    messaggio: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: contracts
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, linkToRegistration } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate and sanitize inputs with improved security
      const { sanitized: sanitizedData, errors } = sanitizeFormData(formData, {
        nome_azienda: { maxLength: 255, type: 'text' },
        settore: { maxLength: 255, type: 'text' },
        email: { maxLength: 255, type: 'email' },
        telefono: { maxLength: 20, type: 'phone' },
        messaggio: { maxLength: 1000, type: 'text' }
      });

      // Check for validation errors
      if (Object.keys(errors).length > 0) {
        const firstError = Object.values(errors)[0];
        toast({
          title: "Dati non validi",
          description: firstError,
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('company_registrations')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) {
        toast({
          title: "Errore durante la registrazione",
          description: "Si è verificato un errore. Riprova più tardi.",
          variant: "destructive",
        });
        return;
      }

      // Store registration ID and move to contracts step
      setRegistrationId(data.id);
      setStep(2);

      toast({
        title: "Dati salvati!",
        description: "Ora accetta i contratti per completare la registrazione.",
      });
    } catch (error) {
      toast({
        title: "Errore durante la registrazione",
        description: "Si è verificato un errore imprevisto. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContractsComplete = async () => {
    try {
      // If user is authenticated, link this registration to their profile
      if (user && registrationId) {
        const linked = await linkToRegistration(registrationId, 'company');
        if (linked) {
          toast({
            title: "Registrazione completata!",
            description: "Il tuo profilo aziendale è stato collegato con successo.",
          });
        } else {
          toast({
            title: "Registrazione completata!",
            description: "Ti contatteremo presto per discutere come Recruito può aiutare la tua azienda.",
          });
        }
      } else {
        toast({
          title: "Registrazione completata!",
          description: "Ti contatteremo presto per discutere come Recruito può aiutare la tua azienda.",
        });
      }

      // Reset form
      setFormData({
        nome_azienda: "",
        settore: "",
        email: "",
        telefono: "",
        messaggio: ""
      });
      setStep(1);
      setRegistrationId(null);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante il completamento della registrazione",
        variant: "destructive",
      });
    }
  };

  if (step === 2) {
    return (
      <ContractAcceptanceStep
        userType="company"
        onComplete={handleContractsComplete}
        isRequired={true}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome_azienda">Nome Azienda *</Label>
        <Input
          id="nome_azienda"
          name="nome_azienda"
          value={formData.nome_azienda}
          onChange={handleChange}
          required
          placeholder="Il nome della tua azienda"
          disabled={isSubmitting}
          maxLength={255}
        />
      </div>

      <div>
        <Label htmlFor="settore">Settore di attività</Label>
        <Input
          id="settore"
          name="settore"
          value={formData.settore}
          onChange={handleChange}
          placeholder="es. Tecnologia, Marketing, Finance..."
          disabled={isSubmitting}
          maxLength={255}
        />
      </div>

      <div>
        <Label htmlFor="email">Email di contatto *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="contatti@tuaazienda.com"
          disabled={isSubmitting}
          maxLength={255}
        />
      </div>

      <div>
        <Label htmlFor="telefono">Telefono</Label>
        <Input
          id="telefono"
          name="telefono"
          type="tel"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="+39 123 456 7890"
          disabled={isSubmitting}
          maxLength={20}
        />
      </div>

      <div>
        <Label htmlFor="messaggio">Parlaci delle tue esigenze di recruiting (opzionale)</Label>
        <Textarea
          id="messaggio"
          name="messaggio"
          value={formData.messaggio}
          onChange={handleChange}
          placeholder="Quante persone cercate? Che tipo di profili? Budget indicativo?"
          rows={3}
          disabled={isSubmitting}
          maxLength={1000}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" className="flex-1" disabled={isSubmitting}>
            Annulla
          </Button>
        </DialogClose>
        <Button 
          type="submit" 
          className="flex-1 gradient-recruito text-white border-0 hover:opacity-90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Invio in corso..." : "Invia Registrazione"}
        </Button>
      </div>
    </form>
  );
};

export default CompanyRegistrationForm;
