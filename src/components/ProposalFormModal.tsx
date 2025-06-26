
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Save, User, Building2, Briefcase } from "lucide-react";

const proposalSchema = z.object({
  candidate_name: z.string().min(1, "Il nome del candidato è obbligatorio"),
  candidate_email: z.string().email("Email non valida"),
  candidate_phone: z.string().optional(),
  candidate_linkedin: z.string().optional(),
  proposal_description: z.string().min(10, "La descrizione deve essere di almeno 10 caratteri"),
  years_experience: z.string().optional(),
  current_salary: z.string().optional(),
  expected_salary: z.string().optional(),
  availability_weeks: z.string().optional(),
  recruiter_fee_percentage: z.string().min(1, "La percentuale di fee è obbligatoria"),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface JobOffer {
  id: string;
  title: string;
  company_registrations: {
    nome_azienda: string;
    id: string;
  };
}

interface ProposalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jobOffer: JobOffer;
}

export default function ProposalFormModal({ isOpen, onClose, onSuccess, jobOffer }: ProposalFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { userProfile, user } = useAuth();

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      candidate_name: "",
      candidate_email: "",
      candidate_phone: "",
      candidate_linkedin: "",
      proposal_description: "",
      years_experience: "",
      current_salary: "",
      expected_salary: "",
      availability_weeks: "",
      recruiter_fee_percentage: "15",
    },
  });

  const onSubmit = async (data: ProposalFormData) => {
    setIsSubmitting(true);

    try {
      if (!user || !userProfile || userProfile.user_type !== 'recruiter') {
        toast({
          title: "Errore",
          description: "Devi essere autenticato come recruiter per inviare proposte",
          variant: "destructive",
        });
        return;
      }

      // Prepare proposal data
      const proposalData = {
        recruiter_id: userProfile.registration_id,
        company_id: jobOffer.company_registrations.id,
        job_offer_id: jobOffer.id,
        candidate_name: data.candidate_name,
        candidate_email: data.candidate_email,
        candidate_phone: data.candidate_phone || null,
        candidate_linkedin: data.candidate_linkedin || null,
        proposal_description: data.proposal_description,
        years_experience: data.years_experience ? parseInt(data.years_experience) : null,
        current_salary: data.current_salary ? parseInt(data.current_salary) : null,
        expected_salary: data.expected_salary ? parseInt(data.expected_salary) : null,
        availability_weeks: data.availability_weeks ? parseInt(data.availability_weeks) : null,
        recruiter_fee_percentage: parseInt(data.recruiter_fee_percentage),
        status: "pending",
      };

      console.log("Sending proposal data:", proposalData);

      const { error } = await supabase
        .from("proposals")
        .insert(proposalData);

      if (error) {
        console.error("Error creating proposal:", error);
        toast({
          title: "Errore",
          description: `Impossibile inviare la proposta: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Invia Candidato per: {jobOffer.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {jobOffer.company_registrations.nome_azienda}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="candidate_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo del Candidato *</FormLabel>
                    <FormControl>
                      <Input placeholder="es. Mario Rossi" {...field} />
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
                    <FormLabel>Email del Candidato *</FormLabel>
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
                    <FormLabel>Telefono</FormLabel>
                    <FormControl>
                      <Input placeholder="+39 333 123 4567" {...field} />
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
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/mariorossi" {...field} />
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
                  <FormLabel>Descrizione del Candidato *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrivi le competenze, l'esperienza e perché questo candidato è perfetto per la posizione..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Minimo 10 caratteri</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="years_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anni di Esperienza</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5" {...field} />
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
                      <Input type="number" placeholder="35000" {...field} />
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
                    <FormLabel>Salario Richiesto (€)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="45000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="availability_weeks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disponibilità (settimane)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="4" {...field} />
                    </FormControl>
                    <FormDescription>Tra quante settimane può iniziare</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recruiter_fee_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee del Recruiter (%) *</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="50" placeholder="15" {...field} />
                    </FormControl>
                    <FormDescription>Percentuale sul salario annuo</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annulla
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-recruito-blue hover:bg-recruito-blue/90">
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Invio..." : "Invia Proposta"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
