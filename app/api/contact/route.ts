import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Every value below arrives from a public form and is interpolated into an
 * HTML email, so it gets escaped first. Without this a submitted name can close
 * the table and inject arbitrary markup into the notification we read.
 */
function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: unknown): string {
  return `
        <tr>
          <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background: #f8fafc;">${label}</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0;">${escapeHtml(value)}</td>
        </tr>`;
}

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    const { fullName, clinicName, email, claimVolume, message } = body;

    // clinicName is optional: the form stopped asking for it, but older
    // submissions and any direct callers may still send one.
    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Full name and email are required." },
        { status: 400 }
      );
    }

    const emailHtml = `
      <h2>New Demo Request from Yeam.ai</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">${row("Name", fullName)}${
        clinicName ? row("Clinic", clinicName) : ""
      }${row("Email", email)}${row("Monthly Claims", claimVolume || "Not specified")}${
        message ? row("Message", message) : ""
      }
      </table>
    `;

    await resend.emails.send({
      from: "Yeam.ai Website <onboarding@resend.dev>",
      to: ["zarak.shahjee1@gmail.com"],
      replyTo: email,
      subject: `Demo Request: ${fullName}${clinicName ? ` — ${clinicName}` : ""}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send. Please email info@yeam.ai directly." },
      { status: 500 }
    );
  }
}
