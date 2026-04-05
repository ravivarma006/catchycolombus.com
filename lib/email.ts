/**
 * Resend email integration for Catch Columbus.
 * Set RESEND_API_KEY in your environment variables to enable sending.
 * Docs: https://resend.com/docs
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Catch Columbus <hello@catchcolumbus.com>";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    // Silently skip in dev if no key is set
    console.warn("[email] RESEND_API_KEY not set — email skipped:", subject);
    return { success: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      reply_to: replyTo,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[email] Resend error:", body);
    return { success: false, error: "Failed to send email." };
  }

  return { success: true };
}

// --- Email templates ---

export function welcomeEmailHtml(email: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome to Catch Columbus</title></head>
<body style="font-family:'Inter',Arial,sans-serif;background:#f9fafb;margin:0;padding:40px 0;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
    <div style="background:linear-gradient(135deg,#020C1B 0%,#0D1B3E 100%);padding:40px 40px 32px;">
      <h1 style="font-size:28px;font-weight:900;color:#fff;margin:0;">
        Welcome to <span style="color:#F5A800;">Catch Columbus</span>
      </h1>
      <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:14px;">
        Your guide to everything Columbus, Ohio
      </p>
    </div>
    <div style="padding:36px 40px;">
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
        You're in! We'll send you the best events, deals, and coupons from around Columbus right to your inbox.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 28px;">
        Here's what to expect:
      </p>
      <ul style="padding-left:20px;color:#374151;font-size:15px;line-height:2;margin:0 0 28px;">
        <li>Weekly local events roundup</li>
        <li>Exclusive coupons from Columbus businesses</li>
        <li>New service listings in your area</li>
        <li>City announcements &amp; news</li>
      </ul>
      <a href="https://catchcolumbus.com" style="display:inline-block;background:#F5A800;color:#020C1B;font-weight:800;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Explore Columbus →
      </a>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        You received this because ${email} subscribed at catchcolumbus.com.
        <a href="https://catchcolumbus.com/unsubscribe?email=${encodeURIComponent(email)}" style="color:#9ca3af;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function dealAlertEmailHtml(deals: { title: string; description: string; code?: string; url: string }[]): string {
  const dealItems = deals
    .map(
      (d) => `
    <div style="border:1px solid #f3f4f6;border-radius:12px;padding:20px;margin-bottom:16px;">
      <h3 style="font-size:16px;font-weight:700;color:#1A1A2E;margin:0 0 6px;">${d.title}</h3>
      <p style="color:#6b7280;font-size:14px;margin:0 0 12px;">${d.description}</p>
      ${d.code ? `<span style="display:inline-block;background:#fef3c7;color:#92400e;font-family:monospace;font-weight:700;font-size:13px;padding:4px 12px;border-radius:6px;margin-bottom:12px;">${d.code}</span>` : ""}
      <a href="${d.url}" style="display:inline-block;color:#0F4C5C;font-weight:600;font-size:13px;text-decoration:none;">View Deal →</a>
    </div>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Deals in Columbus</title></head>
<body style="font-family:'Inter',Arial,sans-serif;background:#f9fafb;margin:0;padding:40px 0;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
    <div style="background:linear-gradient(135deg,#020C1B 0%,#0D1B3E 100%);padding:32px 40px;">
      <p style="color:#F5A800;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">Columbus Deals</p>
      <h1 style="font-size:24px;font-weight:900;color:#fff;margin:0;">This week's best deals</h1>
    </div>
    <div style="padding:32px 40px;">
      ${dealItems}
      <a href="https://catchcolumbus.com/coupons" style="display:inline-block;background:#F5A800;color:#020C1B;font-weight:800;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;margin-top:8px;">
        See All Deals →
      </a>
    </div>
  </div>
</body>
</html>`;
}
