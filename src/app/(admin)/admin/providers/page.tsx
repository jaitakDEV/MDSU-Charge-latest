import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";

export const metadata = { title: "Providers — Admin" };

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  PENDING: { label: "Pending", bg: "#fefce8", color: "#854d0e" },
  APPROVED: { label: "Approved", bg: "#f0fdf4", color: "#166534" },
  REJECTED: { label: "Rejected", bg: "#fef2f2", color: "#991b1b" },
  SUSPENDED: { label: "Suspended", bg: "#faf5ff", color: "#6b21a8" },
};

export default async function AdminProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { status, q } = await searchParams;
  const filter = status ?? "ALL";
  const query = q?.trim() ?? "";

  const companies = await db.companyProfile.findMany({
    where: {
      ...(filter !== "ALL" ? { approvalStatus: filter as any } : {}),
      ...(query
        ? { companyName: { contains: query, mode: "insensitive" as const } }
        : {}),
    },
    orderBy: [{ approvalStatus: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      companyName: true,
      logoUrl: true,
      industry: true,
      companyType: true,
      city: true,
      state: true,
      approvalStatus: true,
      contactPerson: true,
      contactEmail: true,
      createdAt: true,
      user: { select: { isActive: true } },
      _count: { select: { jobListings: true } },
    },
  });

  const counts = await db.companyProfile.groupBy({
    by: ["approvalStatus"],
    _count: { _all: true },
  });
  const countMap = counts.reduce(
    (acc, c) => ({ ...acc, [c.approvalStatus]: c._count._all }),
    {} as Record<string, number>,
  );
  const totalCount = Object.values(countMap).reduce((a, b) => a + b, 0);

  async function suspendProvider(id: string) {
    "use server";
  }

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
          Job Providers
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          All registered companies across the platform
        </p>
      </div>

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
        {[
          { key: "ALL", label: "All", count: totalCount },
          {
            key: "PENDING",
            label: "Pending",
            count: countMap.PENDING ?? 0,
            urgent: true,
          },
          { key: "APPROVED", label: "Approved", count: countMap.APPROVED ?? 0 },
          { key: "REJECTED", label: "Rejected", count: countMap.REJECTED ?? 0 },
          {
            key: "SUSPENDED",
            label: "Suspended",
            count: countMap.SUSPENDED ?? 0,
          },
        ].map((tab) => {
          const isActive = filter === tab.key;
          return (
            <Link
              key={tab.key}
              href={`${ROUTES.adminProviders}?status=${tab.key}${query ? `&q=${query}` : ""}`}
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
                    (tab as any).urgent && tab.count > 0
                      ? "#fef9c3"
                      : isActive
                        ? "#dbeafe"
                        : "#e2e8f0",
                  color:
                    (tab as any).urgent && tab.count > 0
                      ? "#854d0e"
                      : isActive
                        ? "#1d4ed8"
                        : "#64748b",
                }}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      <form method="GET" style={{ marginBottom: "1.25rem" }}>
        {filter !== "ALL" && (
          <input type="hidden" name="status" value={filter} />
        )}
        <input
          name="q"
          defaultValue={query}
          placeholder="Search companies…"
          style={{
            height: "38px",
            padding: "0 14px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            width: "280px",
          }}
        />
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {companies.map((c) => {
          const cfg = STATUS_CONFIG[c.approvalStatus];
          return (
            <div
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "#fff",
                padding: "1rem 1.25rem",
                borderRadius: "14px",
                border:
                  c.approvalStatus === "PENDING"
                    ? "1.5px solid #fde68a"
                    : "1px solid #e8edf2",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "#f1f5f9",
                  flexShrink: 0,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {c.logoUrl ? (
                  <img
                    src={c.logoUrl}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#94a3b8",
                    }}
                  >
                    {c.companyName[0]}
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "3px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "20px",
                      background: cfg.bg,
                      color: cfg.color,
                    }}
                  >
                    {cfg.label}
                  </span>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {c.companyName}
                  </p>
                  {!c.user.isActive && c.approvalStatus === "APPROVED" && (
                    <span style={{ fontSize: "10px", color: "#dc2626" }}>
                      (inactive)
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    fontSize: "11.5px",
                    color: "#94a3b8",
                  }}
                >
                  <span>{c.industry}</span>
                  <span>
                    · {c.city}, {c.state}
                  </span>
                  <span>· {c.contactPerson}</span>
                  <span>· {c._count.jobListings} listings</span>
                </div>
              </div>
              <Link
                href={ROUTES.cmsCompanyReview(c.id)}
                style={{
                  height: "32px",
                  padding: "0 14px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #e2e8f0",
                  borderRadius: "9px",
                  background: "#fff",
                  color: "#475569",
                  fontSize: "12px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                View Details
              </Link>
            </div>
          );
        })}
        {companies.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}
          >
            No providers found.
          </div>
        )}
      </div>
    </div>
  );
}
