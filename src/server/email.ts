import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);
const APP_NAME = "MDSU-Charge";
const FROM = env.FROM_EMAIL;
const APP_URL = env.NEXT_PUBLIC_APP_URL;

function baseLayout(content: string, accentColor = "#1d4ed8"): string {
  return `
    <div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      <!-- Top accent bar -->
      <div style="height:4px;background:${accentColor};"></div>

      <!-- Logo header -->
      <div style="padding:24px 32px;border-bottom:1px solid #f1f5f9;background:#fafbfc;">
        <p style="margin:0;font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-0.4px;">${APP_NAME}</p>
      </div>

      <!-- Content -->
      <div style="padding:32px;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="padding:20px 32px;background:#f8fafc;border-top:1px solid #f1f5f9;">
        <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
          This email was sent by ${APP_NAME}. If you did not expect this email, please ignore it.<br/>
          © ${new Date().getFullYear()} MDSSC. All rights reserved.
        </p>
      </div>
    </div>
  `;
}

function ctaButton(text: string, url: string, color = "#1d4ed8"): string {
  return `
    <a href="${url}" style="display:inline-block;background:${color};color:#fff;padding:12px 24px;border-radius:9px;text-decoration:none;font-size:14px;font-weight:600;margin:16px 0;letter-spacing:-0.1px;">
      ${text}
    </a>
  `;
}

function infoRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 0;font-size:13px;color:#64748b;font-weight:500;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;font-size:13px;color:#0f172a;font-weight:600;vertical-align:top;">${value}</td>
    </tr>
  `;
}

// ── V1 — Verification email ───────────────────────────────────

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Verify your email — ${APP_NAME}`,
    html: baseLayout(`
      <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 8px;letter-spacing:-0.4px;">Verify your email address</h2>
      <p style="font-size:14px;color:#64748b;line-height:1.6;margin:0 0 20px;">Click the button below to verify your email. This link expires in <strong>24 hours</strong>.</p>
      ${ctaButton("Verify Email", verifyUrl)}
      <p style="font-size:12px;color:#94a3b8;margin-top:16px;">Or copy this link: <a href="${verifyUrl}" style="color:#1d4ed8;">${verifyUrl}</a></p>
    `),
  });
}

// ── V1 — Password reset email ─────────────────────────────────

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Reset your password — ${APP_NAME}`,
    html: baseLayout(`
      <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 8px;letter-spacing:-0.4px;">Reset your password</h2>
      <p style="font-size:14px;color:#64748b;line-height:1.6;margin:0 0 20px;">Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.</p>
      ${ctaButton("Reset Password", resetUrl)}
      <p style="font-size:12px;color:#94a3b8;margin-top:16px;">If you did not request a password reset, ignore this email.</p>
    `),
  });
}

// ── V3 — Course rejected email ────────────────────────────────

export async function sendCourseRejectedEmail(
  email: string,
  courseTitle: string,
  reason: string,
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Course "${courseTitle}" needs changes — ${APP_NAME}`,
    html: baseLayout(
      `
      <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 8px;letter-spacing:-0.4px;">Course Needs Changes</h2>
      <p style="font-size:14px;color:#64748b;line-height:1.6;margin:0 0 20px;">Your course <strong style="color:#0f172a;">${courseTitle}</strong> was reviewed by our admin team and requires changes before it can be published.</p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px;margin-bottom:20px;">
        <p style="font-size:12px;font-weight:700;color:#991b1b;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em;">Rejection Reason</p>
        <p style="font-size:14px;color:#dc2626;margin:0;line-height:1.6;">${reason}</p>
      </div>
      <p style="font-size:14px;color:#64748b;">Please make the necessary edits and resubmit for review.</p>
      ${ctaButton("Go to My Courses", `${APP_URL}/cms/courses`)}
    `,
      "#dc2626",
    ),
  });
}

// ── V4 — Free event registration confirmation ─────────────────

// export async function sendEventRegistrationEmail({
//   email,
//   name,
//   eventTitle,
//   eventSlug,
//   startDate,
//   endDate,
//   mode,
//   venue,
//   ticketCode,
//   qrCodeBase64,
// }: {
//   email: string;
//   name: string;
//   eventTitle: string;
//   eventSlug: string;
//   startDate: Date;
//   endDate: Date | null;
//   mode: string;
//   venue: string | null;
//   ticketCode: string;
//   qrCodeBase64: string;
// }) {
//   const eventUrl = `${APP_URL}/events/${eventSlug}`;
//   const ticketUrl = `${APP_URL}/events/verify/${ticketCode}`;

//   const dateStr = startDate.toLocaleDateString("en-IN", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
//   const timeStr = startDate.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//     timeZone: "Asia/Kolkata",
//   });

//   const locationInfo =
//     mode === "ONLINE"
//       ? "Online Event — Join link will be shared after check-in"
//       : mode === "OFFLINE"
//         ? (venue ?? "Venue details will be shared soon")
//         : `Hybrid — ${venue ?? "Details coming soon"}`;

//   await resend.emails.send({
//     from: FROM,
//     to: email,
//     subject: `You're registered! ${eventTitle} — ${APP_NAME}`,
//     html: baseLayout(`
//       <!-- Success header -->
//       <div style="text-align:center;margin-bottom:28px;">
//         <div style="width:56px;height:56px;border-radius:50%;background:#f0fdf4;border:2px solid #86efac;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;">
//           <span style="font-size:24px;">✓</span>
//         </div>
//         <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">Registration Confirmed!</h2>
//         <p style="font-size:14px;color:#64748b;margin:0;">Hi ${name}, you're all set for</p>
//         <p style="font-size:16px;font-weight:700;color:#0f172a;margin:4px 0 0;">${eventTitle}</p>
//       </div>

