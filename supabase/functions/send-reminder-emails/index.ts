import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReminderEmailRequest {
  type: 'incomplete_profile' | 'pending_proposals' | 'follow_up';
  email: string;
  name?: string;
  userType: 'recruiter' | 'company';
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, name, userType, data }: ReminderEmailRequest = await req.json();

    console.log("Sending reminder email:", { type, email, userType });

    let subject = "";
    let emailContent = "";

    switch (type) {
      case 'incomplete_profile':
        subject = userType === 'recruiter' 
          ? "⏰ Completa il tuo profilo Recruiter su Recruito"
          : "⏰ Completa il profilo della tua azienda su Recruito";
        
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #f59e0b; text-align: center; margin-bottom: 30px;">
                ⏰ Completa il tuo profilo
              </h1>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Ciao ${name || 'utente'},
              </p>
              
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px; color: #92400e;">
                  Abbiamo notato che il tuo profilo ${userType === 'recruiter' ? 'recruiter' : 'aziendale'} non è ancora completo. 
                  Completarlo ti aiuterà a ${userType === 'recruiter' ? 'ottenere più opportunità' : 'trovare i migliori talenti'}!
                </p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #374151; margin-bottom: 10px;">✨ Vantaggi di un profilo completo:</h3>
                <ul style="color: #6b7280; line-height: 1.8;">
                  ${userType === 'recruiter' 
                    ? `
                    <li><strong>Maggiore visibilità:</strong> Le aziende potranno trovare e contattare te</li>
                    <li><strong>Credibilità:</strong> Un profilo completo aumenta la fiducia</li>
                    <li><strong>Migliori opportunità:</strong> Accesso a posizioni esclusive</li>
                    <li><strong>Specializzazioni:</strong> Mostra le tue aree di expertise</li>
                    `
                    : `
                    <li><strong>Attrattività:</strong> Attira i migliori recruiter</li>
                    <li><strong>Dettagli aziendali:</strong> Mostra la cultura e i valori aziendali</li>
                    <li><strong>Visibilità:</strong> Aumenta la tua presenza nel marketplace</li>
                    <li><strong>Fiducia:</strong> Profili completi generano più interesse</li>
                    `
                  }
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://recruito.eu/dashboard" 
                   style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                  📝 Completa il Profilo
                </a>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">
                  Ricevi questa email perché hai un profilo incompleto su Recruito
                </p>
              </div>
            </div>
          </div>
        `;
        break;

      case 'pending_proposals':
        subject = "📋 Hai proposte in attesa di risposta - Recruito";
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #3b82f6; text-align: center; margin-bottom: 30px;">
                📋 Proposte in attesa
              </h1>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Ciao ${name || 'utente'},
              </p>
              
              <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px; color: #1e40af;">
                  <strong>Promemoria:</strong> Hai ${data?.count || 'alcune'} proposte in attesa di risposta. 
                  I recruiter sono in attesa di un tuo feedback!
                </p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #374151; margin-bottom: 10px;">⚡ Azioni rapide:</h3>
                <ul style="color: #6b7280; line-height: 1.8;">
                  <li><strong>Rivedi le proposte:</strong> Valuta i candidati proposti</li>
                  <li><strong>Cambia stato:</strong> Approva, rifiuta o metti in revisione</li>
                  <li><strong>Contatta i recruiter:</strong> Per ulteriori informazioni</li>
                  <li><strong>Feedback:</strong> Lascia commenti utili per i recruiter</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://recruito.eu/dashboard" 
                   style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                  📋 Gestisci Proposte
                </a>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">
                  Ricevi questa email perché hai proposte in attesa su Recruito
                </p>
              </div>
            </div>
          </div>
        `;
        break;

      case 'follow_up':
        subject = "🚀 Come va la tua esperienza su Recruito?";
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #10b981; text-align: center; margin-bottom: 30px;">
                🚀 Come va la tua esperienza?
              </h1>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Ciao ${name || 'utente'},
              </p>
              
              <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px; color: #047857;">
                  <strong>Feedback:</strong> Ci piacerebbe sapere come sta andando la tua esperienza su Recruito. 
                  Il tuo feedback è prezioso per migliorare la piattaforma!
                </p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #374151; margin-bottom: 10px;">💡 Suggerimenti per il successo:</h3>
                <ul style="color: #6b7280; line-height: 1.8;">
                  ${userType === 'recruiter' 
                    ? `
                    <li><strong>Profilo completo:</strong> Aggiorna regolarmente le tue informazioni</li>
                    <li><strong>Candidati di qualità:</strong> Proponi solo i migliori match</li>
                    <li><strong>Comunicazione:</strong> Mantieni contatti regolari con le aziende</li>
                    <li><strong>Feedback:</strong> Chiedi sempre feedback sulle tue proposte</li>
                    `
                    : `
                    <li><strong>Descrizioni dettagliate:</strong> Sii specifico nelle job description</li>
                    <li><strong>Feedback tempestivo:</strong> Rispondi velocemente alle proposte</li>
                    <li><strong>Criteri chiari:</strong> Comunica chiaramente i tuoi requisiti</li>
                    <li><strong>Relazioni:</strong> Costruisci rapporti di lungo termine con i recruiter</li>
                    `
                  }
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://recruito.eu/dashboard" 
                   style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                  🚀 Accedi alla Dashboard
                </a>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">
                  Ricevi questa email perché sei un utente registrato su Recruito
                </p>
              </div>
            </div>
          </div>
        `;
        break;
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Recruito <noreply@recruito.eu>",
      to: email,
      subject: subject,
      html: emailContent,
    });

    console.log("Reminder email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Reminder email sent successfully",
        emailId: emailResponse.data?.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-reminder-emails function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);