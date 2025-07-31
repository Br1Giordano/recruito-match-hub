import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/ui/file-upload";
import { useFileUpload } from "@/hooks/useFileUpload";

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

export default function ProposalFormFields({ formData, onInputChange }: ProposalFormFieldsProps) {
  const { uploadFile, isUploading } = useFileUpload();

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const url = await uploadFile(file, 'candidate-cvs');
      if (url) {
        onInputChange('candidate_cv_url', url);
      }
      return url;
    } catch (error) {
      console.error('Error uploading CV:', error);
      return null;
    }
  };

  const handleFileRemove = (url: string) => {
    onInputChange('candidate_cv_url', '');
  };

  return (
    <div className="space-y-6">
      {/* Sezione Candidato */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informazioni Candidato</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="candidate_name">Nome Candidato *</Label>
            <Input
              id="candidate_name"
              value={formData.candidate_name}
              onChange={(e) => onInputChange('candidate_name', e.target.value)}
              placeholder="Mario Rossi"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidate_email">Email Candidato *</Label>
            <Input
              id="candidate_email"
              type="email"
              value={formData.candidate_email}
              onChange={(e) => onInputChange('candidate_email', e.target.value)}
              placeholder="mario.rossi@email.com"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="candidate_phone">Telefono Candidato</Label>
            <Input
              id="candidate_phone"
              value={formData.candidate_phone}
              onChange={(e) => onInputChange('candidate_phone', e.target.value)}
              placeholder="+39 123 456 7890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidate_linkedin">LinkedIn Candidato</Label>
            <Input
              id="candidate_linkedin"
              value={formData.candidate_linkedin}
              onChange={(e) => onInputChange('candidate_linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/mario-rossi"
            />
          </div>
        </div>

        {/* Upload CV */}
        <div className="space-y-2">
          <Label>CV del Candidato</Label>
          <FileUpload
            onFileUpload={handleFileUpload}
            onFileRemove={handleFileRemove}
            currentFileUrl={formData.candidate_cv_url}
            isUploading={isUploading}
          />
        </div>
      </div>

      {/* Sezione Dettagli Professionali */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dettagli Professionali</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="years_experience">Anni di Esperienza</Label>
            <Input
              id="years_experience"
              type="number"
              min="0"
              max="50"
              value={formData.years_experience}
              onChange={(e) => onInputChange('years_experience', e.target.value)}
              placeholder="5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_salary">Salario Attuale (€)</Label>
            <Input
              id="current_salary"
              type="number"
              min="0"
              value={formData.current_salary}
              onChange={(e) => onInputChange('current_salary', e.target.value)}
              placeholder="50000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_salary">Salario Desiderato (€)</Label>
            <Input
              id="expected_salary"
              type="number"
              min="0"
              value={formData.expected_salary}
              onChange={(e) => onInputChange('expected_salary', e.target.value)}
              placeholder="55000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability_weeks">Disponibilità (settimane)</Label>
            <Input
              id="availability_weeks"
              type="number"
              min="0"
              max="52"
              value={formData.availability_weeks}
              onChange={(e) => onInputChange('availability_weeks', e.target.value)}
              placeholder="2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recruiter_fee_percentage">Percentuale Fee Recruiter (%)</Label>
          <Input
            id="recruiter_fee_percentage"
            type="number"
            min="1"
            max="30"
            value={formData.recruiter_fee_percentage}
            onChange={(e) => onInputChange('recruiter_fee_percentage', e.target.value)}
            placeholder="15"
          />
        </div>
      </div>

      {/* Sezione Descrizione */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Descrizione della Proposta</h3>
        <div className="space-y-2">
          <Label htmlFor="proposal_description">Descrizione Proposta</Label>
          <Textarea
            id="proposal_description"
            value={formData.proposal_description}
            onChange={(e) => onInputChange('proposal_description', e.target.value)}
            placeholder="Descrivi perché questo candidato è perfetto per la posizione..."
            className="min-h-[120px]"
          />
        </div>
      </div>

      {/* Sezione Recruiter */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informazioni Recruiter</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recruiter_name">Nome Recruiter *</Label>
            <Input
              id="recruiter_name"
              value={formData.recruiter_name}
              onChange={(e) => onInputChange('recruiter_name', e.target.value)}
              placeholder="Nome e Cognome"
              required
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recruiter_email">Email Recruiter *</Label>
            <Input
              id="recruiter_email"
              type="email"
              value={formData.recruiter_email}
              onChange={(e) => onInputChange('recruiter_email', e.target.value)}
              placeholder="email@recruiter.com"
              required
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recruiter_phone">Telefono Recruiter</Label>
          <Input
            id="recruiter_phone"
            value={formData.recruiter_phone}
            onChange={(e) => onInputChange('recruiter_phone', e.target.value)}
            placeholder="+39 123 456 7890"
            readOnly
            className="bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}