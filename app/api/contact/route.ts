
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = [
  'https://bizorvia.com',
  'https://www.bizorvia.com',
  'https://bizorvia-full-fgyb4wkys-sellovate-s-projects.vercel.app',
];

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || '';
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev && !ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, company, plan, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const clean = (s: string) => String(s || '').slice(0, 2000).replace(/<[^>]*>/g, '');
    const cleanName    = clean(name);
    const cleanEmail   = clean(email);
    const cleanCompany = clean(company || '');
    const cleanPlan    = plan ? clean(plan) : null;
    const cleanMessage = clean(message);

    // 1. Save to Supabase (server-side only — service role)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          name: cleanName,
          email: cleanEmail,
          company: cleanCompany,
          plan: cleanPlan,
          message: cleanMessage,
        });
      if (dbError) {
        console.error('[CONTACT] Supabase insert error:', dbError.message);
        // Don't block the email — continue even if DB fails
      }
    }

    // 2. Send email via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error: emailError } = await resend.emails.send({
        from: 'Bizorvia <hello@bizorvia.com>',
        to: ['hello@bizorvia.com'],
        replyTo: cleanEmail,
        subject: `New contact from ${cleanName}${cleanPlan ? ` — ${cleanPlan} plan` : ''}`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px;">
            <div style="margin-bottom:24px;">
              <span style="background:#d8ff72;color:#0a0a0a;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">NEW CONTACT</span>
            </div>
            <h2 style="margin:0 0 24px;font-size:24px;">New message from ${cleanName}</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#999;width:120px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;">${cleanName}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#999;">Email</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;"><a href="mailto:${cleanEmail}" style="color:#d8ff72;">${cleanEmail}</a></td></tr>
              ${cleanCompany ? `<tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#999;">Company</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;">${cleanCompany}</td></tr>` : ''}
              ${cleanPlan ? `<tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#999;">Plan</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;">${cleanPlan}</td></tr>` : ''}
            </table>
            <div style="margin-top:24px;background:#111;border-radius:8px;padding:20px;">
              <p style="color:#999;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Message</p>
              <p style="margin:0;line-height:1.6;">${cleanMessage.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="color:#555;font-size:12px;margin-top:24px;">Bizorvia · bizorvia.com</p>
          </div>
        `,
      });
      if (emailError) {
        console.error('[CONTACT] Resend error:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[CONTACT] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
