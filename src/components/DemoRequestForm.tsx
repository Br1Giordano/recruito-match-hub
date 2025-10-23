import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeFormData } from "@/utils/inputSanitizer";
import { Loader2 } from "lucide-react";

export const DemoRequestForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    nome_azienda: "",
    messaggio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sanitize form data
      const { sanitized, errors } = sanitizeFormData(formData, {
        nome: { maxLength: 100, type: "text" },
        cognome: { maxLength: 100, type: "text" },
        email: { maxLength: 255, type: "email" },
        telefono: { maxLength: 50, type: "phone" },
        nome_azienda: { maxLength: 255, type: "text" },
        messaggio: { maxLength: 1000, type: "text" },
      });

      // Check for validation errors
      if (Object.keys(errors).length > 0) {
        const firstError = Object.values(errors)[0];
        toast({
          title: "Errore di validazione",
          description: firstError,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare data for insertion (remove empty optional fields)
      const dataToInsert: any = {
        nome: sanitized.nome,
        cognome: sanitized.cognome,
        email: sanitized.email,
      };

      if (sanitized.telefono) dataToInsert.telefono = sanitized.telefono;
      if (sanitized.nome_azienda) dataToInsert.nome_azienda = sanitized.nome_azienda;
      if (sanitized.messaggio) dataToInsert.messaggio = sanitized.messaggio;

      // Insert into database
      const { error: dbError } = await supabase
        .from("demo_requests")
        .insert([dataToInsert]);

      if (dbError) throw dbError;

      // Send emails via edge function
      const { error: emailError } = await supabase.functions.invoke(
        "send-demo-request",
        {
          body: dataToInsert,
        }
      );

      if (emailError) {
        console.error("Email sending error:", emailError);
        // Don't throw - the request is saved, just notify about email
        toast({
          title: "Richiesta salvata",
          description: "La tua richiesta è stata registrata. Ti contatteremo presto!",
        });
      } else {
        toast({
          title: "Richiesta inviata!",
          description: "Riceverai una conferma via email a breve.",
        });
      }

      // Reset form
      setFormData({
        nome: "",
        cognome: "",
        email: "",
        telefono: "",
        nome_azienda: "",
        messaggio: "",
      });
    } catch (error: any) {
      console.error("Error submitting demo request:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5" id="prenota-demo">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-recruito-blue via-recruito-teal to-recruito-green bg-clip-text text-transparent">
            Prenota una Demo
          </h2>
          <p className="text-lg text-muted-foreground">
            Scopri come Recruito può trasformare il tuo processo di recruiting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg shadow-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                required
                value={formData.nome}
                onChange={handleChange}
                placeholder="Mario"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cognome">
                Cognome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cognome"
                name="cognome"
                type="text"
                required
                value={formData.cognome}
                onChange={handleChange}
                placeholder="Rossi"
                maxLength={100}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="mario.rossi@azienda.it"
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Telefono</Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+39 123 456 7890"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome_azienda">Nome Azienda</Label>
            <Input
              id="nome_azienda"
              name="nome_azienda"
              type="text"
              value={formData.nome_azienda}
              onChange={handleChange}
              placeholder="La tua azienda"
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="messaggio">Messaggio</Label>
            <Textarea
              id="messaggio"
              name="messaggio"
              value={formData.messaggio}
              onChange={handleChange}
              placeholder="Raccontaci di più sulle tue esigenze..."
              maxLength={1000}
              className="min-h-[120px]"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Invio in corso...
              </>
            ) : (
              "Richiedi Demo Gratuita"
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            I campi contrassegnati con <span className="text-destructive">*</span> sono obbligatori
          </p>
        </form>
      </div>
    </section>
  );
};
