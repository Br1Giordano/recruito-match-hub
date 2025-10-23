import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DemoRequestData {
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  nome_azienda?: string;
  messaggio?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: DemoRequestData = await req.json();
    console.log("Processing demo request for:", data.email);

    // Send confirmation email to the requester
    const confirmationEmail = await resend.emails.send({
      from: "Recruito <onboarding@resend.dev>",
      to: [data.email],
      subject: "Richiesta Demo Ricevuta - Recruito",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Grazie per il tuo interesse, ${data.nome}!</h1>
          <p style="font-size: 16px; color: #555;">
            Abbiamo ricevuto la tua richiesta di demo per Recruito.
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Dettagli della richiesta:</h2>
            <p><strong>Nome:</strong> ${data.nome} ${data.cognome}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.telefono ? `<p><strong>Telefono:</strong> ${data.telefono}</p>` : ''}
            ${data.nome_azienda ? `<p><strong>Azienda:</strong> ${data.nome_azienda}</p>` : ''}
            ${data.messaggio ? `<p><strong>Messaggio:</strong> ${data.messaggio}</p>` : ''}
          </div>
          <p style="font-size: 16px; color: #555;">
            Il nostro team ti contatterà a breve per organizzare la demo personalizzata.
          </p>
          <p style="font-size: 14px; color: #888; margin-top: 30px;">
            Cordiali saluti,<br>
            Il Team Recruito
          </p>
        </div>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail);

    // Send notification email to Recruito team
    const notificationEmail = await resend.emails.send({
      from: "Recruito Demo Requests <onboarding@resend.dev>",
      to: ["info@recruito.eu"], // Replace with actual team email
      subject: `Nuova Richiesta Demo - ${data.nome} ${data.cognome}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Nuova Richiesta Demo Ricevuta</h1>
          <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Dettagli del contatto:</h2>
            <p><strong>Nome:</strong> ${data.nome} ${data.cognome}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.telefono ? `<p><strong>Telefono:</strong> <a href="tel:${data.telefono}">${data.telefono}</a></p>` : ''}
            ${data.nome_azienda ? `<p><strong>Azienda:</strong> ${data.nome_azienda}</p>` : ''}
            ${data.messaggio ? `
              <div style="margin-top: 15px;">
                <strong>Messaggio:</strong>
                <p style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 5px;">${data.messaggio}</p>
              </div>
            ` : ''}
            <p style="font-size: 14px; color: #666; margin-top: 15px;">
              <strong>Data richiesta:</strong> ${new Date().toLocaleString('it-IT')}
            </p>
          </div>
          <p style="font-size: 14px; color: #888;">
            Questa email è stata generata automaticamente dal sistema di richiesta demo.
          </p>
        </div>
      `,
    });

    console.log("Notification email sent to team:", notificationEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        confirmationEmail, 
        notificationEmail 
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
    console.error("Error in send-demo-request function:", error);
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
