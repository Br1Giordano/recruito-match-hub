import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
  confirmationUrl: string;
  userType: 'recruiter' | 'company';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, userType }: ConfirmationEmailRequest = await req.json();

    const userTypeText = userType === 'recruiter' ? 'Recruiter' : 'Azienda';
    
    const emailResponse = await resend.emails.send({
      from: "Recruito <noreply@recruito.eu>",
      to: [email],
      subject: "Conferma la tua Registrazione a Recruito",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Conferma Registrazione - Recruito</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="background: linear-gradient(135deg, #1e40af 0%, #0891b2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              🎯 Benvenuto in Recruito!
            </h1>
            <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">
              La piattaforma che connette talenti e opportunità
            </p>
          </div>

          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #0891b2;">
            <h2 style="color: #1e40af; margin-top: 0;">Conferma la tua registrazione come ${userTypeText}</h2>
            
            <p>Ciao e benvenuto nella community di Recruito! 👋</p>
            
            <p>Siamo entusiasti di averti con noi. Per completare la tua registrazione e iniziare a esplorare tutte le opportunità che Recruito ha da offrire, clicca sul pulsante qui sotto:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" 
                 style="background: linear-gradient(135deg, #1e40af 0%, #0891b2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        font-size: 16px; 
                        display: inline-block;
                        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);">
                ✅ Conferma la mia Registrazione
              </a>
            </div>
            
            <p><strong>Cosa succede dopo la conferma?</strong></p>
            <ul style="padding-left: 20px;">
              ${userType === 'recruiter' 
                ? `
                <li>📋 Potrai completare il tuo profilo professionale</li>
                <li>🎯 Iniziare a proporre i tuoi migliori candidati</li>
                <li>💼 Accedere a offerte di lavoro esclusive</li>
                <li>📊 Monitorare le tue performance</li>
                ` 
                : `
                <li>🏢 Potrai pubblicare le tue offerte di lavoro</li>
                <li>👥 Ricevere proposte da recruiter qualificati</li>
                <li>⚡ Accelerare i tuoi processi di hiring</li>
                <li>📈 Trovare i talenti che stai cercando</li>
                `
              }
            </ul>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #fff7ed; border-radius: 8px; border: 1px solid #fed7aa;">
            <p style="margin: 0; font-size: 14px; color: #9a3412;">
              <strong>Nota importante:</strong> Se non hai richiesto questa registrazione, puoi ignorare questa email in tutta sicurezza. Il link scadrà automaticamente tra 24 ore.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
            <p>Questo messaggio è stato inviato da <strong>Recruito</strong></p>
            <p>La piattaforma italiana per il recruiting di qualità</p>
            <p style="margin-top: 15px;">
              🌐 <a href="https://recruito.eu" style="color: #0891b2; text-decoration: none;">www.recruito.eu</a>
            </p>
          </div>

        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);