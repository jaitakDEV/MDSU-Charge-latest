"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/app";
import { REGISTRATION_STATUS_CONFIG } from "@/lib/event-utils";

type Registration = {
  id: string;
  status: string;
  ticketCode: string;
  checkedIn: boolean;
  checkedInAt: Date | null;
  amountPaid: number | null;
  razorpayPaymentId: string | null;
  registeredAt: Date;
  userId: string | null;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  user: { name: string | null; email: string } | null;
  event: { id: string; title: string; pricingType: string };
};

export function AdminRegistrationsTable({
  registrations,
  events,
  currentFilter,
  currentQuery,
  currentEventId,
  page,
  totalPages,
}: {
  registrations: Registration[];
  events: { id: string; title: string }[];
  currentFilter: string;
  currentQuery: string;
  currentEventId: string;
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams({
      ...(currentFilter !== "ALL" ? { status: currentFilter } : {}),
      ...(currentQuery ? { q: currentQuery } : {}),
      ...(currentEventId ? { eventId: currentEventId } : {}),
      ...overrides,
    });
    return `${ROUTES.adminEventRegs}${params.toString() ? `?${params}` : ""}`;
  }

  async function handleManualCheckin(id: string) {
    setProcessing(id);
    await fetch(`/api/admin/event-registrations/${id}/checkin`, {
      method: "POST",
    });
    setProcessing(null);
    router.refresh();
  }

  async function handleRefund(id: string) {
    if (
      !confirm(
        "Issue refund for this registration? This will cancel the ticket.",
      )
    )
      return;
    setProcessing(id);
    const res = await fetch(`/api/admin/event-registrations/${id}/refund`, {
      method: "POST",
    });
    const json = await res.json();
    setProcessing(null);
    if (!json.success) {
      alert(json.error);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        <form method="GET" style={{ display: "flex", gap: "8px" }}>
          {currentFilter !== "ALL" && (
            <input type="hidden" name="status" value={currentFilter} />
          )}
          {currentEventId && (
            <input type="hidden" name="eventId" value={currentEventId} />
          )}
          <input
            name="q"
            defaultValue={currentQuery}
            placeholder="Search by name, email…"
            style={{
              height: "38px",
              padding: "0 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "13px",
              width: "260px",
            }}
          />
        </form>

        <select
          value={currentEventId}
          onChange={(e) => router.push(buildHref({ eventId: e.target.value }))}
          style={{
            height: "38px",
            padding: "0 12px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            background: "#fff",
          }}
        >
          <option value="">All Events</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "4px" }}>
          {["ALL", "CONFIRMED", "PENDING", "CANCELLED", "REFUNDED"].map((s) => (
            <a
              key={s}
              href={buildHref({ status: s })}
              style={{
                height: "38px",
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
                borderRadius: "9px",
                fontSize: "12px",
                fontWeight: currentFilter === s ? 600 : 500,
                color: currentFilter === s ? "#1d4ed8" : "#64748b",
                textDecoration: "none",
                background: currentFilter === s ? "#eff6ff" : "#f8fafc",
                border:
                  currentFilter === s
                    ? "1px solid #bfdbfe"
                    : "1px solid #e2e8f0",
              }}
            >
              {s === "ALL" ? "All" : s[0] + s.slice(1).toLowerCase()}
            </a>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "14px",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12.5px",
          }}
        >
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {[
                "Attendee",
                "Event",
                "Type",
                "Status",
                "Check-in",
                "Amount",
                "Registered",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#64748b",
                    borderBottom: "1px solid #e8edf2",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, i) => {
              const name = reg.user?.name ?? reg.guestName ?? "—";
              const email = reg.user?.email ?? reg.guestEmail ?? "—";
              const isGuest = !reg.userId;
              const statusCfg =
                REGISTRATION_STATUS_CONFIG[
                  reg.status as keyof typeof REGISTRATION_STATUS_CONFIG
                ];
              const isPaid = reg.event.pricingType === "PAID";

              return (
                <tr
                  key={reg.id}
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    background: i % 2 === 1 ? "#fafbfc" : "#fff",
                  }}
                >
                  <td style={{ padding: "11px 14px" }}>
                    <p
                      style={{
                        margin: "0 0 1px",
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      {name}
                    </p>
                    <p
                      style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}
                    >
                      {email}
                    </p>
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      color: "#334155",
                      maxWidth: "160px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {reg.event.title}
                    </p>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: isGuest ? "#faf5ff" : "#eff6ff",
                        color: isGuest ? "#6b21a8" : "#1d4ed8",
                      }}
                    >
                      {isGuest ? "Guest" : "User"}
                    </span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: statusCfg?.bg,
                        color: statusCfg?.color,
                      }}
                    >
                      {statusCfg?.label}
                    </span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    {reg.checkedIn ? (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#16a34a",
                          fontWeight: 600,
                        }}
                      >
                        ✓ Checked in
                      </span>
                    ) : reg.status === "CONFIRMED" ? (
                      <button
                        onClick={() => handleManualCheckin(reg.id)}
                        disabled={processing === reg.id}
                        style={{
                          fontSize: "11px",
                          padding: "3px 9px",
                          border: "1px solid #bfdbfe",
                          borderRadius: "7px",
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        {processing === reg.id ? "…" : "Check in"}
                      </button>
                    ) : (
                      <span style={{ fontSize: "11px", color: "#cbd5e1" }}>
                        —
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      fontWeight: 600,
                      color: "#0f172a",
                    }}
                  >
                    {reg.amountPaid
                      ? `₹${(reg.amountPaid / 100).toLocaleString("en-IN")}`
                      : "Free"}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      color: "#94a3b8",
                      fontSize: "11.5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {reg.registeredAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    {isPaid &&
                      reg.status === "CONFIRMED" &&
                      reg.razorpayPaymentId && (
                        <button
                          onClick={() => handleRefund(reg.id)}
                          disabled={processing === reg.id}
                          style={{
                            height: "26px",
                            padding: "0 10px",
                            border: "1px solid #fecaca",
                            borderRadius: "7px",
                            background: "#fef2f2",
                            color: "#dc2626",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {processing === reg.id ? "…" : "Refund"}
                        </button>
                      )}
                  </td>
                </tr>
              );
            })}
            {registrations.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}
        >
          {Array.from(
            { length: Math.min(totalPages, 10) },
            (_, i) => i + 1,
          ).map((p) => (
            <a
              key={p}
              href={buildHref({ page: String(p) })}
              style={{
                fontSize: "12.5px",
                padding: "5px 12px",
                borderRadius: "8px",
                border: "0.5px solid #e2e8f0",
                textDecoration: "none",
                background: p === page ? "#eff6ff" : "#fff",
                color: p === page ? "#1d4ed8" : "#475569",
                fontWeight: p === page ? 600 : 400,
              }}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
