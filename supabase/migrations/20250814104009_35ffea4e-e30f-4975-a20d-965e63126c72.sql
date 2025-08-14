-- Contratti digitali
CREATE TABLE public.digital_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_type VARCHAR(50) NOT NULL, -- 'company_service', 'recruiter_collaboration', 'nda', 'dpa'
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  version VARCHAR(20) NOT NULL DEFAULT '1.0',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  template_data JSONB -- Per dati specifici del template
);

-- Contratti firmati
CREATE TABLE public.signed_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.digital_contracts(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_email VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL, -- 'company', 'recruiter'
  signature_data JSONB NOT NULL, -- Dati firma elettronica
  signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  contract_data JSONB, -- Snapshot del contratto al momento della firma
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'terminated', 'expired'
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Registro attività GDPR
CREATE TABLE public.gdpr_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email VARCHAR(255),
  activity_type VARCHAR(50) NOT NULL, -- 'data_access', 'data_deletion', 'data_export', 'consent_update'
  description TEXT NOT NULL,
  data_categories TEXT[], -- Categorie di dati coinvolti
  legal_basis VARCHAR(100), -- Base giuridica del trattamento
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_by UUID REFERENCES auth.users(id) -- Admin che ha processato la richiesta
);

-- Richieste GDPR
CREATE TABLE public.gdpr_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email VARCHAR(255) NOT NULL,
  request_type VARCHAR(50) NOT NULL, -- 'data_access', 'data_deletion', 'data_portability', 'rectification'
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'rejected'
  description TEXT,
  requested_data TEXT[], -- Specifiche categorie di dati richiesti
  response_data JSONB, -- Dati della risposta
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT
);

-- Template contrattuali
CREATE TABLE public.contract_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'service_agreement', 'privacy_policy', 'nda', 'collaboration'
  language VARCHAR(5) NOT NULL DEFAULT 'it',
  content TEXT NOT NULL,
  variables JSONB, -- Variabili sostituibili nel template
  is_mandatory BOOLEAN NOT NULL DEFAULT false,
  version VARCHAR(20) NOT NULL DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Notifiche legali
CREATE TABLE public.legal_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_type VARCHAR(50) NOT NULL, -- 'contract_expiry', 'gdpr_request', 'compliance_alert', 'terms_update'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target_audience VARCHAR(50) NOT NULL, -- 'all_users', 'companies', 'recruiters', 'admins', 'specific_user'
  target_user_id UUID REFERENCES auth.users(id),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Audit compliance
CREATE TABLE public.compliance_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_type VARCHAR(50) NOT NULL, -- 'gdpr_compliance', 'contract_management', 'data_retention'
  entity_type VARCHAR(50) NOT NULL, -- 'user', 'contract', 'data_processing'
  entity_id UUID,
  compliance_status VARCHAR(20) NOT NULL, -- 'compliant', 'non_compliant', 'requires_attention'
  findings TEXT[],
  recommendations TEXT[],
  audited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB
);

-- Enable RLS
ALTER TABLE public.digital_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signed_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies per digital_contracts
CREATE POLICY "Admins can manage all contracts" ON public.digital_contracts
FOR ALL USING (is_admin((auth.jwt() ->> 'email'::text)));

CREATE POLICY "Users can view active contracts" ON public.digital_contracts
FOR SELECT USING (is_active = true);

-- RLS Policies per signed_contracts
CREATE POLICY "Users can view their own signed contracts" ON public.signed_contracts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all signed contracts" ON public.signed_contracts
FOR SELECT USING (is_admin((auth.jwt() ->> 'email'::text)));

CREATE POLICY "Users can sign contracts" ON public.signed_contracts
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies per GDPR logs
CREATE POLICY "Admins can manage GDPR logs" ON public.gdpr_activity_log
FOR ALL USING (is_admin((auth.jwt() ->> 'email'::text)));

CREATE POLICY "Users can view their GDPR activity" ON public.gdpr_activity_log
FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies per GDPR requests
CREATE POLICY "Users can manage their GDPR requests" ON public.gdpr_requests
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all GDPR requests" ON public.gdpr_requests
FOR ALL USING (is_admin((auth.jwt() ->> 'email'::text)));

-- RLS Policies per contract templates
CREATE POLICY "Admins can manage contract templates" ON public.contract_templates
FOR ALL USING (is_admin((auth.jwt() ->> 'email'::text)));

CREATE POLICY "Users can view contract templates" ON public.contract_templates
FOR SELECT USING (true);

-- RLS Policies per legal notifications
CREATE POLICY "Users can view their notifications" ON public.legal_notifications
FOR SELECT USING (
  target_audience = 'all_users' OR
  (target_audience = 'companies' AND EXISTS(SELECT 1 FROM user_profiles WHERE auth_user_id = auth.uid() AND user_type = 'company')) OR
  (target_audience = 'recruiters' AND EXISTS(SELECT 1 FROM user_profiles WHERE auth_user_id = auth.uid() AND user_type = 'recruiter')) OR
  target_user_id = auth.uid()
);

