import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusUpdateRequest {
  type: 'profile_approved' | 'profile_rejected' | 'system_notification';
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
    const { type, email, name, userType, data }: StatusUpdateRequest = await req.json();

    console.log("Sending status update email:", { type, email, userType });

    let subject = "";
    let emailContent = "";

    switch (type) {
      case 'profile_approved':
        subject = userType === 'recruiter' 
          ? "✅ Profilo Recruiter approvato - Benvenuto in Recruito!"
          : "✅ Profilo Azienda approvato - Benvenuto in Recruito!";
        
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #10b981; text-align: center; margin-bottom: 30px;">
                ✅ Profilo Approvato!
              </h1>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Ciao ${name || 'utente'},
              </p>
              
              <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px; color: #047857;">
                  <strong>🎉 Congratulazioni!</strong> Il tuo profilo ${userType === 'recruiter' ? 'recruiter' : 'aziendale'} è stato approvato 
                  e ora puoi accedere a tutte le funzionalità di Recruito!
                </p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #374151; margin-bottom: 10px;">🚀 Ora puoi:</h3>
                <ul style="color: #6b7280; line-height: 1.8;">
                  ${userType === 'recruiter' 
                    ? `
                    <li><strong>Inviare proposte:</strong> Proponi i tuoi migliori candidati</li>
                    <li><strong>Visualizzare offerte:</strong> Accedi al database delle job offer</li>
                    <li><strong>Gestire candidature:</strong> Monitora lo stato delle tue proposte</li>
                    <li><strong>Costruire relazioni:</strong> Collabora con le aziende partner</li>
                    `
                    : `
                    <li><strong>Pubblicare offerte:</strong> Crea annunci di lavoro</li>
                    <li><strong>Ricevere proposte:</strong> Valuta candidati da recruiter qualificati</li>
                    <li><strong>Gestire candidature:</strong> Organizza il processo di selezione</li>
                    <li><strong>Accedere ai talenti:</strong> Trova i profili che cerchi</li>
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
                  🎯 Inizia Ora
                </a>
              </div>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0ea5e9; margin-top: 0;">💡 Suggerimenti per iniziare:</h3>
                <p style="color: #0284c7; margin-bottom: 0;">
                  ${userType === 'recruiter' 
                    ? 'Completa il tuo profilo con foto e specializzazioni, poi inizia a esplorare le offerte di lavoro disponibili!'
                    : 'Pubblica la tua prima offerta di lavoro e inizia a ricevere proposte da recruiter qualificati!'
                  }
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">
                  Benvenuto nella community di Recruito!
                </p>
              </div>
            </div>
          </div>
        `;
        break;

      case 'profile_rejected':
        subject = "❌ Profilo non approvato - Recruito";
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #ef4444; text-align: center; margin-bottom: 30px;">
                ❌ Profilo non approvato
              </h1>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Ciao ${name || 'utente'},
              </p>
              
              <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px; color: #dc2626;">
                  <strong>Informazione importante:</strong> Il tuo profilo ${userType === 'recruiter' ? 'recruiter' : 'aziendale'} 
                  non è stato approvato per l'accesso a Recruito.
                </p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #374151; margin-bottom: 10px;">📋 Motivi comuni:</h3>
                <ul style="color: #6b7280; line-height: 1.8;">
                  <li><strong>Informazioni incomplete:</strong> Mancano dettagli essenziali</li>
                  <li><strong>Documentazione insufficiente:</strong> Serve più evidenza della tua attività</li>
                  <li><strong>Requisiti non soddisfatti:</strong> Non rispetti i criteri di qualità</li>
                  <li><strong>Informazioni non verificabili:</strong> Impossibile confermare i dati</li>
                </ul>
              </div>
              
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #d97706; margin-top: 0;">💡 Cosa puoi fare:</h3>
                <p style="color: #92400e; margin-bottom: 0;">
                  ${data?.message || 'Contatta il nostro supporto per maggiori informazioni sui motivi del rifiuto e su come migliorare la tua candidatura.'}
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:support@recruito.eu" 
                   style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                  📧 Contatta il Supporto
                </a>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">
                  Ricevi questa email dal team di moderazione di Recruito
                </p>
              </div>
            </div>
          </div>
        `;
        break;

      case 'system_notification':
        subject = data?.subject || "📢 Notifica sistema - Recruito";
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #6366f1; text-align: center; margin-bottom: 30px;">
                📢 Notifica Sistema
              </h1>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Ciao ${name || 'utente'},
              </p>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px; color: #4f46e5;">
                  ${data?.message || 'Hai ricevuto una notifica di sistema da Recruito.'}
                </p>
              </div>
              
              ${data?.action_url ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.action_url}" 
                   style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                  ${data.action_text || '🚀 Vai alla Dashboard'}
                </a>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">
                  Ricevi questa email dal sistema di notifiche di Recruito
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

    console.log("Status update email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Status update email sent successfully",
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
    console.error("Error in send-status-update function:", error);
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