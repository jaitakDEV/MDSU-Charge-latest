import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import {
  formatExpiryDate,
  getAccessStatus,
  getDaysRemaining,
  ACCESS_DURATION_LABELS,
} from "@/lib/access-utils";
import { EnrolmentAccessOverride } from "@/features/admin/components/enrolments/enrolment-access-override";

export const metadata = { title: "Enrolments — Admin" };

const PAGE_SIZE = 20;

const ACCESS_STATUS_CONFIG = {
  LIFETIME: { label: "Lifetime", bg: "#fffbeb", color: "#92400e" },
  ACTIVE: { label: "Active", bg: "#f0fdf4", color: "#166534" },
  EXPIRING_SOON: { label: "Expiring Soon", bg: "#fefce8", color: "#854d0e" },
  EXPIRED: { label: "Expired", bg: "#fef2f2", color: "#991b1b" },
} as const;

export default async function AdminEnrolmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; access?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { q, page: pageParam, access } = await searchParams;
  const query = q?.trim() ?? "";
  const filter = access ?? "ALL";

  // Fix: validate page param — Number("abc") is NaN, and Math.max(1, NaN) is still NaN,
  // which would break the Prisma `skip` calculation below.
  const parsedPage = Number(pageParam);
  const page =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 86400000);

  // Access filter
  const accessWhere =
    filter === "EXPIRED"
      ? { accessExpiresAt: { not: null, lte: now } }
      : filter === "EXPIRING_SOON"
        ? { accessExpiresAt: { not: null, gt: now, lte: sevenDaysFromNow } }
        : filter === "LIFETIME"
          ? { accessExpiresAt: null }
          : {};

  // Fix: extracted search condition so it can be reused for both the main
  // query and the filter-tab counts (previously the counts ignored `query`,
  // causing tab counts to be wrong whenever a search term was active).
  const searchWhere = query
    ? {
        OR: [
          { user: { name: { contains: query, mode: "insensitive" as const } } },
          {
            user: { email: { contains: query, mode: "insensitive" as const } },
          },
          {
            course: {
              title: { contains: query, mode: "insensitive" as const },
            },
          },
        ],
      }
    : {};

  const where = {
    ...accessWhere,
    ...searchWhere,
  };

  const [enrolments, total] = await Promise.all([
    db.enrolment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        accessDuration: true,
        accessGrantedAt: true,
        accessExpiresAt: true,
        renewedAt: true,
        completionPercent: true,
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, price: true } },
        order: { select: { amountPaid: true, razorpayPaymentId: true } },
      },
    }),
    db.enrolment.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Counts for filter tabs — now respect the active search query too.
  const [expiredCount, expiringCount, lifetimeCount] = await Promise.all([
    db.enrolment.count({
      where: { ...searchWhere, accessExpiresAt: { not: null, lte: now } },
    }),
    db.enrolment.count({
      where: {
        ...searchWhere,
        accessExpiresAt: { not: null, gt: now, lte: sevenDaysFromNow },
      },
    }),
    db.enrolment.count({ where: { ...searchWhere, accessExpiresAt: null } }),
  ]);

  const filterTabs = [
    { key: "ALL", label: "All", count: total },
    {
      key: "EXPIRING_SOON",
      label: "Expiring Soon",
      count: expiringCount,
      urgent: true,
    },
    { key: "EXPIRED", label: "Expired", count: expiredCount },
    { key: "LIFETIME", label: "Lifetime", count: lifetimeCount },
  ];

  // Fix: encode the query string when building href values so search terms
  // containing spaces or special characters (&, #, +, etc.) don't break the URL.
  const encodedQuery = encodeURIComponent(query);

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
          Enrolments
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Manage student access — extend, revoke, or override access duration
        </p>
      </div>

      {/* Filter tabs */}
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
        {filterTabs.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <a
              key={tab.key}
              href={`${ROUTES.adminEnrolments}?access=${tab.key}${query ? `&q=${encodedQuery}` : ""}`}
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
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "20px",
                  background:
                    tab.urgent && tab.count > 0
                      ? "#fef9c3"
                      : isActive
                        ? "#dbeafe"
                        : "#e2e8f0",
                  color:
                    tab.urgent && tab.count > 0
                      ? "#854d0e"
                      : isActive
                        ? "#1d4ed8"
                        : "#64748b",
                }}
              >
                {tab.count}
              </span>
            </a>
          );
        })}
      </div>

      {/* Search */}
      <form method="GET" style={{ marginBottom: "1.25rem" }}>
        {filter !== "ALL" && (
          <input type="hidden" name="access" value={filter} />
        )}
        <input
          name="q"
          defaultValue={query}
          placeholder="Search by student name, email, or course…"
          style={{
            height: "38px",
            padding: "0 14px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            width: "320px",
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
                "Plan",
                "Access Status",
                "Expires",
                "Amount Paid",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#64748b",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e8edf2",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enrolments.map((e, i) => {
              const status = getAccessStatus(e.accessExpiresAt);
              const days = getDaysRemaining(e.accessExpiresAt);
              const cfg = ACCESS_STATUS_CONFIG[status];
              const isEven = i % 2 === 1;

              return (
                <tr
                  key={e.id}
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    background: isEven ? "#fafbfc" : "#fff",
                  }}
                >
                  <td style={{ padding: "11px 14px" }}>
                    <p
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "#0f172a",
                        margin: "0 0 2px",
                      }}
                    >
                      {e.user.name ?? "—"}
                    </p>
                    <p
                      style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}
                    >
                      {e.user.email}
                    </p>
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      color: "#334155",
                      maxWidth: "200px",
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
                      {e.course.title}
                    </p>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#475569",
                      }}
                    >
                      {ACCESS_DURATION_LABELS[e.accessDuration]}
                    </span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: "20px",
                        background: cfg.bg,
                        color: cfg.color,
                      }}
                    >
                      {cfg.label}
                      {days !== null && days <= 7 && days > 0 && ` — ${days}d`}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    {formatExpiryDate(e.accessExpiresAt)}
                    {e.renewedAt && (
                      <p
                        style={{
                          fontSize: "10.5px",
                          color: "#94a3b8",
                          margin: "2px 0 0",
                        }}
                      >
                        Extended {e.renewedAt.toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      color: "#334155",
                      fontWeight: 600,
                    }}
                  >
                    {e.order?.amountPaid
                      ? `₹${(e.order.amountPaid / 100).toLocaleString("en-IN")}`
                      : "—"}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <EnrolmentAccessOverride
                      enrolmentId={e.id}
                      currentExpiry={e.accessExpiresAt?.toISOString() ?? null}
                    />
                  </td>
                </tr>
              );
            })}
            {enrolments.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No enrolments found.
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`${ROUTES.adminEnrolments}?page=${p}${query ? `&q=${encodedQuery}` : ""}${filter !== "ALL" ? `&access=${filter}` : ""}`}
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