//       <!-- Event details table -->
//       <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
//         <p style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Event Details</p>
//         <table style="width:100%;border-collapse:collapse;">
//           ${infoRow("Date", dateStr)}
//           ${infoRow("Time", `${timeStr} IST`)}
//           ${infoRow("Mode", mode === "ONLINE" ? "Online" : mode === "OFFLINE" ? "In Person" : "Hybrid")}
//           ${infoRow("Location", locationInfo)}
//           ${endDate ? infoRow("End Time", endDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }) + " IST") : ""}
//         </table>
//       </div>

//       <!-- QR Ticket -->
//       <div style="background:#fff;border:1.5px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
//         <p style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Your Ticket</p>
//         <img src="${qrCodeBase64}" alt="QR Code" width="160" height="160" style="display:block;margin:0 auto 12px;border-radius:8px;" />
//         <p style="font-size:11px;color:#94a3b8;margin:0 0 4px;">Ticket Code</p>
//         <p style="font-family:monospace;font-size:14px;font-weight:700;color:#0f172a;margin:0;letter-spacing:0.05em;">${ticketCode}</p>
//         <p style="font-size:12px;color:#64748b;margin:10px 0 0;">Show this QR code at the venue for entry</p>
//       </div>

//       ${ctaButton("View Event Details", eventUrl)}

//       <p style="font-size:13px;color:#64748b;margin-top:20px;line-height:1.6;">
//         To cancel your registration, visit the event page and click "Cancel Registration" before the event starts.
//       </p>
//     `),
//   });
// }
// export async function sendEventRegistrationEmail({
//   email,
//   name,
//   eventTitle,
//   eventSlug,
//   startDate,
//   endDate,
//   mode,
//   venue,
//   joinLink,
//   ticketCode,
//   qrCodeBase64,
// }: {
//   email: string;
//   name: string;
//   eventTitle: string;
//   eventSlug: string;
//   startDate: Date;
//   endDate: Date | null;
//   mode: string;
//   venue: string | null;
//   joinLink: string | null;
//   ticketCode: string;
//   qrCodeBase64: string;
// }) {
//   const eventUrl = `${APP_URL}/events/${eventSlug}`;

//   const dateStr = startDate.toLocaleDateString("en-IN", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
//   const timeStr = startDate.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//     timeZone: "Asia/Kolkata",
//   });

//   const locationInfo =
//     mode === "ONLINE"
//       ? joinLink
//         ? `<a href="${joinLink}" style="color:#1d4ed8;font-weight:700;text-decoration:underline;">Join Meeting →</a>`
//         : "Online Event — Join link will be shared soon"
//       : mode === "OFFLINE"
//         ? (venue ?? "Venue details will be shared soon")
//         : `${venue ?? "Details coming soon"}${joinLink ? ` &nbsp;·&nbsp; <a href="${joinLink}" style="color:#1d4ed8;font-weight:700;text-decoration:underline;">Join Online →</a>` : ""}`;

//   await resend.emails.send({
//     from: FROM,
//     to: email,
//     subject: `You're registered! ${eventTitle} — ${APP_NAME}`,
//     html: baseLayout(`
//       <div style="text-align:center;margin-bottom:28px;">
//         <div style="width:56px;height:56px;border-radius:50%;background:#f0fdf4;border:2px solid #86efac;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;">
//           <span style="font-size:24px;">✓</span>
//         </div>
//         <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">Registration Confirmed!</h2>
//         <p style="font-size:14px;color:#64748b;margin:0;">Hi ${name}, you're all set for</p>
//         <p style="font-size:16px;font-weight:700;color:#0f172a;margin:4px 0 0;">${eventTitle}</p>
//       </div>

//       <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
//         <p style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Event Details</p>
//         <table style="width:100%;border-collapse:collapse;">
//           ${infoRow("Date", dateStr)}
//           ${infoRow("Time", `${timeStr} IST`)}
//           ${infoRow("Mode", mode === "ONLINE" ? "Online" : mode === "OFFLINE" ? "In Person" : "Hybrid")}
//           ${infoRow("Location", locationInfo)}
//           ${endDate ? infoRow("End Time", endDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }) + " IST") : ""}
//         </table>
//       </div>

//       <div style="background:#fff;border:1.5px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
//         <p style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Your Ticket</p>
//         <img src="${qrCodeBase64}" alt="QR Code" width="160" height="160" style="display:block;margin:0 auto 12px;border-radius:8px;" />
//         <p style="font-size:11px;color:#94a3b8;margin:0 0 4px;">Ticket Code</p>
//         <p style="font-family:monospace;font-size:14px;font-weight:700;color:#0f172a;margin:0;letter-spacing:0.05em;">${ticketCode}</p>
//         <p style="font-size:12px;color:#64748b;margin:10px 0 0;">Show this QR code at the venue for entry</p>
//       </div>

//       ${ctaButton("View Event Details", eventUrl)}

//       <p style="font-size:13px;color:#64748b;margin-top:20px;line-height:1.6;">
//         To cancel your registration, visit the event page and click "Cancel Registration" before the event starts.
//       </p>
//     `),
//   });
// }

// src/server/email.ts — sendEventRegistrationEmail mein
// export async function sendEventRegistrationEmail({
//   email,
//   name,
//   eventTitle,
//   eventSlug,
//   startDate,
//   endDate,
//   mode,
//   venue,
//   joinLink,
//   ticketCode,
//   qrCodeUrl, // ← type ab string | null
// }: {
//   email: string;
//   name: string;
//   eventTitle: string;
//   eventSlug: string;
//   startDate: Date;
//   endDate: Date | null;
//   mode: string;
//   venue: string | null;
//   joinLink: string | null;
//   ticketCode: string;
//   qrCodeUrl: string | null; // ← nullable
// }) {
//   // ... existing dateStr, timeStr, locationInfo same ...

