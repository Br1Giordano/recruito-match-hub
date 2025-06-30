
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, FileText } from "lucide-react";

interface EmptyProposalsStateProps {
  type: "company" | "recruiter";
  hasProposals: boolean;
}

export default function EmptyProposalsState({ type, hasProposals }: EmptyProposalsStateProps) {
  if (type === "company") {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Nessuna proposta trovata</h3>
            <p className="text-muted-foreground">
              {!hasProposals
                ? "Non hai ancora ricevuto proposte per le tue offerte di lavoro"
                : "Nessuna proposta corrisponde ai filtri selezionati"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Modalità Demo</h3>
          <p className="text-muted-foreground">
            Questa è una demo del sistema. In produzione vedrai qui le tue proposte reali.
            <br />
            Prova a inviare una nuova proposta per testare le funzionalità!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
