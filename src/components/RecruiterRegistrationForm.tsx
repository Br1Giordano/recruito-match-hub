
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

const RecruiterRegistrationForm = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    azienda: "",
    esperienza: "",
    settori: "",
    messaggio: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, linkToRegistration } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate and sanitize inputs with improved security
      const { sanitized: sanitizedData, errors } = sanitizeFormData(formData, {
        nome: { maxLength: 100, type: 'text' },
        cognome: { maxLength: 100, type: 'text' },
        email: { maxLength: 255, type: 'email' },
        telefono: { maxLength: 20, type: 'phone' },
        azienda: { maxLength: 255, type: 'text' },
        esperienza: { maxLength: 100, type: 'text' },
        settori: { maxLength: 500, type: 'text' },
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
        .from('recruiter_registrations')
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

      // If user is authenticated, link this registration to their profile
      if (user && data) {
        const linked = await linkToRegistration(data.id, 'recruiter');
        if (linked) {
          toast({
            title: "Registrazione completata!",
            description: "Il tuo profilo è stato collegato con successo.",
          });
        } else {
          toast({
            title: "Registrazione inviata!",
            description: "Ti contatteremo presto per completare la tua registrazione.",
          });
        }
      } else {
        toast({
          title: "Registrazione inviata!",
          description: "Ti contatteremo presto per completare la tua registrazione.",
        });
      }

      // Reset form
      setFormData({
        nome: "",
        cognome: "",
        email: "",
        telefono: "",
        azienda: "",
        esperienza: "",
        settori: "",
        messaggio: ""
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome *</Label>
          <Input
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Il tuo nome"
            disabled={isSubmitting}
            maxLength={100}
          />
        </div>
        <div>
          <Label htmlFor="cognome">Cognome *</Label>
          <Input
            id="cognome"
            name="cognome"
            value={formData.cognome}
            onChange={handleChange}
            required
            placeholder="Il tuo cognome"
            disabled={isSubmitting}
            maxLength={100}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="la-tua-email@esempio.com"
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
        <Label htmlFor="azienda">Azienda/Agenzia</Label>
        <Input
          id="azienda"
          name="azienda"
          value={formData.azienda}
          onChange={handleChange}
          placeholder="Nome della tua azienda o agenzia"
          disabled={isSubmitting}
          maxLength={255}
        />
      </div>

      <div>
        <Label htmlFor="esperienza">Anni di esperienza nel recruiting</Label>
        <Input
          id="esperienza"
          name="esperienza"
          value={formData.esperienza}
          onChange={handleChange}
          placeholder="es. 5 anni"
          disabled={isSubmitting}
          maxLength={100}
        />
      </div>

      <div>
        <Label htmlFor="settori">Settori di specializzazione</Label>
        <Input
          id="settori"
          name="settori"
          value={formData.settori}
          onChange={handleChange}
          placeholder="es. IT, Marketing, Sales..."
          disabled={isSubmitting}
          maxLength={500}
        />
      </div>

      <div>
        <Label htmlFor="messaggio">Messaggio (opzionale)</Label>
        <Textarea
          id="messaggio"
          name="messaggio"
          value={formData.messaggio}
          onChange={handleChange}
          placeholder="Raccontaci qualcosa di più su di te..."
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

export default RecruiterRegistrationForm;