//   // QR section conditional banao
//   const qrSection = qrCodeUrl
//     ? `
//       <div style="background:#fff;border:1.5px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
//         <p style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Your Ticket</p>
//         <img src="${qrCodeUrl}" alt="QR Code" width="160" height="160" style="display:block;margin:0 auto 12px;border-radius:8px;" />
//         <p style="font-size:11px;color:#94a3b8;margin:0 0 4px;">Ticket Code</p>
//         <p style="font-family:monospace;font-size:14px;font-weight:700;color:#0f172a;margin:0;letter-spacing:0.05em;">${ticketCode}</p>
//         <p style="font-size:12px;color:#64748b;margin:10px 0 0;">Show this QR code at the venue for entry</p>
//       </div>
//     `
//     : `
//       <div style="background:#fff;border:1.5px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
//         <p style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Your Ticket Code</p>
//         <p style="font-family:monospace;font-size:18px;font-weight:800;color:#0f172a;margin:0;letter-spacing:0.08em;">${ticketCode}</p>
//         <p style="font-size:12px;color:#64748b;margin:10px 0 0;">Show this code at the venue for entry</p>
//       </div>
//     `;

//   await resend.emails.send({
//     from: FROM,
//     to: email,
//     subject: `You're registered! ${eventTitle} — ${APP_NAME}`,
//     html: baseLayout(`
//       <div style="text-align:center;margin-bottom:28px;">
//         <div style="width:56px;height:56px;border-radius:50%;background:#f0fdf4;border:2px solid #86efac;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;">
//           <span style="font-size:24px;">✓</span>
//         </div>
//         <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">Registration Confirmed!</h2>
//         <p style="font-size:14px;color:#64748b;margin:0;">Hi ${name}, you're all set for</p>
//         <p style="font-size:16px;font-weight:700;color:#0f172a;margin:4px 0 0;">${eventTitle}</p>
//       </div>

//       <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
//         <p style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Event Details</p>
//         <table style="width:100%;border-collapse:collapse;">
//           ${infoRow("Date", dateStr)}
//           ${infoRow("Time", `${timeStr} IST`)}
//           ${infoRow("Mode", mode === "ONLINE" ? "Online" : mode === "OFFLINE" ? "In Person" : "Hybrid")}
//           ${infoRow("Location", locationInfo)}
//           ${endDate ? infoRow("End Time", endDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }) + " IST") : ""}
//         </table>
//       </div>

//       ${qrSection}

//       ${ctaButton("View Event Details", eventUrl)}

//       <p style="font-size:13px;color:#64748b;margin-top:20px;line-height:1.6;">
//         To cancel your registration, visit the event page and click "Cancel Registration" before the event starts.
//       </p>
//     `),
//   });
// }

export async function sendEventRegistrationEmail({
  email,
  name,
  eventTitle,
  eventSlug,
  startDate,
  endDate,
  mode,
  venue,
  joinLink,
  ticketCode,
  qrCodeUrl,
}: {
  email: string;
  name: string;
  eventTitle: string;
  eventSlug: string;
  startDate: Date;
  endDate: Date | null;
  mode: string;
  venue: string | null;
  joinLink: string | null;
  ticketCode: string;
  qrCodeUrl: string | null;
}) {
  const eventUrl = `${APP_URL}/events/${eventSlug}`;

  const dateStr = startDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = startDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  const locationInfo =
    mode === "ONLINE"
      ? joinLink
        ? `<a href="${joinLink}" style="color:#1d4ed8;font-weight:700;text-decoration:underline;">Join Meeting →</a>`
        : "Online Event — Join link will be shared soon"
      : mode === "OFFLINE"
        ? (venue ?? "Venue details will be shared soon")
        : `${venue ?? "Details coming soon"}${joinLink ? ` &nbsp;·&nbsp; <a href="${joinLink}" style="color:#1d4ed8;font-weight:700;text-decoration:underline;">Join Online →</a>` : ""}`;

  const qrSection = qrCodeUrl
    ? `
      <div style="background:#fff;border:1.5px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
        <p style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Your Ticket</p>
        <img src="${qrCodeUrl}" alt="QR Code" width="160" height="160" style="display:block;margin:0 auto 12px;border-radius:8px;" />
        <p style="font-size:11px;color:#94a3b8;margin:0 0 4px;">Ticket Code</p>
        <p style="font-family:monospace;font-size:14px;font-weight:700;color:#0f172a;margin:0;letter-spacing:0.05em;">${ticketCode}</p>
        <p style="font-size:12px;color:#64748b;margin:10px 0 0;">Show this QR code at the venue for entry</p>
      </div>
    `
    : `
      <div style="background:#fff;border:1.5px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
        <p style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Your Ticket Code</p>
        <p style="font-family:monospace;font-size:18px;font-weight:800;color:#0f172a;margin:0;letter-spacing:0.08em;">${ticketCode}</p>
        <p style="font-size:12px;color:#64748b;margin:10px 0 0;">Show this code at the venue for entry</p>
      </div>
    `;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `You're registered! ${eventTitle} — ${APP_NAME}`,
    html: baseLayout(`
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#f0fdf4;border:2px solid #86efac;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;">
          <span style="font-size:24px;">✓</span>
        </div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">Registration Confirmed!</h2>
        <p style="font-size:14px;color:#64748b;margin:0;">Hi ${name}, you're all set for</p>
        <p style="font-size:16px;font-weight:700;color:#0f172a;margin:4px 0 0;">${eventTitle}</p>
      </div>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Event Details</p>
        <table style="width:100%;border-collapse:collapse;">
          ${infoRow("Date", dateStr)}
          ${infoRow("Time", `${timeStr} IST`)}
          ${infoRow("Mode", mode === "ONLINE" ? "Online" : mode === "OFFLINE" ? "In Person" : "Hybrid")}
          ${infoRow("Location", locationInfo)}
          ${endDate ? infoRow("End Time", endDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }) + " IST") : ""}
        </table>
      </div>

      ${qrSection}

      ${ctaButton("View Event Details", eventUrl)}

      <p style="font-size:13px;color:#64748b;margin-top:20px;line-height:1.6;">
        To cancel your registration, visit the event page and click "Cancel Registration" before the event starts.
      </p>
    `),
  });
}
// ── V4 — Paid event ticket confirmation ──────────────────────

