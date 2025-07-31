import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCompanyFiscalData, CompanyFiscalData } from '@/hooks/useCompanyFiscalData';
import { 
  validateCodiceFiscale, 
  validatePartitaIva, 
  validateIban, 
  validatePec, 
  validateCap, 
  validateProvincia, 
  validateCodiceSdi,
  isFiscalDataComplete
} from '@/utils/fiscalValidation';
import { sanitizeFormData } from '@/utils/inputSanitizer';

interface CompanyFiscalDataFormProps {
  companyId: string;
}

export default function CompanyFiscalDataForm({ companyId }: CompanyFiscalDataFormProps) {
  const { fiscalData, loading, saveFiscalData, fetchFiscalData } = useCompanyFiscalData();
  
  const [formData, setFormData] = useState<Omit<CompanyFiscalData, 'id' | 'created_at' | 'updated_at' | 'company_id'>>({
    codice_fiscale: '',
    partita_iva: '',
    ragione_sociale: '',
    codice_sdi: '',
    pec: '',
    indirizzo_fatturazione: '',
    cap_fatturazione: '',
    citta_fatturazione: '',
    provincia_fatturazione: '',
    iban: '',
    swift: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (companyId) {
      fetchFiscalData(companyId);
    }
  }, [companyId]);

  useEffect(() => {
    if (fiscalData) {
      setFormData({
        codice_fiscale: fiscalData.codice_fiscale || '',
        partita_iva: fiscalData.partita_iva || '',
        ragione_sociale: fiscalData.ragione_sociale || '',
        codice_sdi: fiscalData.codice_sdi || '',
        pec: fiscalData.pec || '',
        indirizzo_fatturazione: fiscalData.indirizzo_fatturazione || '',
        cap_fatturazione: fiscalData.cap_fatturazione || '',
        citta_fatturazione: fiscalData.citta_fatturazione || '',
        provincia_fatturazione: fiscalData.provincia_fatturazione || '',
        iban: fiscalData.iban || '',
        swift: fiscalData.swift || '',
      });
    }
  }, [fiscalData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.codice_fiscale?.trim()) {
      newErrors.codice_fiscale = 'Il Codice Fiscale è obbligatorio';
    } else if (!validateCodiceFiscale(formData.codice_fiscale)) {
      newErrors.codice_fiscale = 'Formato Codice Fiscale non valido';
    }

    if (!formData.partita_iva?.trim()) {
      newErrors.partita_iva = 'La Partita IVA è obbligatoria';
    } else if (!validatePartitaIva(formData.partita_iva)) {
      newErrors.partita_iva = 'Formato Partita IVA non valido';
    }

    if (!formData.ragione_sociale?.trim()) {
      newErrors.ragione_sociale = 'La Ragione Sociale è obbligatoria';
    }

    if (!formData.indirizzo_fatturazione?.trim()) {
      newErrors.indirizzo_fatturazione = 'L\'indirizzo di fatturazione è obbligatorio';
    }

    if (!formData.cap_fatturazione?.trim()) {
      newErrors.cap_fatturazione = 'Il CAP è obbligatorio';
    } else if (!validateCap(formData.cap_fatturazione)) {
      newErrors.cap_fatturazione = 'Formato CAP non valido (5 cifre)';
    }

    if (!formData.citta_fatturazione?.trim()) {
      newErrors.citta_fatturazione = 'La città è obbligatoria';
    }

    if (!formData.provincia_fatturazione?.trim()) {
      newErrors.provincia_fatturazione = 'La provincia è obbligatoria';
    } else if (!validateProvincia(formData.provincia_fatturazione)) {
      newErrors.provincia_fatturazione = 'Formato provincia non valido (2 lettere)';
    }

    // Optional fields validation
    if (formData.pec && !validatePec(formData.pec)) {
      newErrors.pec = 'Formato PEC non valido';
    }

    if (formData.iban && !validateIban(formData.iban)) {
      newErrors.iban = 'Formato IBAN non valido';
    }

    if (formData.codice_sdi && !validateCodiceSdi(formData.codice_sdi)) {
      newErrors.codice_sdi = 'Formato Codice SDI non valido (7 caratteri)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Sanitize form data - only include fields that exist in formData
      const sanitizableData = {
        codice_fiscale: formData.codice_fiscale || '',
        partita_iva: formData.partita_iva || '',
        ragione_sociale: formData.ragione_sociale || '',
        codice_sdi: formData.codice_sdi || '',
        pec: formData.pec || '',
        indirizzo_fatturazione: formData.indirizzo_fatturazione || '',
        cap_fatturazione: formData.cap_fatturazione || '',
        citta_fatturazione: formData.citta_fatturazione || '',
        provincia_fatturazione: formData.provincia_fatturazione || '',
        iban: formData.iban || '',
        swift: formData.swift || '',
      };

      const schema = {
        codice_fiscale: { maxLength: 16, type: 'text' as const },
        partita_iva: { maxLength: 11, type: 'text' as const },
        ragione_sociale: { maxLength: 255, type: 'text' as const },
        codice_sdi: { maxLength: 7, type: 'text' as const },
        pec: { maxLength: 255, type: 'email' as const },
        indirizzo_fatturazione: { maxLength: 500, type: 'text' as const },
        cap_fatturazione: { maxLength: 5, type: 'text' as const },
        citta_fatturazione: { maxLength: 100, type: 'text' as const },
        provincia_fatturazione: { maxLength: 2, type: 'text' as const },
        iban: { maxLength: 34, type: 'text' as const },
        swift: { maxLength: 11, type: 'text' as const },
      };

      const { sanitized, errors: sanitizationErrors } = sanitizeFormData(sanitizableData, schema);
      
      if (Object.keys(sanitizationErrors).length > 0) {
        setErrors(sanitizationErrors);
        return;
      }

      await saveFiscalData(companyId, {
        ...sanitized,
        codice_fiscale: sanitized.codice_fiscale?.toUpperCase(),
        provincia_fatturazione: sanitized.provincia_fatturazione?.toUpperCase(),
        codice_sdi: sanitized.codice_sdi?.toUpperCase(),
        iban: sanitized.iban?.toUpperCase().replace(/\s/g, ''),
      });
      
    } catch (error) {
      console.error('Error saving fiscal data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = isFiscalDataComplete(formData);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status indicator */}
      <Alert className={isComplete ? "border-success" : "border-warning"}>
        {isComplete ? (
          <CheckCircle2 className="h-4 w-4 text-success" />
        ) : (
          <AlertCircle className="h-4 w-4 text-warning" />
        )}
        <AlertDescription>
          {isComplete 
            ? "Tutti i dati fiscali obbligatori sono stati inseriti"
            : "Alcuni dati fiscali obbligatori sono mancanti"
          }
        </AlertDescription>
      </Alert>

      {/* Dati fiscali principali */}
      <Card>
        <CardHeader>
          <CardTitle>Dati Fiscali Principali</CardTitle>
          <CardDescription>
            Informazioni fiscali obbligatorie per la fatturazione
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codice_fiscale">Codice Fiscale *</Label>
              <Input
                id="codice_fiscale"
                value={formData.codice_fiscale}
                onChange={(e) => handleChange('codice_fiscale', e.target.value)}
                placeholder="RSSMRA80A01H501U"
                maxLength={16}
                className={errors.codice_fiscale ? 'border-destructive' : ''}
              />
              {errors.codice_fiscale && (
                <p className="text-sm text-destructive">{errors.codice_fiscale}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="partita_iva">Partita IVA *</Label>
              <Input
                id="partita_iva"
                value={formData.partita_iva}
                onChange={(e) => handleChange('partita_iva', e.target.value)}
                placeholder="12345678901"
                maxLength={11}
                className={errors.partita_iva ? 'border-destructive' : ''}
              />
              {errors.partita_iva && (
                <p className="text-sm text-destructive">{errors.partita_iva}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ragione_sociale">Ragione Sociale *</Label>
            <Input
              id="ragione_sociale"
              value={formData.ragione_sociale}
              onChange={(e) => handleChange('ragione_sociale', e.target.value)}
              placeholder="Nome completo dell'azienda"
              className={errors.ragione_sociale ? 'border-destructive' : ''}
            />
            {errors.ragione_sociale && (
              <p className="text-sm text-destructive">{errors.ragione_sociale}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dati per fatturazione elettronica */}
      <Card>
        <CardHeader>
          <CardTitle>Fatturazione Elettronica</CardTitle>
          <CardDescription>
            Dati necessari per la fatturazione elettronica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codice_sdi">Codice SDI</Label>
              <Input
                id="codice_sdi"
                value={formData.codice_sdi}
                onChange={(e) => handleChange('codice_sdi', e.target.value)}
                placeholder="XXXXXXX"
                maxLength={7}
                className={errors.codice_sdi ? 'border-destructive' : ''}
              />
              {errors.codice_sdi && (
                <p className="text-sm text-destructive">{errors.codice_sdi}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pec">PEC</Label>
              <Input
                id="pec"
                type="email"
                value={formData.pec}
                onChange={(e) => handleChange('pec', e.target.value)}
                placeholder="azienda@pec.it"
                className={errors.pec ? 'border-destructive' : ''}
              />
              {errors.pec && (
                <p className="text-sm text-destructive">{errors.pec}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indirizzo fatturazione */}
      <Card>
        <CardHeader>
          <CardTitle>Indirizzo di Fatturazione</CardTitle>
          <CardDescription>
            Indirizzo dove inviare le fatture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="indirizzo_fatturazione">Indirizzo *</Label>
            <Textarea
              id="indirizzo_fatturazione"
              value={formData.indirizzo_fatturazione}
              onChange={(e) => handleChange('indirizzo_fatturazione', e.target.value)}
              placeholder="Via, numero civico, scala, interno..."
              className={errors.indirizzo_fatturazione ? 'border-destructive' : ''}
            />
            {errors.indirizzo_fatturazione && (
              <p className="text-sm text-destructive">{errors.indirizzo_fatturazione}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cap_fatturazione">CAP *</Label>
              <Input
                id="cap_fatturazione"
                value={formData.cap_fatturazione}
                onChange={(e) => handleChange('cap_fatturazione', e.target.value)}
                placeholder="00100"
                maxLength={5}
                className={errors.cap_fatturazione ? 'border-destructive' : ''}
              />
              {errors.cap_fatturazione && (
                <p className="text-sm text-destructive">{errors.cap_fatturazione}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="citta_fatturazione">Città *</Label>
              <Input
                id="citta_fatturazione"
                value={formData.citta_fatturazione}
                onChange={(e) => handleChange('citta_fatturazione', e.target.value)}
                placeholder="Roma"
                className={errors.citta_fatturazione ? 'border-destructive' : ''}
              />
              {errors.citta_fatturazione && (
                <p className="text-sm text-destructive">{errors.citta_fatturazione}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="provincia_fatturazione">Provincia *</Label>
              <Input
                id="provincia_fatturazione"
                value={formData.provincia_fatturazione}
                onChange={(e) => handleChange('provincia_fatturazione', e.target.value)}
                placeholder="RM"
                maxLength={2}
                className={errors.provincia_fatturazione ? 'border-destructive' : ''}
              />
              {errors.provincia_fatturazione && (
                <p className="text-sm text-destructive">{errors.provincia_fatturazione}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dati bancari */}
      <Card>
        <CardHeader>
          <CardTitle>Dati Bancari</CardTitle>
          <CardDescription>
            Coordinate bancarie per i pagamenti (opzionale)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={formData.iban}
                onChange={(e) => handleChange('iban', e.target.value)}
                placeholder="IT60 X054 2811 1010 0000 0123 456"
                className={errors.iban ? 'border-destructive' : ''}
              />
              {errors.iban && (
                <p className="text-sm text-destructive">{errors.iban}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="swift">Codice SWIFT/BIC</Label>
              <Input
                id="swift"
                value={formData.swift}
                onChange={(e) => handleChange('swift', e.target.value)}
                placeholder="BCITITMM"
                maxLength={11}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || isSubmitting}
          className="min-w-[120px]"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Salvando...' : 'Salva Dati'}
        </Button>
      </div>
    </form>
  );
}