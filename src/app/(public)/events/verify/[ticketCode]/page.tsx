import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  formatEventDate,
  formatEventTime,
  EVENT_MODE_LABELS,
  REGISTRATION_STATUS_CONFIG,
} from "@/lib/event-utils";
import { VerifyCheckinAction } from "@/features/public/components/VerifyCheckinAction";

export const metadata = { title: "Ticket Verification — MDSSC" };

export default async function VerifyTicketPage({
  params,
}: {
  params: Promise<{ ticketCode: string }>;
}) {
  const { ticketCode } = await params;
  const session = await auth();

  const registration = await db.eventRegistration.findUnique({
    where: { ticketCode },
    select: {
      id: true,
      status: true,
      ticketCode: true,
      checkedIn: true,
      checkedInAt: true,
      amountPaid: true,
      registeredAt: true,
      userId: true,
      guestName: true,
      guestEmail: true,
      guestPhone: true,
      user: { select: { name: true, email: true } },
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          mode: true,
          venue: true,
          startDate: true,
          endDate: true,
          pricingType: true,
          authorId: true,
        },
      },
    },
  });

  if (!registration) notFound();

  const attendeeName =
    registration.user?.name ?? registration.guestName ?? "Attendee";
  const attendeeEmail =
    registration.user?.email ?? registration.guestEmail ?? "—";
  const isGuest = !registration.userId;
  const statusCfg =
    REGISTRATION_STATUS_CONFIG[
      registration.status as keyof typeof REGISTRATION_STATUS_CONFIG
    ];

  const isStaff =
    !!session?.user &&
    (session.user.role === "ADMIN" ||
      (session.user.role === "CMS_EDITOR" &&
        registration.event.authorId === session.user.id));

  const canEnter = registration.status === "CONFIRMED";

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div style={{ maxWidth: "440px", width: "100%" }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          {/* Status accent bar */}
          <div
            style={{
              height: "5px",
              background: canEnter
                ? "linear-gradient(90deg, #16a34a, #22c55e)"
                : registration.status === "PENDING"
                  ? "linear-gradient(90deg, #eab308, #facc15)"
                  : "linear-gradient(90deg, #dc2626, #ef4444)",
            }}
          />

          {/* Cover */}
          {registration.event.coverImage && (
            <div style={{ height: "140px", overflow: "hidden" }}>
              <img
                src={registration.event.coverImage}
                alt={registration.event.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          <div style={{ padding: "1.75rem" }}>
            {/* Entry status icon */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: canEnter
                    ? "#f0fdf4"
                    : registration.status === "PENDING"
                      ? "#fefce8"
                      : "#fef2f2",
                  border: `2px solid ${canEnter ? "#86efac" : registration.status === "PENDING" ? "#fde68a" : "#fecaca"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                  fontSize: "28px",
                }}
              >
                {canEnter
                  ? "✓"
                  : registration.status === "PENDING"
                    ? "⏳"
                    : "✕"}
              </div>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: "0 0 4px",
                  letterSpacing: "-0.4px",
                  textAlign: "center",
                }}
              >
                {canEnter
                  ? "Valid Ticket"
                  : registration.status === "PENDING"
                    ? "Payment Pending"
                    : `Ticket ${statusCfg?.label}`}
              </p>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: statusCfg?.bg,
                  color: statusCfg?.color,
                }}
              >
                {statusCfg?.label}
              </span>
            </div>

            {/* Event info */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: "0 0 8px",
                }}
              >
                Event
              </p>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 10px",
                  letterSpacing: "-0.2px",
                }}
              >
                {registration.event.title}
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "12.5px",
                  color: "#475569",
                }}
              >
                <div>
                  📅 {formatEventDate(registration.event.startDate)} ·{" "}
                  {formatEventTime(registration.event.startDate)}
                </div>
                <div>
                  📍{" "}
                  {registration.event.mode === "OFFLINE"
                    ? (registration.event.venue ?? "Venue TBD")
                    : EVENT_MODE_LABELS[registration.event.mode]}
                </div>
              </div>
            </div>

            {/* Attendee info */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: "0 0 10px",
                }}
              >
                Attendee
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "12.5px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#94a3b8" }}>Name</span>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>
                    {attendeeName}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#94a3b8" }}>Email</span>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>
                    {attendeeEmail}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#94a3b8" }}>Type</span>
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      padding: "1px 8px",
                      borderRadius: "20px",
                      background: isGuest ? "#faf5ff" : "#eff6ff",
                      color: isGuest ? "#6b21a8" : "#1d4ed8",
                    }}
                  >
                    {isGuest ? "Guest" : "Registered User"}
                  </span>
                </div>
                {registration.amountPaid ? (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "#94a3b8" }}>Paid</span>
                    <span style={{ fontWeight: 600, color: "#0f172a" }}>
                      ₹{(registration.amountPaid / 100).toLocaleString("en-IN")}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Ticket code */}
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <p
                style={{
                  fontSize: "10.5px",
                  color: "#94a3b8",
                  margin: "0 0 4px",
                }}
              >
                Ticket Code
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                  letterSpacing: "0.06em",
                }}
              >
                {registration.ticketCode}
              </p>
            </div>

            {/* Check-in status */}
            {registration.checkedIn && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "10px",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#166534",
                    margin: 0,
                  }}
                >
                  ✓ Checked in at{" "}
                  {registration.checkedInAt?.toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}

            {/* Staff-only check-in action */}
            {isStaff && canEnter && !registration.checkedIn && (
              <VerifyCheckinAction ticketCode={registration.ticketCode} />
            )}

            {!isStaff && (
              <Link
                href={`/events/${registration.event.slug}`}
                style={{
                  display: "block",
                  width: "100%",
                  height: "44px",
                  lineHeight: "44px",
                  textAlign: "center",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                View Event Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
