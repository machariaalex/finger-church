import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }
    // In production: send email via Nodemailer / Resend / SendGrid here
    console.log('Contact form submission:', { name, email, phone, subject, message });
    return NextResponse.json({ message: 'Message received! We will get back to you soon.' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
