
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CVUploadWithAnonymization } from "@/components/cv/CVUploadWithAnonymization";

interface ProposalFormFieldsProps {
  formData: {
    candidate_name: string;
    candidate_email: string;
    candidate_phone: string;
    candidate_linkedin: string;
    years_experience: string;
    current_salary: string;
    expected_salary: string;
    availability_weeks: string;
    recruiter_fee_percentage: string;
    proposal_description: string;
    recruiter_name: string;
    recruiter_email: string;
    recruiter_phone: string;
    candidate_cv_url: string;
  };
  onInputChange: (field: string, value: string) => void;
}

function ProposalFormFields({ formData, onInputChange }: ProposalFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Informazioni Candidato */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Informazioni Candidato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="candidate_name">Nome Completo *</Label>
            <Input
              id="candidate_name"
              value={formData.candidate_name}
              onChange={(e) => onInputChange("candidate_name", e.target.value)}
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
              onChange={(e) => onInputChange("candidate_email", e.target.value)}
              placeholder="mario.rossi@email.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="candidate_phone">Telefono</Label>
            <Input
              id="candidate_phone"
              value={formData.candidate_phone}
              onChange={(e) => onInputChange("candidate_phone", e.target.value)}
              placeholder="+39 123 456 7890"
            />
          </div>
          <div>
            <Label htmlFor="candidate_linkedin">LinkedIn</Label>
            <Input
              id="candidate_linkedin"
              value={formData.candidate_linkedin}
              onChange={(e) => onInputChange("candidate_linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/mario-rossi"
            />
          </div>
        </div>
      </div>

      {/* CV Upload */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Curriculum Vitae</h3>
        <CVUploadWithAnonymization
          onCVUploaded={(url) => onInputChange("candidate_cv_url", url)}
          onAnonymizedCVReady={(url) => onInputChange("candidate_cv_anonymized_url", url)}
        />
      </div>

      {/* Informazioni Professionali */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Informazioni Professionali</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="years_experience">Anni di Esperienza</Label>
            <Input
              id="years_experience"
              type="number"
              value={formData.years_experience}
              onChange={(e) => onInputChange("years_experience", e.target.value)}
              placeholder="5"
              min="0"
              max="50"
            />
          </div>
          <div>
            <Label htmlFor="current_salary">Salario Attuale (€)</Label>
            <Input
              id="current_salary"
              type="number"
              value={formData.current_salary}
              onChange={(e) => onInputChange("current_salary", e.target.value)}
              placeholder="50000"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="expected_salary">Salario Desiderato (€)</Label>
            <Input
              id="expected_salary"
              type="number"
              value={formData.expected_salary}
              onChange={(e) => onInputChange("expected_salary", e.target.value)}
              placeholder="55000"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="availability_weeks">Disponibilità (settimane)</Label>
            <Input
              id="availability_weeks"
              type="number"
              value={formData.availability_weeks}
              onChange={(e) => onInputChange("availability_weeks", e.target.value)}
              placeholder="4"
              min="0"
              max="52"
            />
          </div>
        </div>
      </div>

      {/* Descrizione Proposta */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Descrizione della Proposta</h3>
        <div>
          <Label htmlFor="proposal_description">Descrizione del Candidato *</Label>
          <Textarea
            id="proposal_description"
            value={formData.proposal_description}
            onChange={(e) => onInputChange("proposal_description", e.target.value)}
            placeholder="Descrivi il candidato, le sue competenze, esperienze rilevanti e perché è adatto per questa posizione..."
            rows={4}
            required
          />
        </div>
      </div>

      {/* Informazioni Recruiter */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Informazioni Recruiter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recruiter_name">Nome Recruiter *</Label>
            <Input
              id="recruiter_name"
              value={formData.recruiter_name}
              onChange={(e) => onInputChange("recruiter_name", e.target.value)}
              placeholder="Il tuo nome completo"
              required
            />
          </div>
          <div>
            <Label htmlFor="recruiter_email">Email Recruiter *</Label>
            <Input
              id="recruiter_email"
              type="email"
              value={formData.recruiter_email}
              onChange={(e) => onInputChange("recruiter_email", e.target.value)}
              placeholder="tua@email.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="recruiter_phone">Telefono Recruiter</Label>
            <Input
              id="recruiter_phone"
              value={formData.recruiter_phone}
              onChange={(e) => onInputChange("recruiter_phone", e.target.value)}
              placeholder="+39 123 456 7890"
            />
          </div>
          <div>
            <Label htmlFor="recruiter_fee_percentage">Commissione (%)</Label>
            <Input
              id="recruiter_fee_percentage"
              type="number"
              value={formData.recruiter_fee_percentage}
              onChange={(e) => onInputChange("recruiter_fee_percentage", e.target.value)}
              placeholder="15"
              min="1"
              max="30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProposalFormFields;
export { ProposalFormFields };
