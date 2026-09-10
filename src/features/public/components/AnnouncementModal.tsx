"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Announcement = {
  id: string;
  title: string | null;
  content: string;
  type: string;
};

type Props = {
  announcement: Announcement;
};

const TYPE_CONFIG = {
  info: {
    accent: "#1d4ed8",
    iconBg: "#eff6ff",
    badgeText: "#1d4ed8",
    badgeBg: "#dbeafe",
    badge: "Announcement",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  warning: {
    accent: "#d97706",
    iconBg: "#fffbeb",
    badgeText: "#92400e",
    badgeBg: "#fef3c7",
    badge: "Important",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#d97706"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  success: {
    accent: "#16a34a",
    iconBg: "#f0fdf4",
    badgeText: "#166534",
    badgeBg: "#dcfce7",
    badge: "Update",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
} as const;

function parseContent(content: string, accentColor: string) {
  const parts = content.split(/(\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    const match = part.match(/\[(.*?)\]\((.*?)\)/);
    if (match) {
      return (
        <Link
          key={i}
          href={match[2]}
          style={{
            color: accentColor,
            fontWeight: 700,
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          {match[1]}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function AnnouncementModal({ announcement }: Props) {
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // 800ms delay — page load ke baad smoothly open ho
    const t1 = setTimeout(() => setOpen(true), 800);
    const t2 = setTimeout(() => setAnimate(true), 850);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  function close() {
    setAnimate(false);
    setTimeout(() => setOpen(false), 200);
  }

  if (!open) return null;

  const cfg =
    TYPE_CONFIG[announcement.type as keyof typeof TYPE_CONFIG] ??
    TYPE_CONFIG.info;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          opacity: animate ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          pointerEvents: "none",
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ann-title"
          style={{
            background: "#fff",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "440px",
            overflow: "hidden",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.08)",
            pointerEvents: "auto",
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            opacity: animate ? 1 : 0,
            transform: animate
              ? "translateY(0) scale(1)"
              : "translateY(24px) scale(0.96)",
            transition:
              "opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Accent top bar */}
          <div style={{ height: "4px", background: cfg.accent }} />

          {/* Header */}
          <div
            style={{
              padding: "1.25rem 1.25rem 0",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "11px",
                  background: cfg.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {cfg.icon}
              </div>
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: "20px",
                  background: cfg.badgeBg,
                  color: cfg.badgeText,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {cfg.badge}
              </span>
            </div>

            <button
              onClick={close}
              aria-label="Close"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#64748b",
                flexShrink: 0,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
            {announcement.title && (
              <h2
                id="ann-title"
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: "0 0 8px",
                  letterSpacing: "-0.4px",
                  lineHeight: 1.35,
                }}
              >
                {announcement.title}
              </h2>
            )}
            <p
              style={{
                fontSize: "14px",
                color: "#475569",
                margin: 0,
                lineHeight: 1.75,
              }}
            >
              {parseContent(announcement.content, cfg.accent)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
