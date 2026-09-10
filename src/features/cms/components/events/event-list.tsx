"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/app";
import {
  EVENT_STATUS_CONFIG,
  EVENT_MODE_COLORS,
  formatEventDate,
  formatEventPrice,
} from "@/lib/event-utils";
import type { EventStatus, EventMode, PricingType } from "@prisma/client";

type EventItem = {
  id: string;
  title: string;
  slug: string;
  status: EventStatus;
  eventType: string;
  mode: EventMode;
  pricingType: PricingType;
  price: number;
  startDate: Date;
  endDate: Date | null;
  capacity: number | null;
  registeredCount: number;
  isFeatured: boolean;
  coverImage: string | null;
  updatedAt: Date;
  author: { name: string | null };
  _count: { registrations: number };
};

const STATUS_TABS = [
  { key: "ALL", label: "All" },
  { key: "PUBLISHED", label: "Published" },
  { key: "DRAFT", label: "Drafts" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "ARCHIVED", label: "Archived" },
];

const TYPE_TABS = [
  { key: "ALL", label: "All Types" },
  { key: "UPCOMING", label: "Upcoming" },
  { key: "PAST", label: "Past" },
];

export function EventList({
  events,
  countMap,
  currentFilter,
  currentType,
  currentQuery,
}: {
  events: EventItem[];
  countMap: Record<string, number>;
  currentFilter: string;
  currentType: string;
  currentQuery: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams({
      ...(currentFilter !== "ALL" ? { status: currentFilter } : {}),
      ...(currentType !== "ALL" ? { type: currentType } : {}),
      ...(currentQuery ? { q: currentQuery } : {}),
      ...overrides,
    });
    const str = params.toString();
    return `${ROUTES.cmsEvents}${str ? `?${str}` : ""}`;
  }

  // async function handleDelete(id: string, title: string) {
  //   if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
  //   setDeleting(id);
  //   await fetch(`/api/cms/events/${id}`, { method: "DELETE" });
  //   setDeleting(null);
  //   router.refresh();
  // }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/cms/events/${id}`, { method: "DELETE" });
    const json = await res.json();
    setDeleting(null);
    if (!json.success) {
      alert(json.error ?? "Failed to delete event.");
      return;
    }
    router.refresh();
  }

  async function handlePublish(id: string, currentStatus: EventStatus) {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await fetch(`/api/cms/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  return (
    <div>
      {/* Status filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "10px",
          background: "#f8fafc",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
        }}
      >
        {STATUS_TABS.map((tab) => {
          const isActive = currentFilter === tab.key;
          const count = countMap[tab.key] ?? 0;
          return (
            <Link
              key={tab.key}
              href={buildHref({ status: tab.key })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "9px",
                fontSize: "12.5px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#1d4ed8" : "#64748b",
                background: isActive ? "#fff" : "transparent",
                textDecoration: "none",
                border: isActive
                  ? "1px solid #bfdbfe"
                  : "1px solid transparent",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "20px",
                  background: isActive ? "#dbeafe" : "#e2e8f0",
                  color: isActive ? "#1d4ed8" : "#64748b",
                }}
              >
                {tab.key === "ALL"
                  ? (countMap.ALL ?? 0)
                  : (countMap[tab.key] ?? 0)}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Type filter */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem" }}>
        {TYPE_TABS.map((tab) => (
          <Link
            key={tab.key}
            href={buildHref({ type: tab.key })}
            style={{
              height: "30px",
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: currentType === tab.key ? 600 : 500,
              color: currentType === tab.key ? "#1d4ed8" : "#64748b",
              background: currentType === tab.key ? "#eff6ff" : "#f8fafc",
              border:
                currentType === tab.key
                  ? "1px solid #bfdbfe"
                  : "1px solid #e2e8f0",
              textDecoration: "none",
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Search */}
      <form
        method="GET"
        style={{ marginBottom: "1.25rem", display: "flex", gap: "8px" }}
      >
        {currentFilter !== "ALL" && (
          <input type="hidden" name="status" value={currentFilter} />
        )}
        {currentType !== "ALL" && (
          <input type="hidden" name="type" value={currentType} />
        )}
        <div style={{ position: "relative" }}>
          <svg
            style={{
              position: "absolute",
              left: "11px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            name="q"
            defaultValue={currentQuery}
            placeholder="Search events…"
            style={{
              height: "38px",
              paddingLeft: "34px",
              paddingRight: "12px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "13px",
              width: "260px",
              background: "#fff",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            height: "38px",
            padding: "0 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            background: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            color: "#475569",
            cursor: "pointer",
          }}
        >
          Search
        </button>
        {currentQuery && (
          <Link
            href={ROUTES.cmsEvents}
            style={{
              height: "38px",
              padding: "0 14px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              background: "#fff",
              fontSize: "13px",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            Clear
          </Link>
        )}
      </form>

      {/* Event list */}
      {events.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
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
            No events found
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#64748b",
              margin: "0 0 1.25rem",
            }}
          >
            {currentQuery
              ? "Try a different search"
              : "Create your first event"}
          </p>
          <Link
            href={ROUTES.cmsEventsNew}
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
            + New Event
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {events.map((event) => {
            const statusCfg = EVENT_STATUS_CONFIG[event.status];
            const modeCfg = EVENT_MODE_COLORS[event.mode];
            const isFull =
              event.capacity !== null &&
              event.registeredCount >= event.capacity;

            return (
              <div
                key={event.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e8edf2",
                  borderRadius: "14px",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                {/* Cover thumbnail */}
                <div
                  style={{
                    width: "72px",
                    height: "48px",
                    borderRadius: "8px",
                    background: "#f1f5f9",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Event info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Status badge */}
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: statusCfg.bg,
                        color: statusCfg.color,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: statusCfg.dot,
                        }}
                      />
                      {statusCfg.label}
                    </span>
                    {/* Mode badge */}
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: modeCfg.bg,
                        color: modeCfg.color,
                        flexShrink: 0,
                      }}
                    >
                      {event.mode === "ONLINE"
                        ? "Online"
                        : event.mode === "OFFLINE"
                          ? "In Person"
                          : "Hybrid"}
                    </span>
                    {/* Featured badge */}
                    {event.isFeatured && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: "#fef9c3",
                          color: "#854d0e",
                          border: "1px solid #fde68a",
                          flexShrink: 0,
                        }}
                      >
                        ★ Featured
                      </span>
                    )}
                    {/* Price */}
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color:
                          event.pricingType === "FREE" ? "#16a34a" : "#0f172a",
                        flexShrink: 0,
                      }}
                    >
                      {formatEventPrice(event.pricingType, event.price)}
                    </span>
                  </div>

                  {/* Title */}
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#0f172a",
                      margin: "0 0 4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {event.title}
                  </p>

                  {/* Meta row */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      fontSize: "11.5px",
                      color: "#94a3b8",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>📅 {formatEventDate(event.startDate)}</span>
                    <span>
                      👥 {event.registeredCount}
                      {event.capacity ? `/${event.capacity}` : ""} registered
                      {isFull && (
                        <span style={{ color: "#ef4444", fontWeight: 600 }}>
                          {" "}
                          · Full
                        </span>
                      )}
                    </span>
                    <span>
                      Updated{" "}
                      {event.updatedAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    flexShrink: 0,
                    alignItems: "center",
                  }}
                >
                  {/* Registrations */}
                  <Link
                    href={ROUTES.cmsEventRegs(event.id)}
                    style={{
                      height: "30px",
                      padding: "0 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      background: "#fff",
                      color: "#475569",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {event._count.registrations}
                  </Link>

                  {/* Edit */}
                  <Link
                    href={ROUTES.cmsEventEdit(event.id)}
                    style={{
                      height: "30px",
                      padding: "0 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      background: "#fff",
                      color: "#475569",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Edit
                  </Link>

                  {/* Publish / Unpublish — DRAFT ya PUBLISHED pe */}
                  {(event.status === "DRAFT" ||
                    event.status === "PUBLISHED") && (
                    <button
                      onClick={() => handlePublish(event.id, event.status)}
                      style={{
                        height: "30px",
                        padding: "0 12px",
                        border:
                          event.status === "PUBLISHED"
                            ? "1px solid #fecaca"
                            : "1px solid #bfdbfe",
                        borderRadius: "8px",
                        background:
                          event.status === "PUBLISHED" ? "#fef2f2" : "#eff6ff",
                        color:
                          event.status === "PUBLISHED" ? "#dc2626" : "#1d4ed8",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {event.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(event.id, event.title)}
                    disabled={deleting === event.id}
                    style={{
                      height: "30px",
                      padding: "0 10px",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                      background: "#fef2f2",
                      color: "#ef4444",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {deleting === event.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
