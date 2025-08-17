
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { sanitizeFormData } from "@/utils/inputSanitizer";

const proposalSchema = z.object({
  company_id: z.string().min(1, "Seleziona un'azienda"),
  job_offer_id: z.string().optional(),
  candidate_name: z.string().min(2, "Nome candidato richiesto"),
  candidate_email: z.string().email("Email non valida"),
  candidate_phone: z.string().optional(),
  candidate_linkedin: z.string().url("URL LinkedIn non valido").optional().or(z.literal("")),
  proposal_description: z.string().min(50, "Descrizione troppo breve (min 50 caratteri)"),
  years_experience: z.number().min(0).max(50),
  current_salary: z.number().min(0).optional(),
  expected_salary: z.number().min(0).optional(),
  availability_weeks: z.number().min(0).max(52),
  recruiter_fee_percentage: z.number().min(1).max(30).default(15),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface Company {
  id: string;
  nome_azienda: string;
}

interface JobOffer {
  id: string;
  title: string;
  company_id: string;
}

export default function ProposalForm() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      recruiter_fee_percentage: 15,
      availability_weeks: 2,
    },
  });

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from("company_registrations")
      .select("id, nome_azienda")
      .order("nome_azienda");

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile caricare le aziende",
        variant: "destructive",
      });
      return;
    }

    setCompanies(data || []);
  };

  const fetchJobOffers = async (companyId: string) => {
    const { data, error } = await supabase
      .from("job_offers")
      .select("id, title, company_id")
      .eq("company_id", companyId)
      .eq("status", "active")
      .order("title");

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile caricare le offerte di lavoro",
        variant: "destructive",
      });
      return;
    }

    setJobOffers(data || []);
  };

  const onCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    form.setValue("company_id", companyId);
    form.setValue("job_offer_id", "");
    fetchJobOffers(companyId);
  };

  const onSubmit = async (data: ProposalFormData) => {
    setIsLoading(true);

    // Sanitize input data
    const sanitizationSchema = {
      company_id: { maxLength: 100, type: 'text' as const },
      job_offer_id: { maxLength: 100, type: 'text' as const },
      candidate_name: { maxLength: 100, type: 'text' as const },
      candidate_email: { type: 'email' as const },
      candidate_phone: { type: 'phone' as const },
      candidate_linkedin: { type: 'url' as const },
      proposal_description: { maxLength: 2000, type: 'text' as const },
      years_experience: { maxLength: 10, type: 'text' as const },
      current_salary: { maxLength: 20, type: 'text' as const },
      expected_salary: { maxLength: 20, type: 'text' as const },
      availability_weeks: { maxLength: 10, type: 'text' as const },
      recruiter_fee_percentage: { maxLength: 10, type: 'text' as const },
    };

    const { sanitized, errors } = sanitizeFormData(data, sanitizationSchema);

    if (Object.keys(errors).length > 0) {
      toast({
        title: "Errore di validazione",
        description: Object.values(errors).join(', '),
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Get current recruiter ID (in a real app, this would come from auth)
    const { data: recruiterData, error: recruiterError } = await supabase
      .from("recruiter_registrations")
      .select("id")
      .limit(1)
      .single();

    if (recruiterError || !recruiterData) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato come recruiter",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const proposalData = {
      recruiter_id: recruiterData.id,
      company_id: sanitized.company_id,
      job_offer_id: sanitized.job_offer_id || null,
      candidate_name: sanitized.candidate_name,
      candidate_email: sanitized.candidate_email,
      candidate_phone: sanitized.candidate_phone || null,
      candidate_linkedin: sanitized.candidate_linkedin || null,
      proposal_description: sanitized.proposal_description,
      years_experience: sanitized.years_experience,
      current_salary: sanitized.current_salary || null,
      expected_salary: sanitized.expected_salary || null,
      availability_weeks: sanitized.availability_weeks,
      recruiter_fee_percentage: sanitized.recruiter_fee_percentage,
    };

    const { error } = await supabase
      .from("proposals")
      .insert(proposalData);

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile inviare la proposta",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Successo!",
        description: "Proposta inviata con successo",
      });
      form.reset();
      setSelectedCompany("");
      setJobOffers([]);
    }

    setIsLoading(false);
  };

  // Load companies on component mount
  React.useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Invia Proposta Candidato</CardTitle>
        <CardDescription>
          Compila il form per inviare un profilo candidato alle aziende
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="company_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Azienda *</FormLabel>
                    <Select onValueChange={onCompanyChange} value={selectedCompany}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona azienda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.nome_azienda}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="job_offer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offerta di Lavoro (Opzionale)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona offerta specifica" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobOffers.map((offer) => (
                          <SelectItem key={offer.id} value={offer.id}>
                            {offer.title}
                          </SelectItem>
                        ))}
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
                name="candidate_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Candidato *</FormLabel>
                    <FormControl>
                      <Input placeholder="Mario Rossi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="candidate_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Candidato *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="mario.rossi@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="candidate_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono Candidato</FormLabel>
                    <FormControl>
                      <Input placeholder="+39 123 456 7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="candidate_linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Candidato</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/mario-rossi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="proposal_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione Proposta *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrivi il candidato, le sue competenze, esperienze rilevanti e perché è adatto per questa posizione..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="years_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anni di Esperienza</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="current_salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario Attuale (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="50000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expected_salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario Desiderato (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="55000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability_weeks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disponibilità (settimane)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="52"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="recruiter_fee_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentuale Fee Recruiter (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 15)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Invio in corso..." : "Invia Proposta"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
