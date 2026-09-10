import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { EventTicketCard } from "@/features/dashboard/components/my-events/event-ticket-card";
import { isEventPast } from "@/lib/event-utils";
import Link from "next/link";

export const metadata = { title: "My Events — MDSSC" };

export default async function MyEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const { filter } = await searchParams;
  const activeFilter = filter ?? "upcoming";

  const registrations = await db.eventRegistration.findMany({
    where: { userId: session.user.id },
    orderBy: { registeredAt: "desc" },
    select: {
      id: true,
      status: true,
      ticketCode: true,
      checkedIn: true,
      checkedInAt: true,
      amountPaid: true,
      registeredAt: true,
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
        },
      },
    },
  });

  const upcoming = registrations.filter(
    (r) => !isEventPast(r.event.startDate) && r.status !== "CANCELLED",
  );
  const past = registrations.filter(
    (r) => isEventPast(r.event.startDate) || r.status === "CANCELLED",
  );

  const displayList = activeFilter === "past" ? past : upcoming;

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #f1f5f9",
          marginBottom: "1.75rem",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#94a3b8",
            margin: "0 0 4px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Student Dashboard
        </p>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          My Events
        </h1>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "1.5rem",
          background: "#f8fafc",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
        }}
      >
        <Link
          href="?filter=upcoming"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 16px",
            borderRadius: "9px",
            fontSize: "12.5px",
            fontWeight: activeFilter === "upcoming" ? 600 : 500,
            color: activeFilter === "upcoming" ? "#1d4ed8" : "#64748b",
            background: activeFilter === "upcoming" ? "#fff" : "transparent",
            textDecoration: "none",
            border:
              activeFilter === "upcoming"
                ? "1px solid #bfdbfe"
                : "1px solid transparent",
          }}
        >
          Upcoming
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: "20px",
              background: activeFilter === "upcoming" ? "#dbeafe" : "#e2e8f0",
              color: activeFilter === "upcoming" ? "#1d4ed8" : "#64748b",
            }}
          >
            {upcoming.length}
          </span>
        </Link>
        <Link
          href="?filter=past"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 16px",
            borderRadius: "9px",
            fontSize: "12.5px",
            fontWeight: activeFilter === "past" ? 600 : 500,
            color: activeFilter === "past" ? "#1d4ed8" : "#64748b",
            background: activeFilter === "past" ? "#fff" : "transparent",
            textDecoration: "none",
            border:
              activeFilter === "past"
                ? "1px solid #bfdbfe"
                : "1px solid transparent",
          }}
        >
          Past
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: "20px",
              background: activeFilter === "past" ? "#dbeafe" : "#e2e8f0",
              color: activeFilter === "past" ? "#1d4ed8" : "#64748b",
            }}
          >
            {past.length}
          </span>
        </Link>
      </div>

      {/* List */}
      {displayList.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            background: "#fff",
            border: "1px dashed #bfdbfe",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            {activeFilter === "past" ? "No past events" : "No upcoming events"}
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 1rem" }}>
            {activeFilter === "past"
              ? "Events you attended will show up here"
              : "Browse events to register"}
          </p>
          <Link
            href={ROUTES.events}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: "36px",
              padding: "0 16px",
              borderRadius: "9px",
              background: "#1d4ed8",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Browse Events →
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "16px",
          }}
        >
          {displayList.map((registration) => (
            <EventTicketCard
              key={registration.id}
              registration={registration}
            />
          ))}
        </div>
      )}
    </div>
  );
}
