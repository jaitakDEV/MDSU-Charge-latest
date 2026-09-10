import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { EventCard } from "@/features/public/components/EventCard";
import type { EventMode, PricingType } from "@prisma/client";

export const metadata = {
  title: "Upcoming Events — MDSSC",
  description: "Browse upcoming events at MDSU-CHARGE",
};

const ACTIVE_GRADIENT = "linear-gradient(135deg, #f57a22 0%, #ff9f52 100%)";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; pricing?: string; tag?: string }>;
}) {
  const { mode, pricing, tag } = await searchParams;

  const events = await db.event.findMany({
    where: {
      status: "PUBLISHED",
      // eventType: "UPCOMING",
      startDate: { gte: new Date() },
      ...(mode ? { mode: mode as EventMode } : {}),
      ...(pricing ? { pricingType: pricing as PricingType } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
    },
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      mode: true,
      startDate: true,
      pricingType: true,
      price: true,
      capacity: true,
      registeredCount: true,
      isFeatured: true,
      tags: true,
    },
  });

  const allTags = [...new Set(events.flatMap((e) => e.tags))].filter(Boolean);
  const freeCount = events.filter((e) => e.pricingType === "FREE").length;

  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams({
      ...(mode ? { mode } : {}),
      ...(pricing ? { pricing } : {}),
      ...(tag ? { tag } : {}),
      ...overrides,
    });
    const str = params.toString();
    return `${ROUTES.events}${str ? `?${str}` : ""}`;
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #8a3d0e 0%, #d6641c 45%, #f57a22 80%, #ff9a56 100%)",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* decorative glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,122,34,0.35) 0%, rgba(245,122,34,0) 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: "1180px",
            margin: "0 auto",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ marginBottom: "10px" }}></div>
            <h1
              style={{
                fontSize: "clamp(24px, 4.2vw, 36px)",
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 8px",
                letterSpacing: "-0.6px",
              }}
            >
              Upcoming Events
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#f3dfcb",
                margin: 0,
                maxWidth: "480px",
                lineHeight: 1.6,
              }}
            >
              Workshops, fests and sessions happening next at MDSU-CHARGE
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={ROUTES.eventsPost}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                height: "40px",
                padding: "0 18px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
              }}
            >
              View Past Events
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "1.75rem 1.5rem 4rem",
        }}
      >
        {/* Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "1.75rem",
          }}
        >
          {["ALL", "ONLINE", "OFFLINE", "HYBRID"].map((m) => {
            const isActive = mode === m || (!mode && m === "ALL");
            return (
              <Link
                key={m}
                href={
                  m === "ALL" ? buildHref({ mode: "" }) : buildHref({ mode: m })
                }
                style={{
                  height: "34px",
                  padding: "0 14px",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "20px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  background: isActive ? ACTIVE_GRADIENT : "#fff",
                  color: isActive ? "#fff" : "#475569",
                  border: isActive
                    ? "1px solid transparent"
                    : "1px solid #e2e8f0",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {m === "ALL"
                  ? "All Modes"
                  : m === "ONLINE"
                    ? "Online"
                    : m === "OFFLINE"
                      ? "In Person"
                      : "Hybrid"}
              </Link>
            );
          })}
          <div
            style={{
              width: "1px",
              height: "20px",
              background: "#ffd3ac",
              margin: "0 4px",
              flexShrink: 0,
            }}
          />
          {["FREE", "PAID"].map((p) => {
            const isActive = pricing === p;
            return (
              <Link
                key={p}
                href={
                  isActive
                    ? buildHref({ pricing: "" })
                    : buildHref({ pricing: p })
                }
                style={{
                  height: "34px",
                  padding: "0 14px",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "20px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  background: isActive ? ACTIVE_GRADIENT : "#fff",
                  color: isActive ? "#fff" : "#475569",
                  border: isActive
                    ? "1px solid transparent"
                    : "1px solid #e2e8f0",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {p === "FREE" ? "Free" : "Paid"}
              </Link>
            );
          })}
        </div>

        {/* Grid */}
        {events.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #e8edf2",
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                margin: "0 auto 14px",
                borderRadius: "50%",
                background: "#fff8f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f0a868"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#0f172a",
                margin: "0 0 6px",
              }}
            >
              No upcoming events
            </p>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              Check back soon for new events
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
