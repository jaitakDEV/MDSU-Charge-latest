"use client";

import Link from "next/link";
import { ROUTES } from "@/config/app";
import { ChevronRight, Calendar } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
};

export function EventsMarqueeClient({ events }: { events: EventItem[] }) {
  // Empty state — placeholder
  if (events.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          background: "#fff",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          minHeight: "300px",
          textAlign: "center",
        }}
      >
        <Calendar size={32} strokeWidth={1.5} color="#cbd5e1" />
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#64748b",
            margin: "12px 0 4px",
          }}
        >
          No upcoming events
        </p>
        <p style={{ fontSize: "12.5px", color: "#94a3b8", margin: 0 }}>
          Check back soon for new events
        </p>
      </div>
    );
  }

  // Duplicate the list for seamless infinite scroll
  const duplicatedEvents = [...events, ...events];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          padding: "0 4px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#0951a5",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              margin: "0 0 6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "24px",
                height: "2px",
                background: "#0951a5",
                borderRadius: "2px",
              }}
            />
            Upcoming
          </p>
          <h3
            style={{
              fontSize: "clamp(18px, 2vw, 22px)",
              fontWeight: 800,
              color: "#1a3a6b",
              margin: 0,
              letterSpacing: "-0.3px",
            }}
          >
            Events
          </h3>
        </div>
        <Link
          href={ROUTES.events}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#1d4ed8",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          View All
          <ChevronRight size={15} strokeWidth={2.5} />
        </Link>
      </div>

      {/* Marquee viewport */}
      <div
        className="events-marquee-viewport"
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background: "#fff",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="events-marquee-track">
          {duplicatedEvents.map((event, i) => {
            const dateObj = new Date(event.startDate);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleDateString("en-IN", {
              month: "short",
            });

            return (
              <Link
                key={`${event.id}-${i}`}
                href={ROUTES.eventDetail(event.slug)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 16px",
                  textDecoration: "none",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {/* Date block */}
                <div
                  style={{ textAlign: "center", flexShrink: 0, width: "44px" }}
                >
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#1d4ed8",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {day}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#94a3b8",
                      margin: "2px 0 0",
                      textTransform: "uppercase",
                    }}
                  >
                    {month}
                  </p>
                </div>

                {/* Divider */}
                <div
                  style={{
                    width: "1px",
                    height: "32px",
                    background: "#e2e8f0",
                    flexShrink: 0,
                  }}
                />

                {/* Title */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 4px",
                      lineHeight: 1.35,
                      letterSpacing: "-0.1px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {event.title}
                  </p>
                  <div
                    style={{
                      width: "20px",
                      height: "2px",
                      background: "#3b82f6",
                      borderRadius: "2px",
                    }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CSS animation */}
      <style>{`
        .events-marquee-track {
          display: flex;
          flex-direction: column;
          animation: marquee-scroll 25s linear infinite;
        }
        .events-marquee-viewport:hover .events-marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}