// export async function sendPaidEventTicketEmail({
//   email,
//   name,
//   eventTitle,
//   eventSlug,
//   startDate,
//   endDate,
//   mode,
//   venue,
//   ticketCode,
//   qrCodeBase64,
//   amountPaid,
//   razorpayPaymentId,
//   refundPolicy,
//   cancellationDeadline,
// }: {
//   email: string;
//   name: string;
//   eventTitle: string;
//   eventSlug: string;
//   startDate: Date;
//   endDate: Date | null;
//   mode: string;
//   venue: string | null;
//   ticketCode: string;
//   qrCodeBase64: string;
//   amountPaid: number; // paise
//   razorpayPaymentId: string;
//   refundPolicy: string | null;
//   cancellationDeadline: Date | null;
// }) {
//   const eventUrl = `${APP_URL}/events/${eventSlug}`;
//   const dateStr = startDate.toLocaleDateString("en-IN", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
//   const timeStr = startDate.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//     timeZone: "Asia/Kolkata",
//   });
//   const amountStr = `₹${(amountPaid / 100).toLocaleString("en-IN")}`;
//   const locationInfo =
//     mode === "ONLINE"
//       ? "Online — Join link shared after check-in"
//       : mode === "OFFLINE"
//         ? (venue ?? "Venue TBD")
//         : `Hybrid — ${venue ?? "Details coming soon"}`;

//   await resend.emails.send({
//     from: FROM,
//     to: email,
//     subject: `Payment confirmed — ${eventTitle} ticket — ${APP_NAME}`,
//     html: baseLayout(`
//       <!-- Success header -->
//       <div style="text-align:center;margin-bottom:28px;">
//         <div style="width:56px;height:56px;border-radius:50%;background:#f0fdf4;border:2px solid #86efac;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;">
//           <span style="font-size:24px;">🎟</span>
//         </div>
//         <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">Payment Successful!</h2>
//         <p style="font-size:14px;color:#64748b;margin:0;">Hi ${name}, your ticket for</p>
//         <p style="font-size:16px;font-weight:700;color:#0f172a;margin:4px 0 0;">${eventTitle}</p>
//         <p style="font-size:14px;color:#64748b;margin:4px 0 0;">is confirmed</p>
//       </div>

//       <!-- Event + payment details -->
//       <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
//         <p style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Event Details</p>
//         <table style="width:100%;border-collapse:collapse;">
//           ${infoRow("Date", dateStr)}
//           ${infoRow("Time", `${timeStr} IST`)}
//           ${infoRow("Mode", mode === "ONLINE" ? "Online" : mode === "OFFLINE" ? "In Person" : "Hybrid")}
//           ${infoRow("Location", locationInfo)}
//         </table>
//       </div>

//       <!-- Payment summary -->
//       <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;">
//         <p style="font-size:11px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Payment Summary</p>
//         <table style="width:100%;border-collapse:collapse;">
//           ${infoRow("Amount Paid", amountStr)}
//           ${infoRow("Payment ID", razorpayPaymentId)}
//           ${infoRow("Status", "✓ Confirmed")}
//         </table>
//       </div>

//       <!-- QR Ticket -->
//       <div style="background:#fff;border:1.5px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
//         <p style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Your Entry Ticket</p>
//         <img src="${qrCodeBase64}" alt="QR Code" width="160" height="160" style="display:block;margin:0 auto 12px;border-radius:8px;" />
//         <p style="font-size:11px;color:#94a3b8;margin:0 0 4px;">Ticket Code</p>
//         <p style="font-family:monospace;font-size:14px;font-weight:700;color:#0f172a;margin:0;letter-spacing:0.05em;">${ticketCode}</p>
//         <p style="font-size:12px;color:#64748b;margin:10px 0 0;">Present this QR at the venue for entry</p>
//       </div>

//       ${ctaButton("View My Ticket", eventUrl)}

//       ${
//         refundPolicy
//           ? `
//         <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px;margin-top:20px;">
//           <p style="font-size:12px;font-weight:700;color:#92400e;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em;">Refund Policy</p>
//           <p style="font-size:13px;color:#b45309;margin:0;line-height:1.6;">${refundPolicy}</p>
//           ${cancellationDeadline ? `<p style="font-size:12px;color:#d97706;margin:8px 0 0;">Cancellation deadline: <strong>${cancellationDeadline.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong></p>` : ""}
//         </div>
//       `
//           : ""
//       }
//     `),
//   });
// }
// src/server/email.ts mein sendPaidEventTicketEmail poori function replace karo

