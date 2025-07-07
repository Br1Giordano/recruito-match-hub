
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Calendar, 
  Clock, 
  FileText,
  Star,
  Target,
  X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

interface ProposalDetailPanelProps {
  proposal: any;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onClose: () => void;
}

export default function ProposalDetailPanel({ 
  proposal, 
  onApprove, 
  onReject, 
  onClose 
}: ProposalDetailPanelProps) {
  if (!proposal) {
    return (
      <div className="w-[40%] border-l bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-500">Seleziona una proposta per vedere i dettagli</p>
      </div>
    );
  }

  const createdAt = formatDistanceToNow(new Date(proposal.created_at), { 
    addSuffix: true, 
    locale: it 
  });

  return (
    <div className="w-[40%] border-l bg-white flex flex-col">
      {/* Header con azioni */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {proposal.candidate_name}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Contenuto con tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="info" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="cv">CV</TabsTrigger>
            <TabsTrigger value="cronologia">Cronologia</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="info" className="space-y-4 mt-0">
              {/* Info Candidato */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Informazioni Candidato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{proposal.candidate_email}</span>
                  </div>
                  
                  {proposal.candidate_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{proposal.candidate_phone}</span>
                    </div>
                  )}
                  
                  {proposal.candidate_linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-gray-400" />
                      <a 
                        href={proposal.candidate_linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Profilo LinkedIn
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{proposal.years_experience || 0} anni di esperienza</span>
                  </div>

                  {proposal.availability_weeks && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Disponibile in {proposal.availability_weeks} settimane</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Aspettative Economiche */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Aspettative Economiche</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {proposal.current_salary && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Salario attuale:</span>
                      <span className="text-sm font-medium">€{proposal.current_salary.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {proposal.expected_salary && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Salario desiderato:</span>
                      <span className="text-sm font-medium">€{proposal.expected_salary.toLocaleString()}</span>
                    </div>
                  )}

                  {proposal.recruiter_fee_percentage && proposal.expected_salary && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Success fee {proposal.recruiter_fee_percentage}%:</span>
                        <span className="text-sm font-medium text-green-600">
                          ≈ €{Math.round((proposal.expected_salary * proposal.recruiter_fee_percentage) / 100 / 1000)}k
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Info Recruiter */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recruiter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{proposal.recruiter_name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{proposal.recruiter_email}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Posizioni chiuse:</span>
                    <span className="text-green-600 font-medium">85%</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cv" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Curriculum Vitae
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {proposal.candidate_cv_url ? (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">CV del candidato</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(proposal.candidate_cv_url, '_blank')}
                      >
                        Apri CV
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Nessun CV disponibile</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cronologia" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Cronologia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Proposta ricevuta</p>
                        <p className="text-xs text-gray-500">{createdAt}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer con azioni */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => onApprove(proposal.id)}
            disabled={proposal.status === 'accepted'}
          >
            Approva Candidato
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => onReject(proposal.id)}
            disabled={proposal.status === 'rejected'}
          >
            Rifiuta
          </Button>
        </div>
      </div>
    </div>
  );
}
