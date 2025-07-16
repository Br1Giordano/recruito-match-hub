import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProposalNotificationRequest {
  recipient_type: 'recruiter' | 'company';
  recruiter_email: string;
  recruiter_name: string;
  company_name: string;
  company_email: string;
  proposal_id: string;
  candidate_name: string;
  new_status: string;
  old_status?: string;
  proposal_description?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      recipient_type,
      recruiter_email,
      recruiter_name,
      company_name,
      company_email,
      proposal_id,
      candidate_name,
      new_status,
      old_status,
      proposal_description
    }: ProposalNotificationRequest = await req.json();

    console.log("Sending proposal notification:", {
      recipient_type,
      recruiter_email,
      company_email,
      company_name,
      new_status,
      candidate_name
    });

    // Determine recipient and email content
    let recipientEmail = "";
    let subject = "";
    let emailContent = "";

    if (recipient_type === "recruiter") {
      recipientEmail = recruiter_email;
      
      if (new_status === "pending" || (!old_status && new_status)) {
        subject = `📝 Nuova proposta ricevuta per ${candidate_name} - ${company_name}`;
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #0284FF; text-align: center; margin-bottom: 30px;">
                📝 Nuova Proposta Candidato
              </h1>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Ciao <strong>${recruiter_name}</strong>,
              </p>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0284FF; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px; color: #0369a1;">
                  <strong>Perfetto!</strong> La tua proposta per il candidato <strong>${candidate_name}</strong> è stata <strong>inviata con successo</strong> a <strong>${company_name}</strong>.
                </p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #374151; margin-bottom: 10px;">📋 Dettagli della proposta inviata:</h3>
                <ul style="color: #6b7280; line-height: 1.6;">
                  <li><strong>Candidato:</strong> ${candidate_name}</li>
                  <li><strong>Azienda:</strong> ${company_name}</li>
                  <li><strong>Status:</strong> In attesa di valutazione</li>
                  ${proposal_description ? `<li><strong>Descrizione:</strong> ${proposal_description}</li>` : ''}
                </ul>
              </div>
              
              <div style="background-color: #fefce8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #ca8a04; margin-top: 0;">⏳ Cosa succede ora?</h3>
                <p style="color: #a16207; margin-bottom: 0;">
                  L'azienda riceverà la tua proposta e inizierà il processo di valutazione. 
                  Ti terremo aggiornato su eventuali sviluppi!
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">
                  Ricevi questa email perché hai inviato una proposta tramite Recruito
                </p>
              </div>
            </div>
          </div>
        `;
      } else if (new_status === "under_review") {
        subject = `🔍 La tua proposta per ${candidate_name} è in valutazione - ${company_name}`;
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">
                📋 Aggiornamento Proposta
              </h1>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Ciao <strong>${recruiter_name}</strong>,
              </p>
              
              <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px; color: #1e40af;">
                  <strong>Ottima notizia!</strong> La tua proposta per il candidato <strong>${candidate_name}</strong> è ora <strong>in valutazione</strong> presso <strong>${company_name}</strong>.
                </p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #374151; margin-bottom: 10px;">📋 Dettagli della proposta:</h3>
                <ul style="color: #6b7280; line-height: 1.6;">
                  <li><strong>Candidato:</strong> ${candidate_name}</li>
                  <li><strong>Azienda:</strong> ${company_name}</li>
                  <li><strong>Status:</strong> In valutazione</li>
                  ${proposal_description ? `<li><strong>Descrizione:</strong> ${proposal_description}</li>` : ''}
                </ul>
              </div>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0ea5e9; margin-top: 0;">💡 Cosa succede ora?</h3>
                <p style="color: #0284c7; margin-bottom: 0;">
                  L'azienda sta valutando la tua proposta. Ti terremo aggiornato su eventuali sviluppi. 
                  Nel frattempo, preparati per eventuali richieste di informazioni aggiuntive.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">
                  Ricevi questa email perché hai inviato una proposta tramite Recruito
                </p>
              </div>
            </div>
          </div>
        `;
      } else if (new_status === "accepted") {
        subject = `🎉 Congratulazioni! La tua proposta per ${candidate_name} è stata ACCETTATA - ${company_name}`;
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #16a34a; text-align: center; margin-bottom: 30px;">
                🎉 PROPOSTA ACCETTATA!
              </h1>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Ciao <strong>${recruiter_name}</strong>,
              </p>
              
              <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px; color: #15803d;">
                  <strong>🎊 FANTASTICO!</strong> La tua proposta per il candidato <strong>${candidate_name}</strong> è stata <strong>ACCETTATA</strong> da <strong>${company_name}</strong>!
                </p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #374151; margin-bottom: 10px;">📋 Dettagli della proposta accettata:</h3>
                <ul style="color: #6b7280; line-height: 1.6;">
                  <li><strong>Candidato:</strong> ${candidate_name}</li>
                  <li><strong>Azienda:</strong> ${company_name}</li>
                  <li><strong>Status:</strong> ✅ Accettata</li>
                  ${proposal_description ? `<li><strong>Descrizione:</strong> ${proposal_description}</li>` : ''}
                </ul>
              </div>
              
              <div style="background-color: #fefce8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #ca8a04; margin-top: 0;">⚡ Prossimi passi:</h3>
                <p style="color: #a16207; margin-bottom: 0;">
                  L'azienda potrebbe contattarti presto per organizzare colloqui o discutere i dettagli. 
                  Preparati a coordinare il processo di selezione con ${company_name}.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">
                  Ricevi questa email perché hai inviato una proposta tramite Recruito
                </p>
              </div>
            </div>
          </div>
        `;
      } else if (new_status === "rejected") {
        subject = `❌ Aggiornamento proposta per ${candidate_name} - ${company_name}`;
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #dc2626; text-align: center; margin-bottom: 30px;">
                📋 Aggiornamento Proposta
              </h1>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Ciao <strong>${recruiter_name}</strong>,
              </p>
              
              <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px; color: #dc2626;">
                  Purtroppo la tua proposta per il candidato <strong>${candidate_name}</strong> non è stata selezionata da <strong>${company_name}</strong> per questa posizione.
                </p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #374151; margin-bottom: 10px;">📋 Dettagli della proposta:</h3>
                <ul style="color: #6b7280; line-height: 1.6;">
                  <li><strong>Candidato:</strong> ${candidate_name}</li>
                  <li><strong>Azienda:</strong> ${company_name}</li>
                  <li><strong>Status:</strong> ❌ Non selezionata</li>
                  ${proposal_description ? `<li><strong>Descrizione:</strong> ${proposal_description}</li>` : ''}
                </ul>
              </div>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0ea5e9; margin-top: 0;">💪 Non demordere!</h3>
                <p style="color: #0284c7; margin-bottom: 0;">
                  Ogni esperienza è un'opportunità per crescere. Continua a proporre i tuoi migliori candidati - 
                  il prossimo match potrebbe essere quello giusto!
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">
                  Ricevi questa email perché hai inviato una proposta tramite Recruito
                </p>
              </div>
            </div>
          </div>
        `;
      }
    } else if (recipient_type === "company") {
      recipientEmail = company_email;
      
      if (new_status === "pending" || (!old_status && new_status)) {
        subject = `📥 Nuova candidatura ricevuta: ${candidate_name} - Recruito`;
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #0284FF; text-align: center; margin-bottom: 30px;">
                📥 Nuova Candidatura
              </h1>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Gentile team di <strong>${company_name}</strong>,
              </p>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0284FF; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px; color: #0369a1;">
                  <strong>Ottima notizia!</strong> Hai ricevuto una nuova candidatura per il candidato <strong>${candidate_name}</strong> dal recruiter <strong>${recruiter_name}</strong>.
                </p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #374151; margin-bottom: 10px;">👤 Dettagli della candidatura:</h3>
                <ul style="color: #6b7280; line-height: 1.6;">
                  <li><strong>Candidato:</strong> ${candidate_name}</li>
                  <li><strong>Recruiter:</strong> ${recruiter_name}</li>
                  <li><strong>Status:</strong> In attesa di valutazione</li>
                  ${proposal_description ? `<li><strong>Descrizione:</strong> ${proposal_description}</li>` : ''}
                </ul>
              </div>
              
              <div style="background-color: #fefce8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #ca8a04; margin-top: 0;">⏳ Prossimi passi:</h3>
                <p style="color: #a16207; margin-bottom: 0;">
                  Accedi alla piattaforma Recruito per visualizzare tutti i dettagli della candidatura, 
                  il CV del candidato e per gestire lo stato della proposta.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">
                  Ricevi questa email perché la tua azienda è registrata su Recruito
                </p>
              </div>
            </div>
          </div>
        `;
      }
    }

    // Check if recipient email is valid
    if (!recipientEmail || recipientEmail.trim() === '') {
      console.error("No valid recipient email found:", { recipient_type, recruiter_email, company_email });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "No valid recipient email found"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Recruito <noreply@recruito.app>",
      to: recipientEmail,
      subject: subject,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification email sent successfully",
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
    console.error("Error in send-proposal-notification function:", error);
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