export async function sendPaidEventTicketEmail({
  email,
  name,
  eventTitle,
  eventSlug,
  startDate,
  endDate,
  mode,
  venue,
  joinLink,
  ticketCode,
  qrCodeUrl,
  amountPaid,
  razorpayPaymentId,
  refundPolicy,
  cancellationDeadline,
}: {
  email: string;
  name: string;
  eventTitle: string;
  eventSlug: string;
  startDate: Date;
  endDate: Date | null;
  mode: string;
  venue: string | null;
  joinLink: string | null;
  ticketCode: string;
  qrCodeUrl: string | null;
  amountPaid: number;
  razorpayPaymentId: string;
  refundPolicy: string | null;
  cancellationDeadline: Date | null;
}) {
  const eventUrl = `${APP_URL}/events/${eventSlug}`;
  const dateStr = startDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = startDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
  const amountStr = `₹${(amountPaid / 100).toLocaleString("en-IN")}`;

  const locationInfo =
    mode === "ONLINE"
      ? joinLink
        ? `<a href="${joinLink}" style="color:#1d4ed8;font-weight:700;text-decoration:underline;">Join Meeting →</a>`
        : "Online — link shared after check-in"
      : mode === "OFFLINE"
        ? (venue ?? "Venue TBD")
        : `${venue ?? "Details coming soon"}${joinLink ? ` &nbsp;·&nbsp; <a href="${joinLink}" style="color:#1d4ed8;font-weight:700;text-decoration:underline;">Join Online →</a>` : ""}`;

  const qrSection = qrCodeUrl
    ? `
      <div style="background:#fff;border:1.5px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
        <p style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Your Entry Ticket</p>
        <img src="${qrCodeUrl}" alt="QR Code" width="160" height="160" style="display:block;margin:0 auto 12px;border-radius:8px;" />
        <p style="font-size:11px;color:#94a3b8;margin:0 0 4px;">Ticket Code</p>
        <p style="font-family:monospace;font-size:14px;font-weight:700;color:#0f172a;margin:0;letter-spacing:0.05em;">${ticketCode}</p>
        <p style="font-size:12px;color:#64748b;margin:10px 0 0;">Present this QR at the venue for entry</p>
      </div>
    `
    : `
      <div style="background:#fff;border:1.5px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
        <p style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Your Ticket Code</p>
        <p style="font-family:monospace;font-size:18px;font-weight:800;color:#0f172a;margin:0;letter-spacing:0.08em;">${ticketCode}</p>
        <p style="font-size:12px;color:#64748b;margin:10px 0 0;">Present this code at the venue for entry</p>
      </div>
    `;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Payment confirmed — ${eventTitle} ticket — ${APP_NAME}`,
    html: baseLayout(
      `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#f0fdf4;border:2px solid #86efac;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;">
          <span style="font-size:24px;">🎟</span>
        </div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">Payment Successful!</h2>
        <p style="font-size:14px;color:#64748b;margin:0;">Hi ${name}, your ticket for</p>
        <p style="font-size:16px;font-weight:700;color:#0f172a;margin:4px 0 0;">${eventTitle}</p>
        <p style="font-size:14px;color:#64748b;margin:4px 0 0;">is confirmed</p>
      </div>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Event Details</p>
        <table style="width:100%;border-collapse:collapse;">
          ${infoRow("Date", dateStr)}
          ${infoRow("Time", `${timeStr} IST`)}
          ${infoRow("Mode", mode === "ONLINE" ? "Online" : mode === "OFFLINE" ? "In Person" : "Hybrid")}
          ${infoRow("Location", locationInfo)}
        </table>
      </div>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="font-size:11px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Payment Summary</p>
        <table style="width:100%;border-collapse:collapse;">
          ${infoRow("Amount Paid", amountStr)}
          ${infoRow("Payment ID", razorpayPaymentId)}
          ${infoRow("Status", "✓ Confirmed")}
        </table>
      </div>

      ${qrSection}

      ${ctaButton("View Event Detail", eventUrl)}

      ${
        refundPolicy
          ? `
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px;margin-top:20px;">
          <p style="font-size:12px;font-weight:700;color:#92400e;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em;">Refund Policy</p>
          <p style="font-size:13px;color:#b45309;margin:0;line-height:1.6;">${refundPolicy}</p>
          ${cancellationDeadline ? `<p style="font-size:12px;color:#d97706;margin:8px 0 0;">Cancellation deadline: <strong>${cancellationDeadline.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong></p>` : ""}
        </div>
      `
          : ""
      }
    `,
      "#dc2626",
    ),
  });
}
// ── V4 — Waitlist spot available notification ─────────────────

export async function sendWaitlistSpotAvailableEmail({
  email,
  name,
  eventTitle,
  eventSlug,
  expiresAt,
}: {
  email: string;
  name: string;
  eventTitle: string;
  eventSlug: string;
  expiresAt: Date; // 24 hours from now
}) {
  const registerUrl = `${APP_URL}/events/${eventSlug}?waitlist=claim`;
  const expiryStr = expiresAt.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `A spot opened up — ${eventTitle} — ${APP_NAME}`,
    html: baseLayout(
      `
      <!-- Alert header -->
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#fffbeb;border:2px solid #fde68a;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;">
          <span style="font-size:24px;">🔔</span>
        </div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">A spot just opened!</h2>
        <p style="font-size:14px;color:#64748b;margin:0;">Hi ${name}, a spot is now available for</p>
        <p style="font-size:16px;font-weight:700;color:#0f172a;margin:4px 0 0;">${eventTitle}</p>
      </div>

      <!-- Urgency box -->
      <div style="background:#fef3c7;border:1.5px solid #fde68a;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
        <p style="font-size:13px;font-weight:600;color:#92400e;margin:0 0 6px;">⏰ This spot is reserved for you until</p>
        <p style="font-size:16px;font-weight:800;color:#0f172a;margin:0;">${expiryStr} IST</p>
        <p style="font-size:12px;color:#b45309;margin:8px 0 0;">After this time, the spot will be offered to the next person on the waitlist.</p>
      </div>

      ${ctaButton("Claim Your Spot Now →", registerUrl, "#16a34a")}

      <p style="font-size:13px;color:#64748b;margin-top:20px;line-height:1.6;">
        If you no longer wish to attend, simply ignore this email and the spot will be passed to the next person on the waitlist.
      </p>
    `,
      "#d97706",
    ),
  });
}

export async function sendEventCancelledEmail({
  email,
  name,
  eventTitle,
  startDate,
  isPaid,
  amountPaid,
}: {
  email: string;
  name: string;
  eventTitle: string;
  startDate: Date;
  isPaid: boolean;
  amountPaid: number | null; // paise
}) {
  const dateStr = startDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Event Cancelled: ${eventTitle} — ${APP_NAME}`,
    html: baseLayout(
      `
      <!-- Cancelled header -->
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#fef2f2;border:2px solid #fecaca;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;">
          <span style="font-size:24px;">❌</span>
        </div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">Event Cancelled</h2>
        <p style="font-size:14px;color:#64748b;margin:0;">Hi ${name}, we regret to inform you that</p>
        <p style="font-size:16px;font-weight:700;color:#0f172a;margin:4px 0 0;">${eventTitle}</p>
        <p style="font-size:14px;color:#64748b;margin:4px 0 0;">scheduled for ${dateStr} has been cancelled.</p>
      </div>

      <!-- Apology message -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="font-size:14px;color:#475569;margin:0;line-height:1.7;">
          We sincerely apologize for any inconvenience this may have caused. We understand this may have disrupted your plans and we appreciate your understanding.
        </p>
      </div>

      ${
        isPaid && amountPaid
          ? `
        <!-- Refund info -->
        <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="font-size:11px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Refund Information</p>
          <p style="font-size:14px;color:#16a34a;font-weight:600;margin:0 0 8px;">
            ✓ Your payment of ₹${(amountPaid / 100).toLocaleString("en-IN")} will be refunded.
          </p>
          <p style="font-size:13px;color:#475569;margin:0;line-height:1.6;">
            The refund will be processed to your original payment method within <strong>5-7 business days</strong>. If you have not received your refund after 7 business days, please contact us.
          </p>
        </div>
      `
          : ""
      }

      <!-- Browse events CTA -->
      ${ctaButton("Browse Other Events", `${APP_URL}/events`, "#1d4ed8")}

      <p style="font-size:13px;color:#94a3b8;margin-top:20px;line-height:1.6;">
        If you have any questions, please reply to this email or contact our support team.
      </p>
    `,
      "#dc2626",
    ),
  });
}

