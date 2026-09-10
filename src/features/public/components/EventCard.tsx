import Link from "next/link";
import { ROUTES } from "@/config/app";
import {
  formatEventDate,
  formatEventPrice,
  getCapacityPercent,
  EVENT_MODE_LABELS,
  EVENT_MODE_COLORS,
} from "@/lib/event-utils";
import type { EventMode, PricingType } from "@prisma/client";

type EventCardData = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  mode: EventMode;
  startDate: Date;
  pricingType: PricingType;
  price: number;
  capacity: number | null;
  registeredCount: number;
  isFeatured: boolean;
  tags: string[];
};

export function EventCard({
  event,
  isPast = false,
}: {
  event: EventCardData;
  isPast?: boolean;
}) {
  const modeCfg = EVENT_MODE_COLORS[event.mode];
  const capacityPct = getCapacityPercent(event.capacity, event.registeredCount);
  const isFull =
    event.capacity !== null && event.registeredCount >= event.capacity;

  const dateObj = new Date(event.startDate);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString("en-IN", { month: "short" });

  return (
    <Link
      href={ROUTES.eventDetail(event.slug)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        border: "1px solid #e8edf2",
        borderRadius: "16px",
        overflow: "hidden",
        textDecoration: "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.14s",
        opacity: isPast ? 0.85 : 1,
      }}
    >
      {/* Thumbnail with date badge */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          background: "#f1f5f9",
          overflow: "hidden",
        }}
      >
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#bfdbfe"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        )}

        {/* Date badge */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "#fff",
            borderRadius: "10px",
            padding: "6px 10px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            minWidth: "48px",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "#0f172a",
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
              color: "#1d4ed8",
              margin: "2px 0 0",
              textTransform: "uppercase",
            }}
          >
            {month}
          </p>
        </div>

        {event.isFeatured && !isPast && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "20px",
              background: "#fbbf24",
              color: "#451a03",
            }}
          >
            ★ Featured
          </span>
        )}
        {isFull && !isPast && (
          <span
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "20px",
              background: "#dc2626",
              color: "#fff",
            }}
          >
            Full
          </span>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginBottom: "8px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "10.5px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "6px",
              background: modeCfg.bg,
              color: modeCfg.color,
            }}
          >
            {EVENT_MODE_LABELS[event.mode]}
          </span>
          <span
            style={{
              fontSize: "10.5px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "6px",
              background: event.pricingType === "FREE" ? "#f0fdf4" : "#f8fafc",
              color: event.pricingType === "FREE" ? "#166534" : "#64748b",
              border:
                event.pricingType === "FREE" ? "none" : "1px solid #e2e8f0",
            }}
          >
            {formatEventPrice(event.pricingType, event.price)}
          </span>
        </div>

        <h3
          style={{
            fontSize: "14.5px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 5px",
            lineHeight: 1.4,
            letterSpacing: "-0.2px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.title}
        </h3>

        {event.description && (
          <p
            style={{
              fontSize: "12.5px",
              color: "#64748b",
              margin: "0 0 12px",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.description}
          </p>
        )}

        {/* Capacity bar — only for upcoming */}
        {!isPast && event.capacity !== null && (
          <div style={{ marginTop: "auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "#94a3b8",
                marginBottom: "4px",
              }}
            >
              <span>
                {event.registeredCount}/{event.capacity} spots filled
              </span>
            </div>
            <div
              style={{
                height: "4px",
                background: "#f1f5f9",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "4px",
                  borderRadius: "99px",
                  background: isFull ? "#ef4444" : "#1d4ed8",
                  width: `${capacityPct}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
