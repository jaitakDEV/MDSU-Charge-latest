import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";

export const metadata = { title: "Provider Dashboard" };

export default async function ProviderOverviewPage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const company = await db.companyProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, companyName: true, approvalStatus: true },
  });

  if (!company) redirect(ROUTES.providerCompany);

  const [
    totalListings,
    publishedCount,
    pendingCount,
    draftCount,
    totalApplications,
    recentListings,
  ] = await Promise.all([
    db.jobListing.count({ where: { companyId: company.id } }),
    db.jobListing.count({
      where: { companyId: company.id, status: "PUBLISHED" },
    }),
    db.jobListing.count({
      where: { companyId: company.id, status: "SUBMITTED" },
    }),
    db.jobListing.count({ where: { companyId: company.id, status: "DRAFT" } }),
    db.jobApplication.count({ where: { listing: { companyId: company.id } } }),
    db.jobListing.findMany({
      where: { companyId: company.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        opportunityType: true,
        applicationCount: true,
        updatedAt: true,
      },
    }),
  ]);

  const STATUS_CFG: Record<
    string,
    { label: string; bg: string; color: string }
  > = {
    DRAFT: { label: "Draft", bg: "#f1f5f9", color: "#64748b" },
    SUBMITTED: { label: "In Review", bg: "#fefce8", color: "#854d0e" },
    PUBLISHED: { label: "Published", bg: "#f0fdf4", color: "#166534" },
    CLOSED: { label: "Closed", bg: "#fef2f2", color: "#991b1b" },
    ARCHIVED: { label: "Archived", bg: "#f8fafc", color: "#64748b" },
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ marginBottom: "2rem" }}>
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
          Dashboard
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
          Welcome, {company.companyName} 👋
        </h1>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
          marginBottom: "1.75rem",
        }}
      >
        {[
          {
            label: "Total Listings",
            value: totalListings,
            color: "#1d4ed8",
            bg: "#eff6ff",
            href: ROUTES.providerListings,
          },
          {
            label: "Published",
            value: publishedCount,
            color: "#16a34a",
            bg: "#f0fdf4",
            href: `${ROUTES.providerListings}?status=PUBLISHED`,
          },
          {
            label: "Pending Review",
            value: pendingCount,
            color: "#854d0e",
            bg: "#fefce8",
            href: `${ROUTES.providerListings}?status=SUBMITTED`,
          },
          {
            label: "Drafts",
            value: draftCount,
            color: "#64748b",
            bg: "#f8fafc",
            href: `${ROUTES.providerListings}?status=DRAFT`,
          },
          {
            label: "Total Applicants",
            value: totalApplications,
            color: "#7c3aed",
            bg: "#faf5ff",
            href: ROUTES.providerListings,
          },
        ].map(({ label, value, color, bg, href }) => (
          <Link
            key={label}
            href={href}
            style={{
              background: bg,
              borderRadius: "14px",
              padding: "1rem 1.25rem",
              textDecoration: "none",
            }}
          >
            <p
              style={{
                fontSize: "10.5px",
                color,
                margin: "0 0 6px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontSize: "26px",
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
                letterSpacing: "-0.6px",
              }}
            >
              {value}
            </p>
          </Link>
        ))}
      </div>

      {/* Pending approval banner */}
      {company.approvalStatus !== "APPROVED" && (
        <div
          style={{
            padding: "14px 18px",
            background:
              company.approvalStatus === "REJECTED" ? "#fef2f2" : "#fefce8",
            border: `1px solid ${company.approvalStatus === "REJECTED" ? "#fecaca" : "#fde68a"}`,
            borderRadius: "12px",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color:
                company.approvalStatus === "REJECTED" ? "#991b1b" : "#854d0e",
              margin: 0,
            }}
          >
            {company.approvalStatus === "REJECTED"
              ? "Your company profile was rejected. Please update your details and reapply."
              : "Your company profile is pending approval. You can prepare draft listings now — they'll be reviewable once approved."}
          </p>
        </div>
      )}

      {/* Recent listings */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #f1f5f9",
            background: "#fafafa",
          }}
        >
          <p
            style={{
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
            }}
          >
            Recent Listings
          </p>
          <Link
            href={ROUTES.providerListings}
            style={{
              fontSize: "12px",
              color: "#1d4ed8",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View all →
          </Link>
        </div>
        <div style={{ padding: "8px 0" }}>
          {recentListings.length === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  margin: "0 0 10px",
                }}
              >
                No listings yet
              </p>
              <Link
                href={ROUTES.providerListingsNew}
                style={{
                  fontSize: "12.5px",
                  color: "#1d4ed8",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                + Create your first listing
              </Link>
            </div>
          ) : (
            recentListings.map((listing) => {
              const cfg = STATUS_CFG[listing.status];
              return (
                <Link
                  key={listing.id}
                  href={ROUTES.providerListingEdit(listing.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 1.25rem",
                    textDecoration: "none",
                    borderBottom: "1px solid #f8fafc",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: cfg.color,
                      flexShrink: 0,
                    }}
                  />
                  <p
                    style={{
                      flex: 1,
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#0f172a",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {listing.title}
                  </p>
                  <span style={{ fontSize: "10.5px", color: "#94a3b8" }}>
                    {listing.applicationCount} applicants
                  </span>
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      padding: "1px 7px",
                      borderRadius: "20px",
                      background: cfg.bg,
                      color: cfg.color,
                    }}
                  >
                    {cfg.label}
                  </span>
                </Link>
              );
            })
          )}
        </div>
        <div
          style={{ padding: "10px 1.25rem", borderTop: "1px solid #f1f5f9" }}
        >
          <Link
            href={ROUTES.providerListingsNew}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12.5px",
              color: "#1d4ed8",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            + New Listing
          </Link>
        </div>
      </div>
    </div>
  );
}
