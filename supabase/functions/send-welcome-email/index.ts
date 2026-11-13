// Supabase Edge Function: send-welcome-email
// Sends personalized transactional emails upon sign-in/registration without exposing API keys
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, displayName, isFirstTime, marketLink, websiteLink } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const subject = isFirstTime
      ? 'Welcome to GOLDSILVERRATE!'
      : 'Welcome Back to GOLDSILVERRATE!';

    const greeting = isFirstTime
      ? `Welcome to GOLDSILVERRATE, ${displayName}!`
      : `Welcome back to GOLDSILVERRATE, ${displayName}!`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #070d19; color: #ffffff; padding: 40px 20px; text-align: center;">
        <div style="max-width: 550px; margin: 0 auto; background-color: #0d1526; border: 1px solid #d4af3744; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <div style="margin-bottom: 20px;">
            <span style="font-size: 26px; font-weight: bold; color: #d4af37; letter-spacing: 1px;">GOLD&SILVER RATE</span>
          </div>
          <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 12px;">${greeting}</h2>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            ${isFirstTime 
              ? 'Thank you for creating your investor account. You now have access to verified spot rates, candlestick technical charts, Coimbatore jewellery benchmarks, and custom price alerts.' 
              : 'You have successfully signed in to your live bullion dashboard. Live market data and your price alerts are currently syncing.'}
          </p>
          <div style="margin: 28px 0;">
            <a href="${marketLink || 'https://goldsilverrate.netlify.app/dashboard'}" style="background: linear-gradient(135deg, #d4af37, #f5d47a); color: #000000; padding: 12px 28px; font-weight: bold; font-size: 14px; text-decoration: none; border-radius: 10px; display: inline-block;">
              Access Live Market Dashboard →
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
            Primary Benchmark Hub: Coimbatore, Tamil Nadu • Visit our portal at <a href="${websiteLink || '#'}" style="color: #d4af37; text-decoration: none;">GOLDSILVERRATE</a>
          </p>
        </div>
      </div>
    `;

    // Resend or SMTP integration if RESEND_API_KEY is configured in Supabase secrets
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'GOLDSILVERRATE <alerts@goldsilverrate.com>',
          to: [email],
          subject,
          html: htmlContent,
        }),
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Welcome notification processed for ${email}`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

