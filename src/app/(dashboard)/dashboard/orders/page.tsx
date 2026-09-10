import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { ACCESS_DURATION_LABELS, formatExpiryDate } from "@/lib/access-utils";
import { AccessDurationBadge } from "@/features/courses/components/access-duration-badge";
import Link from "next/link";
import type { AccessDuration } from "@prisma/client";

export const metadata = { title: "Purchase History — MDSSC" };

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    bg: "#f1f5f9",
    color: "#475569",
    dot: "#94a3b8",
  },
  COMPLETED: { label: "Paid", bg: "#f0fdf4", color: "#166534", dot: "#16a34a" },
  FAILED: { label: "Failed", bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
  REFUNDED: {
    label: "Refunded",
    bg: "#faf5ff",
    color: "#6b21a8",
    dot: "#a855f7",
  },
} as const;

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      amountPaid: true,
      originalPrice: true,
      discountAmount: true,
      accessDuration: true,
      razorpayOrderId: true,
      razorpayPaymentId: true,
      createdAt: true,
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          category: { select: { name: true } },
        },
      },
      enrolment: {
        select: { accessExpiresAt: true, completionPercent: true },
      },
      coupon: { select: { code: true } },
    },
  });

  const totalSpend = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((acc, o) => acc + o.amountPaid, 0);

  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;
  const refundedCount = orders.filter((o) => o.status === "REFUNDED").length;

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #f1f5f9",
          marginBottom: "1.75rem",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#94a3b8",
            margin: "0 0 4px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Student Dashboard
        </p>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          Purchase History
        </h1>
      </div>

      {/* Summary cards */}
      {orders.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
            marginBottom: "1.75rem",
          }}
        >
          <SummaryCard
            label="Total Orders"
            value={String(orders.length)}
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            }
            bg="#eff6ff"
            border="#bfdbfe"
            iconBg="#dbeafe"
          />
          <SummaryCard
            label="Total Spent"
            value={`₹${(totalSpend / 100).toLocaleString("en-IN")}`}
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            bg="#f0fdf4"
            border="#bbf7d0"
            iconBg="#dcfce7"
          />
          <SummaryCard
            label="Completed"
            value={String(completedCount)}
            icon={
              <svg
                width="18"
                height="18"
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
            }
            bg="#f0fdf4"
            border="#bbf7d0"
            iconBg="#dcfce7"
          />
          {refundedCount > 0 && (
            <SummaryCard
              label="Refunded"
              value={String(refundedCount)}
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.89" />
                </svg>
              }
              bg="#faf5ff"
              border="#e9d5ff"
              iconBg="#f3e8ff"
            />
          )}
        </div>
      )}

      {/* Orders list */}
      {orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            const hasDiscount = order.discountAmount > 0;

            return (
              <div
                key={order.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e8edf2",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {/* Top row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#fafafa",
                    borderBottom: "1px solid #f1f5f9",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {/* Status badge */}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: "20px",
                        background: cfg.bg,
                        color: cfg.color,
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: cfg.dot,
                        }}
                      />
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                      {order.createdAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <code
                    style={{
                      fontSize: "10.5px",
                      color: "#94a3b8",
                      background: "#f1f5f9",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    {order.razorpayOrderId}
                  </code>
                </div>

                {/* Course + details */}
                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: "80px",
                      height: "52px",
                      borderRadius: "9px",
                      background: "#f1f5f9",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {order.course.thumbnail ? (
                      <img
                        src={order.course.thumbnail}
                        alt={order.course.title}
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
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Main info */}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <Link
                      href={ROUTES.coursePlayer(order.course.slug)}
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#0f172a",
                        textDecoration: "none",
                        display: "block",
                        marginBottom: "3px",
                        letterSpacing: "-0.2px",
                      }}
                    >
                      {order.course.title}
                    </Link>
                    {order.course.category && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          margin: "0 0 10px",
                        }}
                      >
                        {order.course.category.name}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <AccessDurationBadge
                        duration={order.accessDuration as AccessDuration}
                        variant="card"
                      />
                      {order.enrolment?.accessExpiresAt && (
                        <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                          Access until{" "}
                          {formatExpiryDate(order.enrolment.accessExpiresAt)}
                        </span>
                      )}
                      {order.enrolment?.accessExpiresAt === null && (
                        <span style={{ fontSize: "11.5px", color: "#92400e" }}>
                          ∞ Lifetime
                        </span>
                      )}
                      {order.enrolment && (
                        <span
                          style={{
                            fontSize: "11.5px",
                            color:
                              order.enrolment.completionPercent === 100
                                ? "#16a34a"
                                : "#94a3b8",
                          }}
                        >
                          {order.enrolment.completionPercent === 100
                            ? "✓ Completed"
                            : `${order.enrolment.completionPercent}% done`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "#0f172a",
                        margin: "0 0 3px",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      ₹{(order.amountPaid / 100).toLocaleString("en-IN")}
                    </p>
                    {hasDiscount && (
                      <p
                        style={{
                          fontSize: "11.5px",
                          color: "#16a34a",
                          margin: "0 0 2px",
                        }}
                      >
                        Saved ₹
                        {(order.discountAmount / 100).toLocaleString("en-IN")}
                      </p>
                    )}
                    {order.originalPrice !== order.amountPaid && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          textDecoration: "line-through",
                          margin: 0,
                        }}
                      >
                        ₹{(order.originalPrice / 100).toLocaleString("en-IN")}
                      </p>
                    )}
                    {order.coupon && (
                      <p
                        style={{
                          fontSize: "10.5px",
                          color: "#64748b",
                          margin: "3px 0 0",
                        }}
                      >
                        Coupon:{" "}
                        <code
                          style={{
                            background: "#f1f5f9",
                            padding: "1px 5px",
                            borderRadius: "4px",
                          }}
                        >
                          {order.coupon.code}
                        </code>
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment ID footer */}
                {order.razorpayPaymentId && (
                  <div
                    style={{
                      padding: "8px 16px",
                      borderTop: "1px solid #f8fafc",
                      background: "#fafafa",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                      Payment ID:{" "}
                      <code
                        style={{
                          background: "#f1f5f9",
                          padding: "1px 6px",
                          borderRadius: "5px",
                          fontSize: "10.5px",
                        }}
                      >
                        {order.razorpayPaymentId}
                      </code>
                    </span>
                    {order.status === "COMPLETED" && (
                      <Link
                        href={ROUTES.coursePlayer(order.course.slug)}
                        style={{
                          fontSize: "11.5px",
                          color: "#1d4ed8",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Continue Learning →
                      </Link>
                    )}
                    {order.status === "REFUNDED" && (
                      <Link
                        href={ROUTES.courseDetail(order.course.slug)}
                        style={{
                          fontSize: "11.5px",
                          color: "#6b21a8",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Re-enrol →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Summary Card ──────────────────────────────────────────────
function SummaryCard({
  label,
  value,
  icon,
  bg,
  border,
  iconBg,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
  border: string;
  iconBg: string;
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: "14px",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontSize: "10.5px",
            color: "#94a3b8",
            margin: "0 0 3px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.4px",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3.5rem 2rem",
        background: "#fff",
        border: "1px dashed #bfdbfe",
        borderRadius: "16px",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "#eff6ff",
          border: "2px solid #bfdbfe",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1rem",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <p
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 6px",
        }}
      >
        No purchases yet
      </p>
      <p
        style={{
          fontSize: "13px",
          color: "#64748b",
          margin: "0 0 1.5rem",
          lineHeight: 1.6,
        }}
      >
        Enrol in a course to see your purchase history here.
      </p>
      <Link
        href={ROUTES.courses}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          height: "38px",
          padding: "0 18px",
          border: "none",
          borderRadius: "10px",
          background: "#1d4ed8",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Browse Courses →
      </Link>
    </div>
  );
}
