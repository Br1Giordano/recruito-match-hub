
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Invio dati recruiter:", formData);
      
      const { data, error } = await supabase
        .from('recruiter_registrations')
        .insert([formData])
        .select();

      if (error) {
        console.error('Errore durante la registrazione:', error);
        toast({
          title: "Errore durante la registrazione",
          description: "Si è verificato un errore. Riprova più tardi.",
          variant: "destructive",
        });
        return;
      }

      console.log('Registrazione completata:', data);
      
      toast({
        title: "Registrazione inviata!",
        description: "Ti contatteremo presto per completare la tua registrazione.",
      });

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
      console.error('Errore imprevisto:', error);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
