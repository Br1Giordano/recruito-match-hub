
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const CompanyRegistrationForm = () => {
  const [formData, setFormData] = useState({
    nomeAzienda: "",
    settore: "",
    email: "",
    telefono: "",
    messaggio: ""
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulazione invio form
    console.log("Dati azienda:", formData);
    
    toast({
      title: "Registrazione inviata!",
      description: "Ti contatteremo presto per discutere come Recruito può aiutare la tua azienda.",
    });

    // Reset form
    setFormData({
      nomeAzienda: "",
      settore: "",
      email: "",
      telefono: "",
      messaggio: ""
    });
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
        <Label htmlFor="nomeAzienda">Nome Azienda *</Label>
        <Input
          id="nomeAzienda"
          name="nomeAzienda"
          value={formData.nomeAzienda}
          onChange={handleChange}
          required
          placeholder="Il nome della tua azienda"
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
        />
      </div>

      <div className="flex gap-3 pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" className="flex-1">
            Annulla
          </Button>
        </DialogClose>
        <Button type="submit" className="flex-1 gradient-recruito text-white border-0 hover:opacity-90">
          Invia Registrazione
        </Button>
      </div>
    </form>
  );
};

export default CompanyRegistrationForm;
