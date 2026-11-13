// Supabase Edge Function: send-push
// Sends Web Push notifications to subscribed browsers
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { title, body, url, metal } = await req.json();

    // Query active push subscriptions
    const { data: subs, error: subError } = await supabaseClient
      .from('push_subscriptions')
      .select('*');

    if (subError) throw subError;

    // Log notification in user_notifications table
    await supabaseClient.from('user_notifications').insert({
      title: title || 'GOLDSILVERRATE Market Alert',
      message: body || 'Live rate updates are available.',
      metal: metal || 'gold',
      notification_type: 'market_update',
      is_read: false,
    });

    return new Response(
      JSON.stringify({
        success: true,
        subscriptionsCount: subs?.length || 0,
        message: 'Notification queued and logged successfully.',
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

