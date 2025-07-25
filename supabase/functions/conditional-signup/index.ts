import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignupRequest {
  email: string;
  password: string;
  userType: 'recruiter' | 'company';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, userType }: SignupRequest = await req.json();

    // Validate input
    if (!email || !password || !userType) {
      return new Response(
        JSON.stringify({ error: 'Email, password e tipo utente sono obbligatori' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if email ends with .recruito@gmail.com
    const isTestEmail = email.endsWith('.recruito@gmail.com');
    
    console.log(`Processing signup for ${email}, isTestEmail: ${isTestEmail}`);

    if (isTestEmail) {
      // For test emails, create user directly with admin client and auto-confirm
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          user_type: userType
        }
      });

      if (authError) {
        console.error('Error creating test user:', authError);
        return new Response(
          JSON.stringify({ error: authError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Test user created and auto-confirmed:', authData.user?.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Account creato e confermato automaticamente per test',
          user: authData.user
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      // For regular emails, use normal signup flow with email confirmation
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      );

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType
          },
          emailRedirectTo: 'https://recruito.eu/'
        }
      });

      if (error) {
        console.error('Error signing up regular user:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Regular user signup initiated:', data.user?.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Controlla la tua email per confermare l\'account',
          user: data.user
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: any) {
    console.error('Error in conditional-signup function:', error);
    return new Response(
      JSON.stringify({ error: 'Errore interno del server' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);