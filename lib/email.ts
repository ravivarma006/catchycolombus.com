/**
 * Resend email integration for Catch Columbus.
 *
 * Required env vars (add to .env.local):
 *   RESEND_API_KEY            — from https://resend.com/api-keys
 *   ADMIN_NOTIFICATION_EMAIL  — email address that receives admin alerts
 *
 * Docs: https://resend.com/docs
 */

const RESEND_API_KEY           = process.env.RESEND_API_KEY;
const FROM_EMAIL               = "Catch Columbus <hello@catchcolumbus.com>";
const SITE_URL                 = process.env.NEXT_PUBLIC_SITE_URL || "https://catchcolumbus.com";

/** Returns the admin notification address, or null if not configured. */
export function getAdminEmail(): string | null {
  const addr = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
  if (!addr) {
    console.warn("[email] ADMIN_NOTIFICATION_EMAIL not set — admin notification skipped.");
    return null;
  }
  return addr;
}

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

// --- Utilities ---

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
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

// ─────────────────────────────────────────────────────────────
// NOTIFICATION TEMPLATES
// ─────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<string, string> = {
  provider: "Business Listing",
  event:    "Event",
  coupon:   "Coupon",
};

const TYPE_EMOJI: Record<string, string> = {
  provider: "🏢",
  event:    "📅",
  coupon:   "🏷️",
};

/**
 * → TO ADMIN: a business user submitted a NEW listing.
 */
export function adminNewListingHtml(opts: {
  type: string;
  listingName: string;
  submitterEmail: string;
  adminPanelUrl: string;
}): string {
  const label = TYPE_LABEL[opts.type] ?? opts.type;
  const emoji = TYPE_EMOJI[opts.type] ?? "📋";
  return `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:'Inter',Arial,sans-serif;background:#f1f5f9;margin:0;padding:40px 0;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0F4C5C 0%,#0a3545 100%);padding:32px 40px;">
      <p style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">Catch Columbus · Admin Alert</p>
      <h1 style="font-size:22px;font-weight:900;color:#fff;margin:0;">${emoji} New ${escapeHtml(label)} Submitted</h1>
    </div>
    <div style="padding:32px 40px;">
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
        A business user has submitted a new <strong>${escapeHtml(label)}</strong> that is waiting for your review.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;width:40%;">Listing Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:13px;font-weight:600;">${escapeHtml(opts.listingName)}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Type</td>
            <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:13px;">${escapeHtml(label)}</td></tr>
        <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;">Submitter Email</td>
            <td style="padding:10px 0;color:#111827;font-size:13px;">${escapeHtml(opts.submitterEmail)}</td></tr>
      </table>
      <a href="${opts.adminPanelUrl}" style="display:inline-block;background:#F5A800;color:#0F4C5C;font-weight:800;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Review in Admin Panel →
      </a>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">Catch Columbus Admin · ${SITE_URL}</p>
    </div>
  </div>
</body></html>`;
}

/**
 * → TO ADMIN: a business user RESUBMITTED after needs_changes.
 */
export function adminResubmittedHtml(opts: {
  type: string;
  listingName: string;
  submitterEmail: string;
  adminPanelUrl: string;
}): string {
  const label = TYPE_LABEL[opts.type] ?? opts.type;
  const emoji = TYPE_EMOJI[opts.type] ?? "📋";
  return `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:'Inter',Arial,sans-serif;background:#f1f5f9;margin:0;padding:40px 0;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#1e40af 0%,#1e3a8a 100%);padding:32px 40px;">
      <p style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">Catch Columbus · Admin Alert</p>
      <h1 style="font-size:22px;font-weight:900;color:#fff;margin:0;">🔄 ${escapeHtml(label)} Resubmitted</h1>
    </div>
    <div style="padding:32px 40px;">
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
        A business user has updated and resubmitted a <strong>${escapeHtml(label)}</strong> after your change request. It is ready for re-review.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;width:40%;">Listing Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:13px;font-weight:600;">${escapeHtml(opts.listingName)}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Type</td>
            <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:13px;">${escapeHtml(label)}</td></tr>
        <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;">Submitter Email</td>
            <td style="padding:10px 0;color:#111827;font-size:13px;">${escapeHtml(opts.submitterEmail)}</td></tr>
      </table>
      <a href="${opts.adminPanelUrl}" style="display:inline-block;background:#F5A800;color:#0F4C5C;font-weight:800;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Re-review in Admin Panel →
      </a>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">Catch Columbus Admin · ${SITE_URL}</p>
    </div>
  </div>
</body></html>`;
}

/**
 * → TO BUSINESS USER: their listing was APPROVED.
 */
export function businessApprovedHtml(opts: {
  type: string;
  listingName: string;
  liveUrl: string;
}): string {
  const label = TYPE_LABEL[opts.type] ?? opts.type;
  return `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:'Inter',Arial,sans-serif;background:#f1f5f9;margin:0;padding:40px 0;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#065f46 0%,#047857 100%);padding:32px 40px;">
      <p style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">Catch Columbus</p>
      <h1 style="font-size:22px;font-weight:900;color:#fff;margin:0;">🎉 Your ${escapeHtml(label)} is Approved!</h1>
    </div>
    <div style="padding:32px 40px;">
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Great news! Your <strong>${escapeHtml(label)}</strong> submission has been reviewed and approved by our team. It is now live on the Catch Columbus website for all visitors to see.
      </p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:18px 20px;margin-bottom:28px;">
        <p style="color:#166534;font-size:13px;font-weight:600;margin:0 0 4px;">📋 Listing Name</p>
        <p style="color:#14532d;font-size:15px;font-weight:700;margin:0;">${escapeHtml(opts.listingName)}</p>
      </div>
      <a href="${opts.liveUrl}" style="display:inline-block;background:#F5A800;color:#0F4C5C;font-weight:800;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;margin-bottom:16px;">
        View Your Live Listing →
      </a>
      <p style="color:#6b7280;font-size:13px;margin:16px 0 0;line-height:1.6;">
        Thank you for listing with Catch Columbus. If you ever need to update your information, please contact us or log in to your dashboard.
      </p>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">Catch Columbus · <a href="${SITE_URL}" style="color:#9ca3af;">${SITE_URL}</a></p>
    </div>
  </div>
</body></html>`;
}

