import { useState } from "react";
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
import { ArrowLeft, Save, Building2 } from "lucide-react";

const jobOfferSchema = z.object({
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
  const [availableCompanies, setAvailableCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [showCompanySelection, setShowCompanySelection] = useState(false);
  const { toast } = useToast();
  const { userProfile, user, linkToRegistration } = useAuth();

  const form = useForm<JobOfferFormData>({
    resolver: zodResolver(jobOfferSchema),
    defaultValues: {
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

  // Fetch available companies for demo purposes
  const fetchAvailableCompanies = async () => {
    const { data, error } = await supabase
      .from("company_registrations")
      .select("id, nome_azienda, email")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAvailableCompanies(data);
      console.log("Available companies:", data);
    }
  };

  const handleLinkToCompany = async (companyId: string) => {
    const success = await linkToRegistration(companyId, 'company');
    if (success) {
      toast({
        title: "Successo",
        description: "Account collegato all'azienda con successo!",
      });
      setShowCompanySelection(false);
    } else {
      toast({
        title: "Errore",
        description: "Impossibile collegare l'account all'azienda",
        variant: "destructive",
      });
    }
  };

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

      console.log("Current user:", user);
      console.log("User profile:", userProfile);

      // Se non ha un profilo aziendale, mostra le aziende disponibili per collegarsi
      if (!userProfile || userProfile.user_type !== 'company') {
        console.log("No company profile found, fetching available companies...");
        await fetchAvailableCompanies();
        setShowCompanySelection(true);
        toast({
          title: "Collegamento Richiesto",
          description: "Seleziona l'azienda a cui vuoi collegare il tuo account",
        });
        return;
      }

      console.log("Company ID to use:", userProfile.registration_id);

      // Verify that the company registration exists
      const { data: companyData, error: companyError } = await supabase
        .from("company_registrations")
        .select("id, nome_azienda")
        .eq("id", userProfile.registration_id)
        .single();

      if (companyError || !companyData) {
        console.error("Company not found:", companyError);
        // Se l'azienda non esiste, mostra le aziende disponibili
        await fetchAvailableCompanies();
        setShowCompanySelection(true);
        toast({
          title: "Profilo Aziendale Non Trovato",
          description: "Seleziona l'azienda a cui vuoi collegare il tuo account",
        });
        return;
      }

      console.log("Company found:", companyData);

      // Convert salary strings to numbers if provided
      const salaryMin = data.salary_min ? parseInt(data.salary_min) : null;
      const salaryMax = data.salary_max ? parseInt(data.salary_max) : null;

      const jobOfferData = {
        company_id: userProfile.registration_id,
        title: data.title,
        description: data.description || null,
        location: data.location || null,
        salary_min: salaryMin,
        salary_max: salaryMax,
        requirements: data.requirements || null,
        benefits: data.benefits || null,
        employment_type: data.employment_type,
        status: data.status,
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

      toast({
        title: "Successo",
        description: "Offerta di lavoro creata con successo",
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

  // Se stiamo mostrando la selezione delle aziende
  if (showCompanySelection) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setShowCompanySelection(false)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Torna al Form
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Collega il tuo Account a un'Azienda
            </CardTitle>
            <CardDescription>
              Seleziona l'azienda a cui appartieni per poter creare offerte di lavoro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableCompanies.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nessuna azienda registrata trovata. Assicurati che l'azienda si sia registrata sulla piattaforma.
                  </p>
                </div>
              ) : (
                availableCompanies.map((company) => (
                  <Card key={company.id} className="cursor-pointer hover:bg-gray-50 border-2 hover:border-blue-200 transition-colors"
                        onClick={() => handleLinkToCompany(company.id)}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{company.nome_azienda}</h3>
                          <p className="text-sm text-muted-foreground">{company.email}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Collega
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                          <SelectItem value="full-time">Tempo Pieno</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contratto</SelectItem>
                          <SelectItem value="internship">Stage</SelectItem>
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
