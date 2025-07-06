// supabase/functions/send-referral-email/index.ts
import { Resend } from "npm:resend@1.1.0";

// Define CORS headers to allow requests from your website
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

console.log('✅ "send-referral-email" function initialized');

Deno.serve(async (req) => {
  // Respond to CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Initialize Resend with the secret API key from your Supabase secrets
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    // 2. Get the data from the request sent by the frontend
    const { to, referrerName, personalMessage, referralLink } = await req.json();
    console.log(`📨 Received request to send email to: ${to}`);

    // 3. Validate that we received all the necessary data
    if (!to || !referrerName || !referralLink) {
      throw new Error("Missing required fields: 'to', 'referrerName', or 'referralLink'");
    }

    // 4. Create the beautiful HTML for the email body
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #002D72; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">COLONAiVE</h1>
          <h2 style="margin: 10px 0 0; font-size: 32px; font-weight: bold;">You're Invited to Join Our Movement!</h2>
          <p style="margin: 5px 0 0; font-size: 16px;">Outsmart Colorectal Cancer Together</p>
        </div>
        <div style="padding: 20px;">
          <h3 style="font-size: 20px;">Hi there,</h3>
          <p style="font-size: 16px;">
            <b>${referrerName}</b> has personally invited you to join <b>COLONAiVE</b>, Singapore's national movement to outsmart colorectal cancer through awareness, education, and early detection.
          </p>
          ${personalMessage ? `<p style="font-size: 16px; border-left: 3px solid #ccc; padding-left: 15px; font-style: italic;">${personalMessage}</p>` : ''}
          <h3 style="font-size: 20px; margin-top: 30px;">Why Join COLONAiVE?</h3>
          <ul style="font-size: 16px; line-height: 1.6;">
            <li>Learn life-saving facts about colorectal cancer prevention</li>
            <li>Access screening resources and find clinics near you</li>
            <li>Join a growing community of health-conscious Singaporeans</li>
            <li>Help spread awareness and potentially save lives</li>
            <li>Track your health journey with our interactive tools</li>
          </ul>
          <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
            <p style="margin: 0; font-size: 16px;">
              <b>Did you know?</b> Colorectal cancer is the #1 cancer in Singapore, but it's also one of the most preventable. With early detection, up to 90% of cases can be prevented or successfully treated.
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${referralLink}" style="background-color: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">
              Join COLONAiVE Now
            </a>
          </div>
          <p style="text-align: center; font-size: 16px;">Together, we can change Singapore's cancer statistics, one person at a time.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d;">
          <p>QUESTIONS? Visit us at <a href="https://www.colonaive.ai" style="color: #002D72;">colonaive.ai</a></p>
          <p>© 2025 COLONAiVE. A National Movement to Outsmart Colorectal Cancer.</p>
        </div>
      </div>
    `;

    // 5. Use the Resend SDK to send the email
    const { data, error } = await resend.emails.send({
      from: 'COLONAiVE <info@colonaive.ai>',
      to: [to],
      subject: `${referrerName} has invited you to join COLONAiVE™!`,
      html: html,
      reply_to: 'info@colonaive.ai',
    });

    if (error) {
      console.error('Resend Error:', error);
      throw error;
    }
    
    console.log('🎉 Email sent successfully!', data);
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});