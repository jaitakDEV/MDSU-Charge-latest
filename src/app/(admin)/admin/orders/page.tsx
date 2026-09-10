import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";

export const metadata = { title: "Orders — Admin" };

const PAGE_SIZE = 25;

const STATUS_CONFIG = {
  PENDING: { label: "Pending", bg: "#f1f5f9", color: "#475569" },
  COMPLETED: { label: "Paid", bg: "#f0fdf4", color: "#166534" },
  FAILED: { label: "Failed", bg: "#fef2f2", color: "#991b1b" },
  REFUNDED: { label: "Refunded", bg: "#faf5ff", color: "#6b21a8" },
} as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { q, status, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const filter = status ?? "ALL";
  const page = Math.max(1, Number(pageParam ?? 1));

  const where = {
    ...(filter !== "ALL"
      ? { status: filter as keyof typeof STATUS_CONFIG }
      : {}),
    ...(query
      ? {
          OR: [
            {
              user: { name: { contains: query, mode: "insensitive" as const } },
            },
            {
              user: {
                email: { contains: query, mode: "insensitive" as const },
              },
            },
            {
              razorpayOrderId: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        status: true,
        amountPaid: true,
        discountAmount: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
        accessDuration: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    }),
    db.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "1100px",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
          }}
        >
          Orders
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          {total} total orders
        </p>
      </div>

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
          {filter !== "ALL" && (
            <input type="hidden" name="status" value={filter} />
          )}
          <input
            name="q"
            defaultValue={query}
            placeholder="Search name, email, order ID…"
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
        <div style={{ display: "flex", gap: "4px" }}>
          {["ALL", "COMPLETED", "PENDING", "FAILED", "REFUNDED"].map((s) => (
            <a
              key={s}
              href={`${ROUTES.adminOrders}?status=${s}${query ? `&q=${query}` : ""}`}
              style={{
                height: "38px",
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                borderRadius: "9px",
                fontSize: "12.5px",
                fontWeight: filter === s ? 600 : 500,
                color: filter === s ? "#1d4ed8" : "#64748b",
                textDecoration: "none",
                background: filter === s ? "#eff6ff" : "#f8fafc",
                border:
                  filter === s ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
              }}
            >
              {s === "ALL"
                ? "All"
                : (STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label ?? s)}
            </a>
          ))}
        </div>
      </div>

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
                "Student",
                "Course",
                "Amount",
                "Status",
                "Access Plan",
                "Payment ID",
                "Date",
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
            {orders.map((o, i) => {
              const cfg = STATUS_CONFIG[o.status];
              return (
                <tr
                  key={o.id}
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
                      {o.user.name ?? "—"}
                    </p>
                    <p
                      style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}
                    >
                      {o.user.email}
                    </p>
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      color: "#334155",
                      maxWidth: "180px",
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
                      {o.course.title}
                    </p>
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    ₹{(o.amountPaid / 100).toLocaleString("en-IN")}
                    {o.discountAmount > 0 && (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#16a34a",
                          display: "block",
                        }}
                      >
                        -₹{(o.discountAmount / 100).toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: cfg.bg,
                        color: cfg.color,
                      }}
                    >
                      {cfg.label}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    {o.accessDuration.replace(/_/g, " ")}
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
                      {o.razorpayPaymentId
                        ? o.razorpayPaymentId.slice(-8)
                        : "—"}
                    </code>
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      color: "#94a3b8",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {o.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No orders found.
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
              href={`${ROUTES.adminOrders}?page=${p}${query ? `&q=${query}` : ""}${filter !== "ALL" ? `&status=${filter}` : ""}`}
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
