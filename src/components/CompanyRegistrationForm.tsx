
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const CompanyRegistrationForm = () => {
  const [formData, setFormData] = useState({
    nome_azienda: "",
    settore: "",
    email: "",
    telefono: "",
    messaggio: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, linkToRegistration } = useAuth();

  const validateInput = (value: string, maxLength: number = 255) => {
    return value.trim().substring(0, maxLength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate and sanitize inputs
      const sanitizedData = {
        nome_azienda: validateInput(formData.nome_azienda, 255),
        settore: validateInput(formData.settore, 255),
        email: validateInput(formData.email, 255),
        telefono: validateInput(formData.telefono, 20),
        messaggio: validateInput(formData.messaggio, 1000)
      };

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedData.email)) {
        toast({
          title: "Email non valida",
          description: "Inserisci un indirizzo email valido.",
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

      // If user is authenticated, link this registration to their profile
      if (user && data) {
        const linked = await linkToRegistration(data.id, 'company');
        if (linked) {
          toast({
            title: "Registrazione completata!",
            description: "Il tuo profilo aziendale è stato collegato con successo.",
          });
        } else {
          toast({
            title: "Registrazione inviata!",
            description: "Ti contatteremo presto per discutere come Recruito può aiutare la tua azienda.",
          });
        }
      } else {
        toast({
          title: "Registrazione inviata!",
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
