import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, 
  Check, 
  ExternalLink, 
  Mail, 
  Phone, 
  Linkedin, 
  FileText,
  Calendar,
  Clock,
  User,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Candidate } from "./CandidateCard";

interface SidePanelCandidateProps {
  candidate: Candidate | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  className?: string;
}

const statusSteps = [
  { id: 'pending', label: 'Ricevuta', completed: true },
  { id: 'under_review', label: 'In valutazione', completed: true },
  { id: 'approved', label: 'Approvata', completed: false },
  { id: 'interview', label: 'Colloquio', completed: false },
  { id: 'hired', label: 'Assunta', completed: false },
];

export default function SidePanelCandidate({
  candidate,
  onClose,
  onApprove,
  onReject,
  className
}: SidePanelCandidateProps) {
  const [activeTab, setActiveTab] = useState("info");

  if (!candidate) {
    return (
      <div className={cn("w-full h-full bg-gray-50 flex items-center justify-center", className)}>
        <div className="text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Seleziona una candidatura per visualizzare i dettagli</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(step => step.id === candidate.status);
  const progressPercentage = ((currentStepIndex + 1) / statusSteps.length) * 100;

  return (
    <div className={cn("w-full h-full bg-white flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 truncate">
            {candidate.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {candidate.seniority} • {candidate.role}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress Pipeline */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Pipeline: {currentStepIndex + 1}/{statusSteps.length}</span>
          <span>Ultimo aggiornamento: {new Date(candidate.updatedAt).toLocaleString('it-IT')}</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-6 mt-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="cv">CV</TabsTrigger>
            <TabsTrigger value="cronologia">Cronologia</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="info" className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Contatti</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{candidate.email}</span>
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{candidate.phone}</span>
                    </div>
                  )}
                  {candidate.linkedin && (
                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-4 h-4 text-gray-400" />
                      <a 
                        href={candidate.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Profilo LinkedIn
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Competenze</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Match Score */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Match Score</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Progress value={candidate.matchScore} className="h-3" />
                  </div>
                  <span className="font-medium text-lg">{candidate.matchScore}%</span>
                </div>
              </div>

              {/* Recruiter Info */}
              {candidate.recruiterName && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Recruiter</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nome:</strong> {candidate.recruiterName}</p>
                    {candidate.recruiterRating && (
                      <p><strong>Rating:</strong> {candidate.recruiterRating.toFixed(1)}/5</p>
                    )}
                    {candidate.recruiterCompletionRate && (
                      <p><strong>Tasso completamento:</strong> {candidate.recruiterCompletionRate}%</p>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cv" className="p-6">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">CV non disponibile</p>
                <p className="text-sm text-gray-400 mt-2">
                  Il CV verrà visualizzato qui quando disponibile
                </p>
              </div>
            </TabsContent>

            <TabsContent value="cronologia" className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Candidatura ricevuta</p>
                    <p className="text-xs text-gray-500">
                      {new Date(candidate.createdAt).toLocaleString('it-IT')}
                    </p>
                  </div>
                </div>
                
                {candidate.status !== 'pending' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">Status aggiornato</p>
                      <p className="text-xs text-gray-500">
                        {new Date(candidate.updatedAt).toLocaleString('it-IT')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-3">
          <Button
            onClick={onApprove}
            disabled={candidate.status === 'approved'}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Approva
          </Button>
          <Button
            variant="destructive"
            onClick={onReject}
            disabled={candidate.status === 'rejected'}
          >
            <X className="w-4 h-4 mr-2" />
            Rifiuta
          </Button>
        </div>
        
        <div className="text-xs text-gray-500">
          Shortcut: A = Approva, R = Rifiuta
        </div>
      </div>
    </div>
  );
}