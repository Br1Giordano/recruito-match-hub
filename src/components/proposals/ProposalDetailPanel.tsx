
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, X, User, Mail, Phone, Linkedin, Download, Clock, Building2 } from "lucide-react";

interface ProposalDetailPanelProps {
  proposal: {
    id: string;
    candidate_name: string;
    candidate_email: string;
    candidate_phone?: string;
    candidate_linkedin?: string;
    candidate_cv_url?: string;
    proposal_description: string;
    years_experience?: number;
    expected_salary?: number;
    availability_weeks?: number;
    status: string;
    created_at: string;
    recruiter_name?: string;
    recruiter_email?: string;
    job_offers?: {
      title: string;
      company_name?: string;
    };
  } | null;
  onApprove: () => void;
  onReject: () => void;
}

export default function ProposalDetailPanel({ proposal, onApprove, onReject }: ProposalDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("info");

  if (!proposal) {
    return (
      <div className="w-3/5 bg-gray-50 border-l flex items-center justify-center">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Seleziona una candidatura</h3>
          <p className="text-gray-500">
            Clicca su una card a sinistra per vedere i dettagli del candidato
          </p>
        </div>
      </div>
    );
  }

  const pipelineStep = proposal.status === "pending" ? 1 : 
                     proposal.status === "under_review" ? 3 : 
                     proposal.status === "approved" ? 5 : 2;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Nuova Candidatura";
      case "under_review":
        return "In Screening";
      case "approved":
        return "Candidatura Approvata";
      case "rejected":
        return "Candidatura Scartata";
      default:
        return status;
    }
  };

  return (
    <div className="w-3/5 bg-white border-l flex flex-col">
      {/* Header */}
      <div className="border-b bg-gray-50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{proposal.candidate_name}</h2>
            <p className="text-gray-600">{proposal.job_offers?.title}</p>
          </div>
          <Badge className={getStatusColor(proposal.status)}>
            {getStatusText(proposal.status)}
          </Badge>
        </div>
        
        {/* Mini Progress Bar */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Pipeline: step {pipelineStep} di 5</span>
          <span>Aggiornato {new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <Progress value={(pipelineStep / 5) * 100} className="h-2" />
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-6 mt-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="cv">CV</TabsTrigger>
            <TabsTrigger value="cronologia">Cronologia</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="info" className="space-y-6 mt-0">
              {/* Candidate Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informazioni Candidato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${proposal.candidate_email}`} className="text-blue-600 hover:underline">
                        {proposal.candidate_email}
                      </a>
                    </div>
                    {proposal.candidate_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${proposal.candidate_phone}`} className="text-blue-600 hover:underline">
                          {proposal.candidate_phone}
                        </a>
                      </div>
                    )}
                    {proposal.candidate_linkedin && (
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-gray-400" />
                        <a href={proposal.candidate_linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Profilo LinkedIn
                        </a>
                      </div>
                    )}
                    {proposal.years_experience && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{proposal.years_experience} anni di esperienza</span>
                      </div>
                    )}
                  </div>
                  
                  {proposal.proposal_description && (
                    <div>
                      <h4 className="font-medium mb-2">Descrizione Candidato</h4>
                      <p className="text-gray-700 leading-relaxed">{proposal.proposal_description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    {proposal.expected_salary && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Salario Richiesto</label>
                        <p className="text-lg font-semibold">€{proposal.expected_salary.toLocaleString()}</p>
                      </div>
                    )}
                    {proposal.availability_weeks && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Disponibilità</label>
                        <p className="text-lg font-semibold">{proposal.availability_weeks} settimane</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recruiter Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informazioni Recruiter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Nome: </span>
                      <span>{proposal.recruiter_name || "Non specificato"}</span>
                    </div>
                    {proposal.recruiter_email && (
                      <div>
                        <span className="font-medium">Email: </span>
                        <a href={`mailto:${proposal.recruiter_email}`} className="text-blue-600 hover:underline">
                          {proposal.recruiter_email}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cv" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Curriculum Vitae</span>
                    {proposal.candidate_cv_url && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Scarica CV
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {proposal.candidate_cv_url ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Visualizzazione CV non disponibile in demo</p>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Scarica per visualizzare
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nessun CV caricato</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cronologia" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Cronologia Candidatura</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Candidatura ricevuta</p>
                        <p className="text-sm text-gray-500">
                          {new Date(proposal.created_at).toLocaleDateString('it-IT')} alle {new Date(proposal.created_at).toLocaleTimeString('it-IT')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Fixed Footer Actions */}
      <div className="border-t bg-gray-50 p-6">
        <div className="flex gap-3">
          <Button
            onClick={onReject}
            variant="outline"
            className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
            disabled={proposal.status === "rejected"}
          >
            <X className="h-4 w-4 mr-2" />
            Rifiuta
          </Button>
          <Button
            onClick={onApprove}
            className="flex-1 bg-[#0A84FF] hover:bg-[#0A84FF]/90"
            disabled={proposal.status === "approved"}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approva
          </Button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Shortcut: A = Approva • R = Rifiuta • D = Dettagli
        </p>
      </div>
    </div>
  );
}
