import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Email a drafted letter to the visitor, and tell the team someone tried it.
 *
 * Sending TO a visitor needs a verified sending domain in Resend. Until
 * RESEND_FROM_EMAIL is set to an address on a verified domain, we still
 * capture the lead and notify the team, and say so plainly rather than
 * claiming we sent something we didn't.
 */

const TEAM_INBOX = "zarak.shahjee1@gmail.com";
const MAX_LETTER_CHARS = 20_000;

/** Escape before interpolating anything into email HTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email isn't configured yet — copy or download the draft instead." },
      { status: 503 },
    );
  }

  let email: string;
  let letter: string;
  try {
    const body = await request.json();
    email = String(body.email ?? "").trim();
    letter = String(body.letter ?? "");
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!letter || letter.length > MAX_LETTER_CHARS) {
    return NextResponse.json({ error: "Nothing to send." }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const verifiedSender = process.env.RESEND_FROM_EMAIL;
  const letterHtml = `<pre style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;line-height:1.6;white-space:pre-wrap;">${esc(letter)}</pre>`;

  try {
    // Always tell the team — this is the lead, and it works on the sandbox sender.
    await resend.emails.send({
      from: "Yeam.ai Website <onboarding@resend.dev>",
      to: [TEAM_INBOX],
      replyTo: email,
      subject: `Appeal demo used by ${email}`,
      html: `<p><strong>${esc(email)}</strong> ran the appeal demo on yeam.ai and asked for a copy.</p>${letterHtml}`,
    });

    if (!verifiedSender) {
      return NextResponse.json({
        message:
          "Got it — we'll send this over shortly. In the meantime you can copy or download it above.",
      });
    }

    await resend.emails.send({
      from: `Yeam.ai <${verifiedSender}>`,
      to: [email],
      subject: "Your Yeam appeal draft",
      html: `<p>Here's the draft Yeam produced from the document you sent.</p>${letterHtml}<p style="color:#5A6A8A;font-size:12px;">Drafted from a demonstration document. Yeam did not retain the file or the draft.</p>`,
    });

    return NextResponse.json({ message: `Sent to ${email}.` });
  } catch (error) {
    console.error("Appeal demo email error:", error);
    return NextResponse.json(
      { error: "Could not send that. Copy or download the draft instead." },
      { status: 500 },
    );
  }
}