CREATE POLICY "Users can mark notifications as read" ON public.legal_notifications
FOR UPDATE USING (
  target_audience = 'all_users' OR
  target_user_id = auth.uid()
);

CREATE POLICY "Admins can manage all notifications" ON public.legal_notifications
FOR ALL USING (is_admin((auth.jwt() ->> 'email'::text)));

-- RLS Policies per compliance audit
CREATE POLICY "Only admins can access compliance audit" ON public.compliance_audit_log
FOR ALL USING (is_admin((auth.jwt() ->> 'email'::text)));

-- Triggers per timestamp updates
CREATE TRIGGER update_digital_contracts_updated_at
BEFORE UPDATE ON public.digital_contracts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gdpr_requests_updated_at
BEFORE UPDATE ON public.gdpr_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contract_templates_updated_at
BEFORE UPDATE ON public.contract_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserimento dati iniziali per contract templates
INSERT INTO public.contract_templates (name, category, content, variables, is_mandatory) VALUES
('Contratto di Servizio Azienda', 'service_agreement', 
'CONTRATTO DI SERVIZIO RECRUITO

Tra {{company_name}}, con sede in {{company_address}}, P.IVA {{company_vat}}, di seguito denominata "Azienda", 
e Recruito S.r.l., con sede in [SEDE RECRUITO], P.IVA [P.IVA RECRUITO], di seguito denominata "Recruito",

SI CONVIENE E STIPULA QUANTO SEGUE:

Art. 1 - OGGETTO
Recruito si impegna a fornire servizi di intermediazione per la ricerca e selezione di personale specializzato.

Art. 2 - COMMISSIONI
La commissione dovuta è pari al {{commission_percentage}}% della retribuzione annua lorda del candidato selezionato.

Art. 3 - PAGAMENTO
Il pagamento della commissione avviene entro 30 giorni dalla data di assunzione del candidato.

Art. 4 - GARANZIA
Recruito garantisce la sostituzione gratuita del candidato entro 90 giorni dall''assunzione in caso di dimissioni o licenziamento.

Art. 5 - TRATTAMENTO DATI
Il trattamento dei dati personali avviene secondo il Regolamento UE 2016/679 (GDPR).

Art. 6 - FORO COMPETENTE
Per qualsiasi controversia è competente il Foro di [CITTÀ].

Data: {{contract_date}}

Firma Azienda: _________________
Firma Recruito: _________________',
'{"company_name": "text", "company_address": "text", "company_vat": "text", "commission_percentage": "number", "contract_date": "date"}',
true),

('Accordo Collaborazione Recruiter', 'collaboration',
'ACCORDO DI COLLABORAZIONE RECRUITER

Tra {{recruiter_name}}, C.F. {{recruiter_cf}}, nato/a il {{recruiter_birth_date}} a {{recruiter_birth_place}}, 
residente in {{recruiter_address}}, di seguito denominato/a "Collaboratore",
e Recruito S.r.l., con sede in [SEDE RECRUITO], P.IVA [P.IVA RECRUITO], di seguito denominata "Recruito",

SI CONVIENE E STIPULA QUANTO SEGUE:

Art. 1 - OGGETTO
Il Collaboratore si impegna a svolgere attività di ricerca e selezione di candidati per conto di Recruito.

Art. 2 - COMPENSO
Il compenso è determinato in base alle commissioni generate dalle proposte accettate, secondo la percentuale del {{recruiter_percentage}}%.

Art. 3 - MODALITÀ DI PAGAMENTO
I pagamenti vengono effettuati mensilmente, entro il 15 del mese successivo.

Art. 4 - RISERVATEZZA
Il Collaboratore si impegna a mantenere la massima riservatezza sui dati dei candidati e delle aziende clienti.

Art. 5 - DURATA
Il presente accordo ha durata indeterminata e può essere risolto da entrambe le parti con preavviso di 30 giorni.

Data: {{contract_date}}

Firma Collaboratore: _________________
Firma Recruito: _________________',
'{"recruiter_name": "text", "recruiter_cf": "text", "recruiter_birth_date": "date", "recruiter_birth_place": "text", "recruiter_address": "text", "recruiter_percentage": "number", "contract_date": "date"}',
true),

('Informativa Privacy Candidati', 'privacy_policy',
'INFORMATIVA PRIVACY PER CANDIDATI

In conformità al Regolamento UE 2016/679 (GDPR), La informiamo che:

TITOLARE DEL TRATTAMENTO: Recruito S.r.l.
FINALITÀ: Intermediazione per ricerca e selezione personale
DATI TRATTATI: CV, dati anagrafici, professionali e di contatto
BASE GIURIDICA: Consenso (art. 6.1.a GDPR) e legittimo interesse (art. 6.1.f GDPR)
CONSERVAZIONE: 24 mesi dalla raccolta
DIRITTI: Accesso, rettifica, cancellazione, limitazione, portabilità, opposizione

Per esercitare i Suoi diritti: privacy@recruito.eu

Consenso al trattamento: □ Acconsento
Data: {{consent_date}}
Firma: _________________',
'{"consent_date": "date"}',
false);