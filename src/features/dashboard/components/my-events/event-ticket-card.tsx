"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/app";
import {
  formatEventDate,
  formatEventTime,
  EVENT_MODE_LABELS,
} from "@/lib/event-utils";
import QRCode from "qrcode";

type Registration = {
  id: string;
  status: string;
  ticketCode: string;
  checkedIn: boolean;
  checkedInAt: Date | null;
  amountPaid: number | null;
  registeredAt: Date;
  event: {
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
    mode: string;
    venue: string | null;
    startDate: Date;
    endDate: Date | null;
    pricingType: string;
  };
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  PENDING: { label: "Pending", bg: "#fefce8", color: "#854d0e" },
  CONFIRMED: { label: "Confirmed", bg: "#f0fdf4", color: "#166534" },
  CANCELLED: { label: "Cancelled", bg: "#fef2f2", color: "#991b1b" },
  REFUNDED: { label: "Refunded", bg: "#faf5ff", color: "#6b21a8" },
};

export function EventTicketCard({
  registration,
}: {
  registration: Registration;
}) {
  const [qrCode, setQrCode] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const { event } = registration;
  const statusCfg = STATUS_CONFIG[registration.status];
  const isCancelled =
    registration.status === "CANCELLED" || registration.status === "REFUNDED";

  // Generate QR client-side when opened
  useEffect(() => {
    if (showQR && !qrCode) {
      const ticketUrl = `${window.location.origin}/events/verify/${registration.ticketCode}`;
      QRCode.toDataURL(ticketUrl, {
        width: 240,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
      }).then(setQrCode);
    }
  }, [showQR, qrCode, registration.ticketCode]);

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${isCancelled ? "#fecaca" : "#e8edf2"}`,
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        opacity: isCancelled ? 0.75 : 1,
      }}
    >
      {/* Cover */}
      <div
        style={{
          position: "relative",
          height: "120px",
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
              background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
            }}
          />
        )}
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "10.5px",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: "20px",
            background: statusCfg.bg,
            color: statusCfg.color,
          }}
        >
          {statusCfg.label}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "1.1rem" }}>
        <Link
          href={ROUTES.eventDetail(event.slug)}
          style={{ textDecoration: "none" }}
        >
          <h3
            style={{
              fontSize: "14.5px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 8px",
              lineHeight: 1.4,
              letterSpacing: "-0.2px",
            }}
          >
            {event.title}
          </h3>
        </Link>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            marginBottom: "12px",
            fontSize: "12.5px",
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatEventDate(event.startDate)} ·{" "}
            {formatEventTime(event.startDate)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.mode === "OFFLINE"
              ? (event.venue ?? "Venue TBD")
              : EVENT_MODE_LABELS[event.mode as keyof typeof EVENT_MODE_LABELS]}
          </div>
          {registration.amountPaid && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Paid ₹{(registration.amountPaid / 100).toLocaleString("en-IN")}
            </div>
          )}
        </div>

        {/* Check-in status */}
        {registration.checkedIn && (
          <div
            style={{
              padding: "8px 10px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              marginBottom: "12px",
              fontSize: "11.5px",
              color: "#166534",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            ✓ Checked in at{" "}
            {registration.checkedInAt?.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}

        {/* Actions */}
        {registration.status === "CONFIRMED" && !isCancelled && (
          <button
            onClick={() => setShowQR(!showQR)}
            style={{
              width: "100%",
              height: "38px",
              border: "1px solid #bfdbfe",
              borderRadius: "10px",
              background: "#eff6ff",
              color: "#1d4ed8",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            {showQR ? "Hide QR Ticket" : "Show QR Ticket"}
          </button>
        )}

        {registration.status === "PENDING" && (
          <div
            style={{
              padding: "8px 10px",
              background: "#fefce8",
              border: "1px solid #fde68a",
              borderRadius: "8px",
              fontSize: "11.5px",
              color: "#854d0e",
              textAlign: "center",
            }}
          >
            Payment processing…
          </div>
        )}

        {/* QR display */}
        {showQR && (
          <div
            style={{
              marginTop: "12px",
              padding: "16px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            {qrCode ? (
              <>
                <img
                  src={qrCode}
                  alt="QR Ticket"
                  width={180}
                  height={180}
                  style={{ margin: "0 auto 10px", borderRadius: "8px" }}
                />
                <p
                  style={{
                    fontSize: "10.5px",
                    color: "#94a3b8",
                    margin: "0 0 3px",
                  }}
                >
                  Ticket Code
                </p>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                    letterSpacing: "0.05em",
                  }}
                >
                  {registration.ticketCode}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    margin: "8px 0 0",
                  }}
                >
                  Show this at the venue for entry
                </p>
              </>
            ) : (
              <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                Generating QR code…
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
