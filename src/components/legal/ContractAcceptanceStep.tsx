import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield } from "lucide-react";
import { useDigitalContracts } from "@/hooks/useDigitalContracts";
import { ContractSigningModal } from "./ContractSigningModal";

interface ContractAcceptanceStepProps {
  userType: 'recruiter' | 'company';
  onComplete: () => void;
  isRequired?: boolean;
}

export const ContractAcceptanceStep = ({ userType, onComplete, isRequired = true }: ContractAcceptanceStepProps) => {
  const { contracts, signContract } = useDigitalContracts();
  const [acceptedContracts, setAcceptedContracts] = useState<string[]>([]);
  const [signingContract, setSigningContract] = useState<any>(null);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);

  // Filter contracts based on user type and category
  const relevantContracts = contracts.filter(contract => {
    if (userType === 'recruiter') {
      return ['recruiter_agreement', 'privacy_policy', 'terms_of_service'].includes(contract.contract_type);
    } else {
      return ['client_agreement', 'privacy_policy', 'terms_of_service'].includes(contract.contract_type);
    }
  });

  const mandatoryContracts = relevantContracts.filter(contract => 
    ['privacy_policy', 'terms_of_service'].includes(contract.contract_type)
  );

  const allMandatoryAccepted = mandatoryContracts.every(contract => 
    acceptedContracts.includes(contract.id)
  );

  const handleContractToggle = (contractId: string, checked: boolean) => {
    if (checked) {
      setAcceptedContracts(prev => [...prev, contractId]);
    } else {
      setAcceptedContracts(prev => prev.filter(id => id !== contractId));
    }
  };

  const handleSignContract = async (contract: any) => {
    setSigningContract(contract);
    setIsSigningModalOpen(true);
  };

  const handleContractSigned = async (contractId: string, signatureData: any) => {
    const success = await signContract(contractId, signatureData);
    if (success) {
      setAcceptedContracts(prev => [...prev, contractId]);
      setIsSigningModalOpen(false);
      setSigningContract(null);
    }
    return success;
  };

  const getContractTypeName = (type: string) => {
    switch (type) {
      case 'privacy_policy':
        return 'Informativa Privacy';
      case 'terms_of_service':
        return 'Termini di Servizio';
      case 'recruiter_agreement':
        return 'Accordo di Collaborazione Recruiter';
      case 'client_agreement':
        return 'Contratto Servizi Azienda';
      default:
        return type;
    }
  };

  const isMandatory = (contractType: string) => {
    return ['privacy_policy', 'terms_of_service'].includes(contractType);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle>Accettazione Contratti e Privacy</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {isRequired 
              ? "Accetta i contratti obbligatori per completare la registrazione"
              : "Rivedi e accetta i contratti della piattaforma"
            }
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {relevantContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4" />
                        <h4 className="font-medium">{getContractTypeName(contract.contract_type)}</h4>
                        {isMandatory(contract.contract_type) && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                            Obbligatorio
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {contract.title}
                      </p>
                      
                      <div className="max-h-32 overflow-y-auto bg-gray-50 p-3 rounded text-xs">
                        <div dangerouslySetInnerHTML={{ __html: contract.content.substring(0, 300) + '...' }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`contract-${contract.id}`}
                        checked={acceptedContracts.includes(contract.id)}
                        onCheckedChange={(checked) => 
                          handleContractToggle(contract.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`contract-${contract.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Ho letto e accetto
                      </label>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSignContract(contract)}
                      className="ml-4"
                    >
                      Leggi tutto
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {isRequired && (
            <div className="mt-6 pt-4 border-t">
              <Button
                onClick={onComplete}
                disabled={!allMandatoryAccepted}
                className="w-full"
              >
                {allMandatoryAccepted 
                  ? "Continua" 
                  : `Accetta i contratti obbligatori (${mandatoryContracts.length - acceptedContracts.filter(id => mandatoryContracts.some(c => c.id === id)).length} rimanenti)`
                }
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ContractSigningModal
        contract={signingContract}
        isOpen={isSigningModalOpen}
        onClose={() => {
          setIsSigningModalOpen(false);
          setSigningContract(null);
        }}
        onSign={handleContractSigned}
      />
    </>
  );
};