import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import {
  OPPORTUNITY_TYPE_LABELS,
  LISTING_STATUS_CONFIG,
} from "@/lib/job-utils";

export const metadata = { title: "All Listings — Admin" };

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { status, type, q } = await searchParams;
  const filter = status ?? "ALL";
  const query = q?.trim() ?? "";

  const listings = await db.jobListing.findMany({
    where: {
      ...(filter !== "ALL" ? { status: filter as any } : {}),
      ...(type ? { opportunityType: type as any } : {}),
      ...(query
        ? { title: { contains: query, mode: "insensitive" as const } }
        : {}),
    },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    take: 100,
    select: {
      id: true,
      title: true,
      opportunityType: true,
      status: true,
      applicationCount: true,
      isFeatured: true,
      updatedAt: true,
      company: { select: { companyName: true, logoUrl: true } },
    },
  });

  const counts = await db.jobListing.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const countMap = counts.reduce(
    (acc, c) => ({ ...acc, [c.status]: c._count._all }),
    {} as Record<string, number>,
  );
  const totalCount = Object.values(countMap).reduce((a, b) => a + b, 0);

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
          All Listings
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Platform-wide job listings from all providers
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
        {["ALL", "SUBMITTED", "PUBLISHED", "DRAFT", "CLOSED"].map((s) => {
          const isActive = filter === s;
          const count = s === "ALL" ? totalCount : (countMap[s] ?? 0);
          return (
            <Link
              key={s}
              href={`${ROUTES.adminJobs}?status=${s}${query ? `&q=${query}` : ""}`}
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
              {s === "ALL" ? "All" : s[0] + s.slice(1).toLowerCase()}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "20px",
                  background: isActive ? "#dbeafe" : "#e2e8f0",
                }}
              >
                {count}
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
          placeholder="Search listings…"
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
        {listings.map((l) => {
          const cfg = LISTING_STATUS_CONFIG[l.status];
          return (
            <Link
              key={l.id}
              href={ROUTES.cmsJobReview(l.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "#fff",
                padding: "1rem 1.25rem",
                borderRadius: "14px",
                border:
                  l.status === "SUBMITTED"
                    ? "1.5px solid #fde68a"
                    : "1px solid #e8edf2",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "9px",
                  background: "#f1f5f9",
                  flexShrink: 0,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {l.company.logoUrl ? (
                  <img
                    src={l.company.logoUrl}
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
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#94a3b8",
                    }}
                  >
                    {l.company.companyName[0]}
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ display: "flex", gap: "8px", marginBottom: "3px" }}
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
                  <span style={{ fontSize: "10.5px", color: "#64748b" }}>
                    {OPPORTUNITY_TYPE_LABELS[l.opportunityType]}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {l.title}
                </p>
                <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0 }}>
                  {l.company.companyName} · {l.applicationCount} applicants
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