/**
 * → TO BUSINESS USER: admin requests CHANGES to their listing.
 */
export function businessNeedsChangesHtml(opts: {
  type: string;
  listingName: string;
  adminNotes: string;
  dashboardUrl: string;
}): string {
  const label = TYPE_LABEL[opts.type] ?? opts.type;
  return `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:'Inter',Arial,sans-serif;background:#f1f5f9;margin:0;padding:40px 0;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#92400e 0%,#b45309 100%);padding:32px 40px;">
      <p style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">Catch Columbus</p>
      <h1 style="font-size:22px;font-weight:900;color:#fff;margin:0;">✏️ Changes Needed for Your ${escapeHtml(label)}</h1>
    </div>
    <div style="padding:32px 40px;">
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Our team has reviewed your <strong>${escapeHtml(label)}</strong> submission and needs a few changes before it can be approved. Please read the feedback below and update your listing.
      </p>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="color:#92400e;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 10px;">📝 Admin Feedback</p>
        <p style="color:#78350f;font-size:14px;line-height:1.7;margin:0;white-space:pre-line;">${escapeHtml(opts.adminNotes)}</p>
      </div>
      <div style="background:#f9fafb;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
        <p style="color:#374151;font-size:13px;font-weight:600;margin:0 0 4px;">Listing</p>
        <p style="color:#111827;font-size:14px;font-weight:700;margin:0;">${escapeHtml(opts.listingName)}</p>
      </div>
      <a href="${opts.dashboardUrl}" style="display:inline-block;background:#F5A800;color:#0F4C5C;font-weight:800;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Update My Listing →
      </a>
      <p style="color:#6b7280;font-size:13px;margin:16px 0 0;line-height:1.6;">
        Once you have made the updates, resubmit your listing from your dashboard and our team will re-review it promptly.
      </p>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">Catch Columbus · <a href="${SITE_URL}" style="color:#9ca3af;">${SITE_URL}</a></p>
    </div>
  </div>
</body></html>`;
}

/**
 * → TO BUSINESS USER: their listing was REJECTED.
 */
export function businessRejectedHtml(opts: {
  type: string;
  listingName: string;
  adminNotes: string;
}): string {
  const label = TYPE_LABEL[opts.type] ?? opts.type;
  return `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:'Inter',Arial,sans-serif;background:#f1f5f9;margin:0;padding:40px 0;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#7f1d1d 0%,#991b1b 100%);padding:32px 40px;">
      <p style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">Catch Columbus</p>
      <h1 style="font-size:22px;font-weight:900;color:#fff;margin:0;">Your ${escapeHtml(label)} Was Not Approved</h1>
    </div>
    <div style="padding:32px 40px;">
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Thank you for submitting your <strong>${escapeHtml(label)}</strong> to Catch Columbus. After review, we were unable to approve this listing at this time.
      </p>
      ${opts.adminNotes ? `
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="color:#991b1b;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 10px;">📋 Reason</p>
        <p style="color:#7f1d1d;font-size:14px;line-height:1.7;margin:0;white-space:pre-line;">${escapeHtml(opts.adminNotes)}</p>
      </div>` : ""}
      <div style="background:#f9fafb;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
        <p style="color:#374151;font-size:13px;font-weight:600;margin:0 0 4px;">Listing</p>
        <p style="color:#111827;font-size:14px;font-weight:700;margin:0;">${escapeHtml(opts.listingName)}</p>
      </div>
      <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0;">
        If you believe this decision was made in error or would like to discuss it further, please reply to this email or contact us at <a href="mailto:hello@catchcolumbus.com" style="color:#0F4C5C;">hello@catchcolumbus.com</a>.
      </p>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">Catch Columbus · <a href="${SITE_URL}" style="color:#9ca3af;">${SITE_URL}</a></p>
    </div>
  </div>
</body></html>`;
}

// ─────────────────────────────────────────────────────────────
// EXISTING TEMPLATES (unchanged below)
// ─────────────────────────────────────────────────────────────

export function dealAlertEmailHtml(deals: { title: string; description: string; code?: string; url: string }[]): string {
  const dealItems = deals
    .map(
      (d) => `
    <div style="border:1px solid #f3f4f6;border-radius:12px;padding:20px;margin-bottom:16px;">
      <h3 style="font-size:16px;font-weight:700;color:#1A1A2E;margin:0 0 6px;">${escapeHtml(d.title)}</h3>
      <p style="color:#6b7280;font-size:14px;margin:0 0 12px;">${escapeHtml(d.description)}</p>
      ${d.code ? `<span style="display:inline-block;background:#fef3c7;color:#92400e;font-family:monospace;font-weight:700;font-size:13px;padding:4px 12px;border-radius:6px;margin-bottom:12px;">${escapeHtml(d.code)}</span>` : ""}
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
