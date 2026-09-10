import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import {
  OPPORTUNITY_TYPE_LABELS,
  LISTING_STATUS_CONFIG,
  formatSalary,
} from "@/lib/job-utils";

export const metadata = { title: "Jobs — CMS" };

export default async function CmsJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  const { status, q } = await searchParams;
  const filter = status ?? "SUBMITTED";
  const query = q?.trim() ?? "";

  const where = {
    ...(filter !== "ALL" ? { status: filter as any } : {}),
    ...(query
      ? { title: { contains: query, mode: "insensitive" as const } }
      : {}),
  };

  const listings = await db.jobListing.findMany({
    where,
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      title: true,
      opportunityType: true,
      status: true,
      workMode: true,
      location: true,
      salaryMin: true,
      salaryMax: true,
      applicationDeadline: true,
      applicationCount: true,
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

  const tabs = [
    {
      key: "SUBMITTED",
      label: "Pending Review",
      count: countMap.SUBMITTED ?? 0,
      urgent: true,
    },
    { key: "PUBLISHED", label: "Published", count: countMap.PUBLISHED ?? 0 },
    { key: "DRAFT", label: "Drafts", count: countMap.DRAFT ?? 0 },
    { key: "CLOSED", label: "Closed", count: countMap.CLOSED ?? 0 },
    { key: "ALL", label: "All", count: totalCount },
  ];

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
          Jobs
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Review and moderate job listings from all providers
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
        {tabs.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <Link
              key={tab.key}
              href={`${ROUTES.cmsJobs}?status=${tab.key}${query ? `&q=${query}` : ""}`}
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
            </Link>
          );
        })}
      </div>

      {/* Search */}
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

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {listings.map((listing) => {
          const cfg = LISTING_STATUS_CONFIG[listing.status];
          const isUrgent = listing.status === "SUBMITTED";
          return (
            <Link
              key={listing.id}
              href={ROUTES.cmsJobReview(listing.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "#fff",
                padding: "1rem 1.25rem",
                borderRadius: "14px",
                border: isUrgent ? "1.5px solid #fde68a" : "1px solid #e8edf2",
                textDecoration: "none",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
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
                {listing.company.logoUrl ? (
                  <img
                    src={listing.company.logoUrl}
                    alt={listing.company.companyName}
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
                    {listing.company.companyName[0]}
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
                    flexWrap: "wrap",
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
                        background: cfg.dot,
                      }}
                    />
                    {cfg.label}
                  </span>
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 600,
                      color: "#64748b",
                    }}
                  >
                    {OPPORTUNITY_TYPE_LABELS[listing.opportunityType]}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: "0 0 3px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {listing.title}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    fontSize: "11.5px",
                    color: "#94a3b8",
                  }}
                >
                  <span>{listing.company.companyName}</span>
                  {listing.location && <span>· {listing.location}</span>}
                  <span>· {listing.applicationCount} applicants</span>
                </div>
              </div>

              {isUrgent && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#854d0e",
                    flexShrink: 0,
                  }}
                >
                  Review needed →
                </span>
              )}
            </Link>
          );
        })}
        {listings.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}
          >
            No listings found.
          </div>
        )}
      </div>
    </div>
  );
}
