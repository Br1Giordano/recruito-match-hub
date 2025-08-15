import { Button } from "@/components/ui/button";
import { Shield, FileText, Cookie } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { GDPRRequestForm } from "./GDPRRequestForm";

export const LegalFooterLinks = () => {
  const [gdprDialogOpen, setGdprDialogOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <a 
        href="/privacy-policy" 
        className="hover:text-primary transition-colors flex items-center gap-1"
      >
        <Shield className="h-3 w-3" />
        Privacy Policy
      </a>
      
      <a 
        href="/terms-of-service" 
        className="hover:text-primary transition-colors flex items-center gap-1"
      >
        <FileText className="h-3 w-3" />
        Termini di Servizio
      </a>
      
      <a 
        href="/cookie-policy" 
        className="hover:text-primary transition-colors flex items-center gap-1"
      >
        <Cookie className="h-3 w-3" />
        Cookie Policy
      </a>

      <Dialog open={gdprDialogOpen} onOpenChange={setGdprDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
          >
            <Shield className="h-3 w-3 mr-1" />
            Richieste GDPR
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Richieste GDPR</DialogTitle>
          </DialogHeader>
          <GDPRRequestForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};