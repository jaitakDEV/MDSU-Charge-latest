"use client";

import { useState } from "react";
import { getDaysRemaining, getAccessStatus } from "@/lib/access-utils";
import Link from "next/link";
import { ROUTES } from "@/config/app";

export function ExpiryWarningBanner({
  accessExpiresAt,
  courseSlug,
}: {
  accessExpiresAt: Date | null;
  courseSlug: string;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const status = getAccessStatus(accessExpiresAt);
  const days = getDaysRemaining(accessExpiresAt);

  // LIFETIME ya ACTIVE (>7 days) — banner nahi dikhana
  if (status === "LIFETIME" || status === "ACTIVE") return null;

  if (status === "EXPIRED") {
    return (
      <div
        style={{
          padding: "14px 18px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "#fecaca",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#991b1b",
              margin: "0 0 2px",
            }}
          >
            Your access has expired
          </p>
          <p style={{ fontSize: "12.5px", color: "#dc2626", margin: 0 }}>
            You can no longer watch lectures for this course. Your certificate
            (if earned) is still downloadable.
          </p>
        </div>
        <Link
          href={ROUTES.courseDetail(courseSlug)}
          style={{
            height: "34px",
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            borderRadius: "9px",
            background: "#dc2626",
            color: "#fff",
            fontSize: "12.5px",
            fontWeight: 600,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          Renew
        </Link>
      </div>
    );
  }

  // EXPIRING_SOON — yellow warning
  const isUrgent = days !== null && days <= 1;

  return (
    <div
      style={{
        padding: "12px 16px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: isUrgent ? "#fff7ed" : "#fefce8",
        border: `1px solid ${isUrgent ? "#fed7aa" : "#fde68a"}`,
      }}
    >
      <div
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "9px",
          flexShrink: 0,
          background: isUrgent ? "#fed7aa" : "#fef3c7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isUrgent ? "#c2410c" : "#d97706"}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: isUrgent ? "#9a3412" : "#92400e",
            margin: "0 0 2px",
          }}
        >
          {days === 0
            ? "Your access expires today"
            : days === 1
              ? "Your access expires tomorrow"
              : `Your access expires in ${days} days`}
        </p>
        <p
          style={{
            fontSize: "12px",
            color: isUrgent ? "#c2410c" : "#b45309",
            margin: 0,
          }}
        >
          Complete the course before your access ends to earn your certificate.
        </p>
      </div>

      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
        <button
          onClick={() => setDismissed(true)}
          style={{
            height: "32px",
            padding: "0 10px",
            border: "1px solid #fde68a",
            borderRadius: "8px",
            background: "transparent",
            color: "#92400e",
            fontSize: "12px",
            cursor: "pointer",
          }}
          aria-label="Dismiss warning"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
