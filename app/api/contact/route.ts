import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    const { fullName, clinicName, email, claimVolume, message } = body;

    if (!fullName || !clinicName || !email) {
      return NextResponse.json(
        { error: "Full name, clinic name, and email are required." },
        { status: 400 }
      );
    }

    const emailHtml = `
      <h2>New Demo Request from Yeam.ai</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background: #f8fafc;">Name</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0;">${fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background: #f8fafc;">Clinic</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0;">${clinicName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background: #f8fafc;">Email</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background: #f8fafc;">Monthly Claims</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0;">${claimVolume || "Not specified"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background: #f8fafc;">Message</td>
          <td style="padding: 8px; border: 1px solid #e2e8f0;">${message || "—"}</td>
        </tr>
      </table>
    `;

    await resend.emails.send({
      from: "Yeam.ai Website <onboarding@resend.dev>",
      to: ["zarak.shahjee1@gmail.com"],
      replyTo: email,
      subject: `Demo Request: ${clinicName} (${fullName})`,
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
