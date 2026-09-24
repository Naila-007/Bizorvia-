import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || '';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    if (siteUrl && !origin.startsWith(siteUrl)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    const { name, email, company, plan, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const clean = (s: string) => String(s).slice(0, 2000).replace(/<[^>]*>/g, '');

    await resend.emails.send({
      from: 'Bizorvia <hello@bizorvia.com>',
      to: ['hello@bizorvia.com'],
      replyTo: clean(email),
      subject: `New contact from ${clean(name)}${plan ? ` — ${plan} plan` : ''}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${clean(name)}</p>
        <p><strong>Email:</strong> ${clean(email)}</p>
        <p><strong>Company:</strong> ${clean(company || 'Not provided')}</p>
        <p><strong>Plan Interest:</strong> ${plan || 'Not specified'}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${clean(message)}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