// ═══════════════════════════════════════════════════════════════
// V5 — Jobs & Career Module Emails
// ═══════════════════════════════════════════════════════════════

// ── Provider registration — welcome, pending approval ──────────

export async function sendProviderWelcomeEmail({
  email,
  contactPerson,
  companyName,
}: {
  email: string;
  contactPerson: string;
  companyName: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Welcome to ${APP_NAME} — account under review`,
    html: baseLayout(
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#fefce8;border:2px solid #fde68a;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:24px;">⏳</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">Registration Received</h2>
        <p style="font-size:14px;color:#64748b;margin:0;">Hi ${contactPerson},</p>
      </div>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
        Thank you for registering <strong style="color:#0f172a;">${companyName}</strong> on ${APP_NAME}. Your company profile is currently <strong>pending review</strong> by our team.
      </p>
      <div style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-bottom:20px;">
        <p style="font-size:13px;color:#854d0e;margin:0;line-height:1.6;">
          Once approved, you'll receive a confirmation email and can start posting job opportunities immediately.
        </p>
      </div>
      <p style="font-size:13px;color:#94a3b8;margin:0;">This usually takes 1-2 business days.</p>
    `,
      "#eab308",
    ),
  });
}

// ── Company profile approved ─────────────────────────────────

export async function sendCompanyApprovedEmail({
  email,
  contactPerson,
  companyName,
}: {
  email: string;
  contactPerson: string;
  companyName: string;
}) {
  const loginUrl = `${APP_URL}/login`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${companyName} is approved — start posting jobs!`,
    html: baseLayout(
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#f0fdf4;border:2px solid #86efac;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:24px;">✓</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">You're Approved!</h2>
        <p style="font-size:14px;color:#64748b;margin:0;">Hi ${contactPerson},</p>
      </div>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
        Great news — <strong style="color:#0f172a;">${companyName}</strong> has been approved. You can now post job opportunities and start receiving applications from students.
      </p>
      ${ctaButton("Post Your First Job", `${APP_URL}${"/provider/listings/new"}`, "#16a34a")}
      <p style="font-size:13px;color:#94a3b8;margin-top:20px;">
        Every listing you post will go through a quick review by our team before going live.
      </p>
    `,
      "#16a34a",
    ),
  });
}

// ── Company profile rejected ─────────────────────────────────

export async function sendCompanyRejectedEmail({
  email,
  contactPerson,
  companyName,
  reason,
}: {
  email: string;
  contactPerson: string;
  companyName: string;
  reason: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Update on your ${companyName} registration`,
    html: baseLayout(
      `
      <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 8px;letter-spacing:-0.4px;">Registration Not Approved</h2>
      <p style="font-size:14px;color:#64748b;margin:0 0 20px;">Hi ${contactPerson},</p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 16px;">
        We reviewed your registration for <strong style="color:#0f172a;">${companyName}</strong> and are unable to approve it at this time.
      </p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px;margin-bottom:20px;">
        <p style="font-size:12px;font-weight:700;color:#991b1b;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em;">Reason</p>
        <p style="font-size:14px;color:#dc2626;margin:0;line-height:1.6;">${reason}</p>
      </div>
      <p style="font-size:14px;color:#64748b;">You're welcome to update your details and reapply.</p>
      ${ctaButton("Update & Reapply", `${APP_URL}/jobs/employer/register`, "#dc2626")}
    `,
      "#dc2626",
    ),
  });
}

// ── Listing submitted — CMS notification ─────────────────────

export async function sendListingSubmittedToCmsEmail({
  cmsEmail,
  listingTitle,
  companyName,
  listingId,
}: {
  cmsEmail: string;
  listingTitle: string;
  companyName: string;
  listingId: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: cmsEmail,
    subject: `New listing pending review — ${listingTitle}`,
    html: baseLayout(`
      <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 8px;letter-spacing:-0.4px;">New Listing for Review</h2>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
        <strong style="color:#0f172a;">${companyName}</strong> submitted a new listing:
      </p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
        <p style="font-size:15px;font-weight:700;color:#0f172a;margin:0;">${listingTitle}</p>
      </div>
      ${ctaButton("Review Listing", `${APP_URL}/cms/jobs/${listingId}/review`)}
    `),
  });
}

// ── Listing approved ─────────────────────────────────────────

export async function sendListingApprovedEmail({
  email,
  contactPerson,
  listingTitle,
  listingSlug,
}: {
  email: string;
  contactPerson: string;
  listingTitle: string;
  listingSlug: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your listing is live — ${listingTitle}`,
    html: baseLayout(
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#f0fdf4;border:2px solid #86efac;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:24px;">✓</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">Listing Approved!</h2>
        <p style="font-size:14px;color:#64748b;margin:0;">Hi ${contactPerson},</p>
      </div>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
        Your listing <strong style="color:#0f172a;">${listingTitle}</strong> has been approved and is now live on ${APP_NAME}. Students can start applying.
      </p>
      ${ctaButton("View Live Listing", `${APP_URL}/jobs/${listingSlug}`, "#16a34a")}
    `,
      "#16a34a",
    ),
  });
}

// ── Listing rejected ─────────────────────────────────────────

export async function sendListingRejectedEmail({
  email,
  contactPerson,
  listingTitle,
  reason,
  listingId,
}: {
  email: string;
  contactPerson: string;
  listingTitle: string;
  reason: string;
  listingId: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Listing needs changes — ${listingTitle}`,
    html: baseLayout(
      `
      <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 8px;letter-spacing:-0.4px;">Listing Rejected</h2>
      <p style="font-size:14px;color:#64748b;margin:0 0 20px;">Hi ${contactPerson},</p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 16px;">
        Your listing <strong style="color:#0f172a;">${listingTitle}</strong> was not approved.
      </p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px;margin-bottom:20px;">
        <p style="font-size:12px;font-weight:700;color:#991b1b;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em;">Reason</p>
        <p style="font-size:14px;color:#dc2626;margin:0;line-height:1.6;">${reason}</p>
      </div>
      <p style="font-size:14px;color:#64748b;">Please create a new listing addressing this feedback.</p>
      ${ctaButton("Go to My Listings", `${APP_URL}/provider/listings`, "#dc2626")}
    `,
      "#dc2626",
    ),
  });
}

