"use client";

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

export function AdminEventRegistrationsTable({
  eventId,
  registrations,
  currentFilter,
  currentType,
  currentQuery,
  isPaid,
}: {
  eventId: string;
  registrations: Registration[];
  currentFilter: string;
  currentType: string;
  currentQuery: string;
  isPaid: boolean;
}) {
  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams({
      ...(currentFilter !== "ALL" ? { status: currentFilter } : {}),
      ...(currentType !== "ALL" ? { type: currentType } : {}),
      ...(currentQuery ? { q: currentQuery } : {}),
      ...overrides,
    });
    return `${ROUTES.adminEventRegistrations(eventId)}${params.toString() ? `?${params}` : ""}`;
  }

  const statusTabs = ["ALL", "CONFIRMED", "PENDING", "CANCELLED", "REFUNDED"];
  const typeTabs = [
    { key: "ALL", label: "All" },
    { key: "USER", label: "Registered Users" },
    { key: "GUEST", label: "Guests" },
  ];

  return (
    <div>
      {/* Type filter */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
        {typeTabs.map((t) => (
          <Link
            key={t.key}
            href={buildHref({ type: t.key })}
            style={{
              height: "32px",
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              borderRadius: "9px",
              fontSize: "12.5px",
              fontWeight: currentType === t.key ? 600 : 500,
              color: currentType === t.key ? "#1d4ed8" : "#64748b",
              background: currentType === t.key ? "#eff6ff" : "#f8fafc",
              border:
                currentType === t.key
                  ? "1px solid #bfdbfe"
                  : "1px solid #e2e8f0",
              textDecoration: "none",
            }}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Status filter */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        {statusTabs.map((s) => (
          <Link
            key={s}
            href={buildHref({ status: s })}
            style={{
              height: "30px",
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: currentFilter === s ? 600 : 500,
              color: currentFilter === s ? "#1d4ed8" : "#64748b",
              background: currentFilter === s ? "#eff6ff" : "#f8fafc",
              border:
                currentFilter === s ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
              textDecoration: "none",
            }}
          >
            {s === "ALL" ? "All" : s[0] + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      {/* Search */}
      <form method="GET" style={{ marginBottom: "1.25rem" }}>
        {currentFilter !== "ALL" && (
          <input type="hidden" name="status" value={currentFilter} />
        )}
        {currentType !== "ALL" && (
          <input type="hidden" name="type" value={currentType} />
        )}
        <input
          name="q"
          defaultValue={currentQuery}
          placeholder="Search name, email, phone…"
          style={{
            height: "38px",
            padding: "0 12px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            width: "300px",
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
                "Contact",
                "Type",
                "Status",
                "Check-in",
                "Ticket Code",
                ...(isPaid ? ["Payment"] : []),
                "Registered",
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
                  <td
                    style={{
                      padding: "11px 14px",
                      fontWeight: 600,
                      color: "#0f172a",
                    }}
                  >
                    {name}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <p style={{ margin: "0 0 1px", color: "#334155" }}>
                      {email}
                    </p>
                    {phone && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "11px",
                          color: "#94a3b8",
                        }}
                      >
                        {phone}
                      </p>
                    )}
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
                        {reg.checkedInAt?.toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
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
                    <td style={{ padding: "11px 14px" }}>
                      {reg.amountPaid ? (
                        <>
                          <p
                            style={{
                              margin: "0 0 1px",
                              fontWeight: 700,
                              color: "#0f172a",
                            }}
                          >
                            ₹{(reg.amountPaid / 100).toLocaleString("en-IN")}
                          </p>
                          {reg.razorpayPaymentId && (
                            <p
                              style={{
                                margin: 0,
                                fontSize: "10px",
                                color: "#94a3b8",
                              }}
                            >
                              {reg.razorpayPaymentId.slice(-10)}
                            </p>
                          )}
                        </>
                      ) : (
                        "—"
                      )}
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
                      year: "numeric",
                    })}
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
    </div>
  );
}
