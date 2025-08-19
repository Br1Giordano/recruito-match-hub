
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CVUploadWithAnonymization } from '@/components/cv/CVUploadWithAnonymization';

interface ProposalFormFieldsProps {
  formData: {
    candidate_name: string;
    candidate_email: string;
    candidate_phone: string;
    candidate_linkedin: string;
    candidate_cv_url: string;
    proposal_description: string;
    years_experience: string;
    current_salary: string;
    expected_salary: string;
    availability_weeks: string;
    recruiter_fee_percentage: string;
  };
  onChange: (field: string, value: string) => void;
  proposalId?: string;
}

export const ProposalFormFields: React.FC<ProposalFormFieldsProps> = ({
  formData,
  onChange,
  proposalId
}) => {
  
  const handleCVUploaded = (cvUrl: string, originalFileName: string) => {
    onChange('candidate_cv_url', cvUrl);
    // Salva anche il nome originale del file se necessario
  };

  const handleAnonymizedCVReady = (anonymizedUrl: string) => {
    console.log('CV anonimizzato pronto:', anonymizedUrl);
    // Il CV anonimizzato viene gestito automaticamente nel database
  };

  return (
    <div className="space-y-6">
      {/* Informazioni del Candidato */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informazioni del Candidato</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="candidate_name">Nome Completo *</Label>
            <Input
              id="candidate_name"
              value={formData.candidate_name}
              onChange={(e) => onChange('candidate_name', e.target.value)}
              placeholder="Mario Rossi"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="candidate_email">Email *</Label>
            <Input
              id="candidate_email"
              type="email"
              value={formData.candidate_email}
              onChange={(e) => onChange('candidate_email', e.target.value)}
              placeholder="mario.rossi@email.com"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="candidate_phone">Telefono</Label>
            <Input
              id="candidate_phone"
              value={formData.candidate_phone}
              onChange={(e) => onChange('candidate_phone', e.target.value)}
              placeholder="+39 123 456 7890"
            />
          </div>
          
          <div>
            <Label htmlFor="candidate_linkedin">LinkedIn</Label>
            <Input
              id="candidate_linkedin"
              value={formData.candidate_linkedin}
              onChange={(e) => onChange('candidate_linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/mario-rossi"
            />
          </div>
        </div>

        {/* Upload CV con anonimizzazione automatica */}
        <CVUploadWithAnonymization
          proposalId={proposalId}
          onCVUploaded={handleCVUploaded}
          onAnonymizedCVReady={handleAnonymizedCVReady}
        />
      </div>

      {/* Descrizione della Proposta */}
      <div>
        <Label htmlFor="proposal_description">Descrizione della Proposta *</Label>
        <Textarea
          id="proposal_description"
          value={formData.proposal_description}
          onChange={(e) => onChange('proposal_description', e.target.value)}
          placeholder="Descrivi perché questo candidato è perfetto per la posizione..."
          className="min-h-[120px]"
          required
        />
      </div>

      {/* Dettagli Professionali */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Dettagli Professionali</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="years_experience">Anni di Esperienza</Label>
            <Input
              id="years_experience"
              type="number"
              value={formData.years_experience}
              onChange={(e) => onChange('years_experience', e.target.value)}
              placeholder="5"
              min="0"
            />
          </div>
          
          <div>
            <Label htmlFor="availability_weeks">Disponibilità (settimane)</Label>
            <Input
              id="availability_weeks"
              type="number"
              value={formData.availability_weeks}
              onChange={(e) => onChange('availability_weeks', e.target.value)}
              placeholder="4"
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="current_salary">Stipendio Attuale (€)</Label>
            <Input
              id="current_salary"
              type="number"
              value={formData.current_salary}
              onChange={(e) => onChange('current_salary', e.target.value)}
              placeholder="45000"
              min="0"
            />
          </div>
          
          <div>
            <Label htmlFor="expected_salary">Stipendio Desiderato (€)</Label>
            <Input
              id="expected_salary"
              type="number"
              value={formData.expected_salary}
              onChange={(e) => onChange('expected_salary', e.target.value)}
              placeholder="50000"
              min="0"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="recruiter_fee_percentage">Commissione Recruiter (%)</Label>
          <Input
            id="recruiter_fee_percentage"
            type="number"
            value={formData.recruiter_fee_percentage}
            onChange={(e) => onChange('recruiter_fee_percentage', e.target.value)}
            placeholder="15"
            min="0"
            max="50"
          />
        </div>
      </div>
    </div>
  );
};
