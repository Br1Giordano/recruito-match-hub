
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Invio dati azienda:", formData);
      
      const { data, error } = await supabase
        .from('company_registrations')
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
        description: "Ti contatteremo presto per discutere come Recruito può aiutare la tua azienda.",
      });

      // Reset form
      setFormData({
        nome_azienda: "",
        settore: "",
        email: "",
        telefono: "",
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
        <Label htmlFor="messaggio">Parlaci delle tue esigenze di recruiting (opzionale)</Label>
        <Textarea
          id="messaggio"
          name="messaggio"
          value={formData.messaggio}
          onChange={handleChange}
          placeholder="Quante persone cercate? Che tipo di profili? Budget indicativo?"
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

export default CompanyRegistrationForm;
