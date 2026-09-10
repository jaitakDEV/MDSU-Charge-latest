"use client";

import { useState } from "react";
import Link from "next/link";
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
};

type WaitlistEntry = {
  id: string;
  position: number;
  notified: boolean;
  joinedAt: Date;
  userId: string | null;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  user: { name: string | null; email: string } | null;
};

const STATUS_TABS = [
  { key: "ALL", label: "All" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PENDING", label: "Pending" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "REFUNDED", label: "Refunded" },
];

export function RegistrationsTable({
  eventId,
  registrations,
  waitlist,
  counts,
  currentFilter,
  currentQuery,
  capacity,
  isPaid,
}: {
  eventId: string;
  registrations: Registration[];
  waitlist: WaitlistEntry[];
  counts: Record<string, number>;
  currentFilter: string;
  currentQuery: string;
  capacity: number | null;
  isPaid: boolean;
}) {
  const [view, setView] = useState<"registrations" | "waitlist">(
    "registrations",
  );
  const [processingRefund, setProcessingRefund] = useState<string | null>(null);

  async function handleRefund(registrationId: string) {
    if (!confirm("Issue refund for this registration? This cannot be undone."))
      return;
    setProcessingRefund(registrationId);
    await fetch(`/api/admin/event-registrations/${registrationId}/refund`, {
      method: "POST",
    });
    setProcessingRefund(null);
    window.location.reload();
  }

  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams({
      ...(currentFilter !== "ALL" ? { status: currentFilter } : {}),
      ...(currentQuery ? { q: currentQuery } : {}),
      ...overrides,
    });
    return `${ROUTES.cmsEventRegs(eventId)}${params.toString() ? `?${params}` : ""}`;
  }

  return (
    <div>
      {/* View toggle */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "1.25rem",
          background: "#f8fafc",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
        }}
      >
        <button
          onClick={() => setView("registrations")}
          style={{
            height: "32px",
            padding: "0 16px",
            border:
              view === "registrations"
                ? "1px solid #bfdbfe"
                : "1px solid transparent",
            borderRadius: "9px",
            background: view === "registrations" ? "#fff" : "transparent",
            color: view === "registrations" ? "#1d4ed8" : "#64748b",
            fontSize: "12.5px",
            fontWeight: view === "registrations" ? 600 : 500,
            cursor: "pointer",
          }}
        >
          Registrations ({registrations.length})
        </button>
        {waitlist.length > 0 && (
          <button
            onClick={() => setView("waitlist")}
            style={{
              height: "32px",
              padding: "0 16px",
              border:
                view === "waitlist"
                  ? "1px solid #fde68a"
                  : "1px solid transparent",
              borderRadius: "9px",
              background: view === "waitlist" ? "#fffbeb" : "transparent",
              color: view === "waitlist" ? "#92400e" : "#64748b",
              fontSize: "12.5px",
              fontWeight: view === "waitlist" ? 600 : 500,
              cursor: "pointer",
            }}
          >
            Waitlist ({waitlist.length})
          </button>
        )}
      </div>

      {view === "registrations" && (
        <>
          {/* Status filters */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
            }}
          >
            {STATUS_TABS.map((tab) => {
              const isActive = currentFilter === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={buildHref({ status: tab.key })}
                  style={{
                    height: "30px",
                    padding: "0 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#1d4ed8" : "#64748b",
                    background: isActive ? "#eff6ff" : "#f8fafc",
                    border: isActive
                      ? "1px solid #bfdbfe"
                      : "1px solid #e2e8f0",
                    textDecoration: "none",
                  }}
                >
                  {tab.label}
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: "20px",
                      background: isActive ? "#dbeafe" : "#e2e8f0",
                    }}
                  >
                    {counts[tab.key] ?? 0}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Search */}
          <form method="GET" style={{ marginBottom: "1.25rem" }}>
            {currentFilter !== "ALL" && (
              <input type="hidden" name="status" value={currentFilter} />
            )}
            <input
              name="q"
              defaultValue={currentQuery}
              placeholder="Search by name or email…"
              style={{
                height: "38px",
                padding: "0 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "13px",
                width: "280px",
              }}
            />
          </form>

          {/* Table */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8edf2",
              borderRadius: "14px",
              overflow: "hidden",
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
                    "Type",
                    "Status",
                    "Check-in",
                    "Ticket Code",
                    ...(isPaid ? ["Amount"] : []),
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
                  const phone = reg.guestPhone;
                  const isGuest = !reg.userId;
                  const statusCfg =
                    REGISTRATION_STATUS_CONFIG[
                      reg.status as keyof typeof REGISTRATION_STATUS_CONFIG
                    ];

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
                          style={{
                            margin: 0,
                            fontSize: "11px",
                            color: "#94a3b8",
                          }}
                        >
                          {email}
                          {phone ? ` · ${phone}` : ""}
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
                            ✓{" "}
                            {reg.checkedInAt?.toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        ) : (
                          <span style={{ fontSize: "11px", color: "#cbd5e1" }}>
                            —
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <code
                          style={{
                            fontSize: "10.5px",
                            color: "#64748b",
                            background: "#f8fafc",
                            padding: "2px 6px",
                            borderRadius: "5px",
                          }}
                        >
                          {reg.ticketCode.slice(-10)}
                        </code>
                      </td>
                      {isPaid && (
                        <td
                          style={{
                            padding: "11px 14px",
                            fontWeight: 600,
                            color: "#0f172a",
                          }}
                        >
                          {reg.amountPaid
                            ? `₹${(reg.amountPaid / 100).toLocaleString("en-IN")}`
                            : "—"}
                        </td>
                      )}
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
                              disabled={processingRefund === reg.id}
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
                              {processingRefund === reg.id ? "…" : "Refund"}
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })}
                {registrations.length === 0 && (
                  <tr>
                    <td
                      colSpan={isPaid ? 8 : 7}
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
        </>
      )}

      {view === "waitlist" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "14px",
            overflow: "hidden",
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
              <tr style={{ background: "#fefce8" }}>
                {["Position", "Attendee", "Type", "Notified", "Joined"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 14px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#854d0e",
                        borderBottom: "1px solid #fde68a",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {waitlist.map((w, i) => {
                const name = w.user?.name ?? w.guestName ?? "—";
                const email = w.user?.email ?? w.guestEmail ?? "—";
                return (
                  <tr
                    key={w.id}
                    style={{
                      borderTop: "1px solid #f8fafc",
                      background: i % 2 === 1 ? "#fffbeb" : "#fff",
                    }}
                  >
                    <td
                      style={{
                        padding: "11px 14px",
                        fontWeight: 700,
                        color: "#92400e",
                      }}
                    >
                      #{w.position}
                    </td>
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
                        style={{
                          margin: 0,
                          fontSize: "11px",
                          color: "#94a3b8",
                        }}
                      >
                        {email}
                      </p>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: w.userId ? "#eff6ff" : "#faf5ff",
                          color: w.userId ? "#1d4ed8" : "#6b21a8",
                        }}
                      >
                        {w.userId ? "User" : "Guest"}
                      </span>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      {w.notified ? (
                        <span
                          style={{
                            color: "#16a34a",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          ✓ Notified
                        </span>
                      ) : (
                        <span style={{ color: "#cbd5e1", fontSize: "11px" }}>
                          —
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        color: "#94a3b8",
                        fontSize: "11.5px",
                      }}
                    >
                      {w.joinedAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
