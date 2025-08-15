import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractAcceptanceStep } from "@/components/legal/ContractAcceptanceStep";
import { User, Shield, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface RecruiterRegistrationStepProps {
  onComplete: () => void;
}

export const RecruiterRegistrationStep = ({ onComplete }: RecruiterRegistrationStepProps) => {
  const [step, setStep] = useState(1); // 1: welcome, 2: contracts
  const { toast } = useToast();

  const handleContractsComplete = () => {
    toast({
      title: "Registrazione completata!",
      description: "Benvenuto in Recruito! Ora puoi iniziare a inviare proposte.",
    });
    onComplete();
  };

  if (step === 2) {
    return (
      <ContractAcceptanceStep
        userType="recruiter"
        onComplete={handleContractsComplete}
        isRequired={true}
      />
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">Benvenuto su Recruito!</CardTitle>
        <p className="text-muted-foreground">
          Prima di iniziare, accetta i nostri accordi per la collaborazione
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Privacy Protetta</h3>
            <p className="text-xs text-muted-foreground">
              I tuoi dati sono al sicuro con noi
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Termini Chiari</h3>
            <p className="text-xs text-muted-foreground">
              Accordi trasparenti e equi
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Supporto Completo</h3>
            <p className="text-xs text-muted-foreground">
              Ti assistiamo in ogni fase
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={() => setStep(2)}
            className="w-full"
          >
            Continua con l'Accettazione Contratti
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};