// ── Listing revision requested ───────────────────────────────

export async function sendListingRevisionEmail({
  email,
  contactPerson,
  listingTitle,
  notes,
  listingId,
}: {
  email: string;
  contactPerson: string;
  listingTitle: string;
  notes: string;
  listingId: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Revision requested — ${listingTitle}`,
    html: baseLayout(
      `
      <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 8px;letter-spacing:-0.4px;">Changes Requested</h2>
      <p style="font-size:14px;color:#64748b;margin:0 0 20px;">Hi ${contactPerson},</p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 16px;">
        Our team reviewed <strong style="color:#0f172a;">${listingTitle}</strong> and needs a few changes before it can go live.
      </p>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px;margin-bottom:20px;">
        <p style="font-size:12px;font-weight:700;color:#92400e;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em;">Notes from reviewer</p>
        <p style="font-size:14px;color:#b45309;margin:0;line-height:1.6;">${notes}</p>
      </div>
      ${ctaButton("Edit Listing", `${APP_URL}/provider/listings/${listingId}/edit`, "#d97706")}
    `,
      "#d97706",
    ),
  });
}

// ── Application submitted — student confirmation ─────────────

export async function sendApplicationConfirmationEmail({
  email,
  studentName,
  listingTitle,
  companyName,
  applicationId,
}: {
  email: string;
  studentName: string;
  listingTitle: string;
  companyName: string;
  applicationId: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Application submitted — ${listingTitle}`,
    html: baseLayout(
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#f0fdf4;border:2px solid #86efac;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:24px;">✓</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">Application Submitted!</h2>
        <p style="font-size:14px;color:#64748b;margin:0;">Hi ${studentName},</p>
      </div>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
        Your application to <strong style="color:#0f172a;">${listingTitle}</strong> at <strong style="color:#0f172a;">${companyName}</strong> has been submitted successfully.
      </p>
      ${ctaButton("Track Application", `${APP_URL}/dashboard/applications/${applicationId}`, "#16a34a")}
      <p style="font-size:13px;color:#94a3b8;margin-top:20px;">
        We'll notify you by email whenever your application status changes.
      </p>
    `,
      "#16a34a",
    ),
  });
}

// ── Application received — company notification ──────────────

export async function sendNewApplicantEmail({
  companyEmail,
  contactPerson,
  applicantName,
  listingTitle,
  listingId,
}: {
  companyEmail: string;
  contactPerson: string;
  applicantName: string;
  listingTitle: string;
  listingId: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: companyEmail,
    subject: `New applicant for ${listingTitle}`,
    html: baseLayout(`
      <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 8px;letter-spacing:-0.4px;">New Application Received</h2>
      <p style="font-size:14px;color:#64748b;margin:0 0 20px;">Hi ${contactPerson},</p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
        <strong style="color:#0f172a;">${applicantName}</strong> just applied to your listing <strong style="color:#0f172a;">${listingTitle}</strong>.
      </p>
      ${ctaButton("View Applicant", `${APP_URL}/provider/listings/${listingId}/applications`)}
    `),
  });
}

// ── Application status update — generic ───────────────────────

const STATUS_EMAIL_CONFIG: Record<
  string,
  { label: string; color: string; icon: string; message: string }
> = {
  UNDER_REVIEW: {
    label: "Under Review",
    color: "#1d4ed8",
    icon: "👀",
    message: "Your application is now being reviewed by the company.",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    color: "#16a34a",
    icon: "🎉",
    message: "Congratulations! You've been shortlisted for the next stage.",
  },
  INTERVIEWED: {
    label: "Interviewed",
    color: "#1d4ed8",
    icon: "✓",
    message:
      "Thank you for attending the interview. The company will get back to you soon.",
  },
  OFFERED: {
    label: "Offer Extended",
    color: "#16a34a",
    icon: "🎊",
    message: "Great news! You've received an offer.",
  },
  REJECTED: {
    label: "Not Selected",
    color: "#64748b",
    icon: "—",
    message:
      "The company has decided not to move forward with your application at this time.",
  },
};

export async function sendApplicationStatusEmail({
  email,
  studentName,
  listingTitle,
  companyName,
  status,
  statusNote,
  applicationId,
}: {
  email: string;
  studentName: string;
  listingTitle: string;
  companyName: string;
  status: string;
  statusNote: string | null;
  applicationId: string;
}) {
  const cfg = STATUS_EMAIL_CONFIG[status] ?? {
    label: status,
    color: "#1d4ed8",
    icon: "•",
    message: "Your application status has been updated.",
  };

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Application update — ${cfg.label} — ${listingTitle}`,
    html: baseLayout(
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#f8fafc;border:2px solid #e2e8f0;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:24px;">${cfg.icon}</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">${cfg.label}</h2>
        <p style="font-size:14px;color:#64748b;margin:0;">Hi ${studentName},</p>
      </div>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 16px;">
        ${cfg.message} Your application for <strong style="color:#0f172a;">${listingTitle}</strong> at <strong style="color:#0f172a;">${companyName}</strong>.
      </p>
      ${
        statusNote
          ? `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
          <p style="font-size:12px;font-weight:700;color:#64748b;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em;">Note from ${companyName}</p>
          <p style="font-size:13px;color:#475569;margin:0;line-height:1.6;">${statusNote}</p>
        </div>
      `
          : ""
      }
      ${ctaButton("View Application", `${APP_URL}/dashboard/applications/${applicationId}`, cfg.color)}
    `,
      cfg.color,
    ),
  });
}

// ── Interview scheduled — special template with details ───────

export async function sendInterviewScheduledEmail({
  email,
  studentName,
  listingTitle,
  companyName,
  interviewDate,
  interviewMode,
  interviewLink,
  applicationId,
}: {
  email: string;
  studentName: string;
  listingTitle: string;
  companyName: string;
  interviewDate: Date;
  interviewMode: string | null;
  interviewLink: string | null;
  applicationId: string;
}) {
  const dateStr = interviewDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = interviewDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Interview scheduled — ${listingTitle}`,
    html: baseLayout(`
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#eff6ff;border:2px solid #bfdbfe;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:24px;">📅</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;letter-spacing:-0.4px;">Interview Scheduled</h2>
        <p style="font-size:14px;color:#64748b;margin:0;">Hi ${studentName},</p>
      </div>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
        <strong style="color:#0f172a;">${companyName}</strong> has scheduled your interview for <strong style="color:#0f172a;">${listingTitle}</strong>.
      </p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          ${infoRow("Date", dateStr)}
          ${infoRow("Time", `${timeStr} IST`)}
          ${infoRow("Mode", interviewMode ?? "To be confirmed")}
          ${interviewLink ? infoRow("Link", `<a href="${interviewLink}" style="color:#1d4ed8;font-weight:700;">${interviewLink}</a>`) : ""}
        </table>
      </div>
      ${ctaButton("View Application", `${APP_URL}/dashboard/applications/${applicationId}`)}
    `),
  });
}

// ── Job alert digest — daily/weekly matching listings ──────────

export async function sendJobAlertDigestEmail({
  email,
  studentName,
  listings,
  frequency,
}: {
  email: string;
  studentName: string;
  listings: {
    title: string;
    companyName: string;
    slug: string;
    location: string | null;
    opportunityType: string;
  }[];
  frequency: "DAILY" | "WEEKLY";
}) {
  const listingsHtml = listings
    .map(
      (l) => `
    <div style="padding:14px 16px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:10px;">
      <p style="font-size:10px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px;">${l.opportunityType.replace(/_/g, " ")}</p>
      <p style="font-size:14px;font-weight:700;color:#0f172a;margin:0 0 3px;">${l.title}</p>
      <p style="font-size:12.5px;color:#64748b;margin:0;">${l.companyName}${l.location ? ` · ${l.location}` : ""}</p>
      <a href="${APP_URL}/jobs/${l.slug}" style="font-size:12.5px;color:#1d4ed8;font-weight:600;text-decoration:none;">View listing →</a>
    </div>
  `,
    )
    .join("");

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${listings.length} new ${frequency === "DAILY" ? "today" : "this week"} matching your preferences`,
    html: baseLayout(`
      <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 8px;letter-spacing:-0.4px;">New Opportunities for You</h2>
      <p style="font-size:14px;color:#64748b;margin:0 0 20px;">Hi ${studentName}, here are ${listings.length} new listings matching your job preferences:</p>
      ${listingsHtml}
      ${ctaButton("Browse All Jobs", `${APP_URL}/jobs`)}
      <p style="font-size:12px;color:#94a3b8;margin-top:20px;">
        You're receiving this because job alerts are enabled in your preferences. <a href="${APP_URL}/dashboard/career/preferences" style="color:#1d4ed8;">Manage preferences</a>.
      </p>
    `),
  });
}

// ── Deadline approaching — provider reminder ───────────────────

export async function sendDeadlineApproachingEmail({
  email,
  contactPerson,
  listingTitle,
  deadline,
  listingId,
}: {
  email: string;
  contactPerson: string;
  listingTitle: string;
  deadline: Date;
  listingId: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your listing closes in 3 days — ${listingTitle}`,
    html: baseLayout(
      `
      <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 8px;letter-spacing:-0.4px;">Application Deadline Approaching</h2>
      <p style="font-size:14px;color:#64748b;margin:0 0 20px;">Hi ${contactPerson},</p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
        Your listing <strong style="color:#0f172a;">${listingTitle}</strong> closes on <strong>${deadline.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong> — just 3 days away.
      </p>
      ${ctaButton("Review Applicants", `${APP_URL}/provider/listings/${listingId}/applications`, "#d97706")}
    `,
      "#d97706",
    ),
  });
}

// ── Listing auto-closed — deadline passed ──────────────────────

export async function sendListingAutoClosedEmail({
  email,
  contactPerson,
  listingTitle,
  listingId,
}: {
  email: string;
  contactPerson: string;
  listingTitle: string;
  listingId: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Listing closed — ${listingTitle}`,
    html: baseLayout(`
      <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 8px;letter-spacing:-0.4px;">Listing Automatically Closed</h2>
      <p style="font-size:14px;color:#64748b;margin:0 0 20px;">Hi ${contactPerson},</p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
        Your listing <strong style="color:#0f172a;">${listingTitle}</strong> has reached its application deadline and has been automatically closed. All existing applications are preserved.
      </p>
      ${ctaButton("Review Applicants", `${APP_URL}/provider/listings/${listingId}/applications`)}
    `),
  });
}
