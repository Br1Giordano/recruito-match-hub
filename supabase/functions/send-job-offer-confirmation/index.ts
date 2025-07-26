import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface JobOfferConfirmationRequest {
  company_email: string;
  company_name: string;
  job_title: string;
  job_location: string;
  employment_type: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Sending job offer confirmation...");
    
    const { 
      company_email, 
      company_name, 
      job_title, 
      job_location, 
      employment_type 
    }: JobOfferConfirmationRequest = await req.json();

    console.log("Job offer details:", {
      company_email,
      company_name,
      job_title,
      job_location,
      employment_type
    });

    const emailResponse = await resend.emails.send({
      from: "RecruiterConnect <onboarding@resend.dev>",
      to: [company_email],
      subject: "Offerta di lavoro pubblicata con successo",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; margin-bottom: 20px;">Offerta pubblicata con successo!</h1>
          
          <p>Gentile <strong>${company_name}</strong>,</p>
          
          <p>La vostra offerta di lavoro è stata pubblicata con successo sulla piattaforma RecruiterConnect.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Dettagli dell'offerta:</h3>
            <p><strong>Posizione:</strong> ${job_title}</p>
            <p><strong>Località:</strong> ${job_location}</p>
            <p><strong>Tipo di impiego:</strong> ${employment_type}</p>
          </div>
          
          <p>I recruiter qualificati potranno ora vedere la vostra offerta e inviarvi proposte di candidati adatti.</p>
          
          <p>Riceverete notifiche via email ogni volta che un recruiter invierà una proposta per questa posizione.</p>
          
          <p style="margin-top: 30px;">
            Cordiali saluti,<br>
            <strong>Il team di RecruiterConnect</strong>
          </p>
        </div>
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
    console.error("Error in send-job-offer-confirmation function:", error);
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