
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { ArrowLeft, Save } from "lucide-react";
import { sanitizeFormData } from "@/utils/inputSanitizer";

const jobOfferSchema = z.object({
  company_name: z.string().min(1, "Il nome dell'azienda è obbligatorio"),
  title: z.string().min(1, "Il titolo è obbligatorio"),
  description: z.string().optional(),
  location: z.string().optional(),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  employment_type: z.string().default("full-time"),
  status: z.string().default("active"),
});

type JobOfferFormData = z.infer<typeof jobOfferSchema>;

interface JobOfferFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function JobOfferForm({ onBack, onSuccess }: JobOfferFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useCompanyProfile();

  const form = useForm<JobOfferFormData>({
    resolver: zodResolver(jobOfferSchema),
    defaultValues: {
      company_name: "",
      title: "",
      description: "",
      location: "",
      salary_min: "",
      salary_max: "",
      requirements: "",
      benefits: "",
      employment_type: "full-time",
      status: "active",
    },
  });

  // Precompila il nome dell'azienda quando il profilo è disponibile
  useEffect(() => {
    if (profile?.nome_azienda) {
      form.setValue('company_name', profile.nome_azienda);
    }
  }, [profile, form]);

  const onSubmit = async (data: JobOfferFormData) => {
    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per creare offerte",
          variant: "destructive",
        });
        return;
      }

      // Sanitize input data
      const sanitizationSchema = {
        company_name: { maxLength: 200, type: 'text' as const },
        title: { maxLength: 200, type: 'text' as const },
        description: { maxLength: 5000, type: 'text' as const },
        location: { maxLength: 200, type: 'text' as const },
        salary_min: { maxLength: 20, type: 'text' as const },
        salary_max: { maxLength: 20, type: 'text' as const },
        requirements: { maxLength: 3000, type: 'text' as const },
        benefits: { maxLength: 3000, type: 'text' as const },
        employment_type: { maxLength: 50, type: 'text' as const },
        status: { maxLength: 20, type: 'text' as const },
      };

      const { sanitized, errors } = sanitizeFormData(data, sanitizationSchema);

      if (Object.keys(errors).length > 0) {
        toast({
          title: "Errore di validazione",
          description: Object.values(errors).join(', '),
          variant: "destructive",
        });
        return;
      }

      console.log("Creating job offer with user:", user.email);
      console.log("Company name:", sanitized.company_name);

      // Convert salary strings to numbers if provided
      const salaryMin = sanitized.salary_min ? parseInt(sanitized.salary_min) : null;
      const salaryMax = sanitized.salary_max ? parseInt(sanitized.salary_max) : null;

      const jobOfferData = {
        company_name: sanitized.company_name,
        contact_email: user.email,
        user_id: user.id, // Aggiunto per soddisfare la policy RLS
        title: sanitized.title,
        description: sanitized.description || null,
        location: sanitized.location || null,
        salary_min: salaryMin,
        salary_max: salaryMax,
        requirements: sanitized.requirements || null,
        benefits: sanitized.benefits || null,
        employment_type: sanitized.employment_type,
        status: sanitized.status,
        // company_id rimane null per questa nuova struttura semplificata
        company_id: null,
      };

      console.log("Job offer data to insert:", jobOfferData);

      const { error } = await supabase
        .from("job_offers")
        .insert(jobOfferData);

      if (error) {
        console.error("Error creating job offer:", error);
        toast({
          title: "Errore",
          description: `Impossibile creare l'offerta di lavoro: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      // Invia email di conferma all'azienda
      try {
        await supabase.functions.invoke('send-job-offer-confirmation', {
          body: {
            company_email: user.email,
            company_name: data.company_name,
            job_title: data.title,
            job_location: data.location || 'Non specificata',
            employment_type: data.employment_type
          }
        });
        console.log("Confirmation email sent successfully");
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Non bloccare il processo se l'email fallisce
      }

      toast({
        title: "Successo",
        description: "Offerta di lavoro creata con successo. Riceverai una email di conferma.",
      });

      onSuccess();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore imprevisto",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Torna alle Offerte
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuova Offerta di Lavoro</h1>
          <p className="text-muted-foreground">
            Crea una nuova offerta di lavoro per la tua azienda
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dettagli dell'Offerta</CardTitle>
          <CardDescription>
            Compila i campi per creare la tua offerta di lavoro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome dell'Azienda *</FormLabel>
                    <FormControl>
                      <Input placeholder="es. Tech Solutions S.r.l." {...field} />
                    </FormControl>
                    <FormDescription>
                      Il nome della tua azienda che apparirà nell'offerta di lavoro
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titolo della Posizione *</FormLabel>
                    <FormControl>
                      <Input placeholder="es. Sviluppatore Frontend Senior" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrizione</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrivi la posizione, le responsabilità e i compiti principali..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sede di Lavoro</FormLabel>
                      <FormControl>
                        <Input placeholder="es. Milano, Roma, Remote" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employment_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo di Contratto</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona il tipo di contratto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tempo-indeterminato">Tempo Indeterminato</SelectItem>
                          <SelectItem value="tempo-determinato">Tempo Determinato</SelectItem>
                          <SelectItem value="full-time">Tempo Pieno</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contratto-progetto">Contratto a Progetto</SelectItem>
                          <SelectItem value="partita-iva">Partita IVA</SelectItem>
                          <SelectItem value="stage">Stage</SelectItem>
                          <SelectItem value="tirocinio">Tirocinio</SelectItem>
                          <SelectItem value="apprendistato">Apprendistato</SelectItem>
                          <SelectItem value="consulenza">Consulenza</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="salary_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salario Minimo (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="es. 30000" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Salario annuo lordo minimo</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salario Massimo (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="es. 50000" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Salario annuo lordo massimo</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisiti</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Elenca i requisiti necessari per la posizione..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefit e Vantaggi</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrivi i benefit offerti dall'azienda..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stato dell'Offerta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona lo stato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Attiva</SelectItem>
                        <SelectItem value="paused">In Pausa</SelectItem>
                        <SelectItem value="closed">Chiusa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isSubmitting}
                >
                  Annulla
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Creazione..." : "Crea Offerta"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
