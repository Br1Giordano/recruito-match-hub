import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    console.log('AI Assistant request:', { action, data });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let response;

    switch (action) {
      case 'analyze_cv':
        response = await analyzeCVContent(data.cvText);
        break;
      case 'generate_proposal':
        response = await generateProposalSuggestion(data);
        break;
      case 'calculate_match_score':
        response = await calculateMatchScore(data);
        break;
      case 'generate_company_insights':
        response = await generateCompanyInsights(data);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeCVContent(cvText: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto HR che analizza CV. Estrai in modo strutturato:
          1. Competenze tecniche principali
          2. Anni di esperienza totali
          3. Settori di esperienza
          4. Livello di seniority (Junior/Mid/Senior)
          5. Punti di forza chiave
          
          Rispondi in formato JSON con queste chiavi: skills, experience_years, sectors, seniority_level, key_strengths`
        },
        { role: 'user', content: `Analizza questo CV: ${cvText}` }
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  const analysis = data.choices[0].message.content;
  
  try {
    return { analysis: JSON.parse(analysis) };
  } catch {
    return { analysis: { raw: analysis } };
  }
}

async function generateProposalSuggestion(requestData: any) {
  const { jobOffer, candidateAnalysis, recruiterContext } = requestData;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto recruiter che scrive proposte convincenti. 
          Crea una descrizione proposta professionale che evidenzi il match tra candidato e posizione.
          Usa un tono professionale ma umano. Lunghezza: 100-150 parole.
          Focus su: competenze rilevanti, esperienza pertinente, valore aggiunto per l'azienda.`
        },
        {
          role: 'user',
          content: `
          JOB OFFER:
          Titolo: ${jobOffer.title}
          Descrizione: ${jobOffer.description}
          Requisiti: ${jobOffer.requirements}
          Azienda: ${jobOffer.company_name}
          
          CANDIDATO ANALIZZATO:
          ${JSON.stringify(candidateAnalysis)}
          
          CONTESTO RECRUITER:
          Nome: ${recruiterContext.name}
          Esperienza: ${recruiterContext.experience}
          
          Genera una descrizione proposta personalizzata:`
        }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return { suggestion: data.choices[0].message.content };
}

async function calculateMatchScore(requestData: any) {
  const { jobOffer, candidateAnalysis } = requestData;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Calcola un match score da 0 a 100 tra candidato e posizione.
          Considera: competenze tecniche (40%), esperienza (30%), settore (20%), seniority (10%).
          Rispondi solo con JSON: {"score": numero, "reasoning": "breve spiegazione"}`
        },
        {
          role: 'user',
          content: `
          POSIZIONE: ${JSON.stringify(jobOffer)}
          CANDIDATO: ${JSON.stringify(candidateAnalysis)}
          `
        }
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return { score: 50, reasoning: "Analisi non disponibile" };
  }
}

async function generateCompanyInsights(requestData: any) {
  const { proposals } = requestData;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto HR che analizza proposte di candidati per le aziende.
          Per ogni proposta genera un JSON con:
          - proposal_id: ID della proposta
          - summary: riassunto candidato in 2-3 righe 
          - strengths: array di 3-4 punti di forza principali
          - interview_questions: array di 3-4 domande colloquio specifiche
          
          Rispondi SOLO con un array JSON valido, senza markdown o altro testo.`
        },
        {
          role: 'user',
          content: `Analizza queste ${proposals.length} proposte per la posizione "Sviluppatore Full Stack Junior":
          
          ${proposals.map((p: any, i: number) => `
          PROPOSTA ${i + 1}:
          - ID: ${p.id}
          - Candidato: ${p.candidate_name}
          - Esperienza: ${p.years_experience || 'Non specificata'} anni
          - Descrizione: ${p.proposal_description || 'Nessuna descrizione'}
          - Recruiter: ${p.recruiter_name}
          `).join('\n')}`
        }
      ],
      temperature: 0.5,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    // Try to parse as JSON array
    const insights = JSON.parse(content);
    return { insights: Array.isArray(insights) ? insights : [insights] };
  } catch (error) {
    console.error('Failed to parse AI response as JSON:', error);
    console.log('Raw AI response:', content);
    
    // Fallback: create basic insights
    const fallbackInsights = proposals.slice(0, 5).map((p: any) => ({
      proposal_id: p.id,
      summary: `${p.candidate_name} è un candidato per la posizione di Sviluppatore Full Stack Junior con ${p.years_experience || 'esperienza'} anni di esperienza.`,
      strengths: ['Esperienza rilevante', 'Competenze tecniche', 'Motivazione'],
      interview_questions: ['Parlami della tua esperienza con React', 'Come gestisci i progetti in team?', 'Quali sono i tuoi obiettivi professionali?']
    }));
    
    return { insights: fallbackInsights };
  }
}