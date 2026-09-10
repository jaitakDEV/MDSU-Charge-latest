import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import {
  getApplicationStatusLabel,
  OPPORTUNITY_TYPE_LABELS,
} from "@/lib/job-utils";

export const metadata = { title: "My Applications — MDSSC" };

const STATUS_CONFIG: Record<string, { bg: string; color: string }> = {
  APPLIED: { bg: "#eff6ff", color: "#1d4ed8" },
  UNDER_REVIEW: { bg: "#fefce8", color: "#854d0e" },
  SHORTLISTED: { bg: "#f0fdf4", color: "#166534" },
  INTERVIEW_SCHEDULED: { bg: "#faf5ff", color: "#6b21a8" },
  INTERVIEWED: { bg: "#f0fdfa", color: "#0f766e" },
  OFFERED: { bg: "#f0fdf4", color: "#16a34a" },
  OFFER_ACCEPTED: { bg: "#f0fdf4", color: "#166534" },
  OFFER_REJECTED: { bg: "#f8fafc", color: "#64748b" },
  REJECTED: { bg: "#fef2f2", color: "#991b1b" },
  WITHDRAWN: { bg: "#f8fafc", color: "#64748b" },
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const { status } = await searchParams;
  const filter = status ?? "ALL";

  const profile = await db.studentCareerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const applications = profile
    ? await db.jobApplication.findMany({
        where: {
          profileId: profile.id,
          ...(filter !== "ALL" ? { status: filter as any } : {}),
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          createdAt: true,
          statusUpdatedAt: true,
          listing: {
            select: {
              title: true,
              opportunityType: true,
              company: { select: { companyName: true, logoUrl: true } },
            },
          },
        },
      })
    : [];

  const counts: Record<string, number> = {};
  applications.forEach((a) => {
    counts[a.status] = (counts[a.status] ?? 0) + 1;
  });
  const activeCount = applications.filter(
    (a) => !["REJECTED", "WITHDRAWN", "OFFER_REJECTED"].includes(a.status),
  ).length;

  const tabs = [
    { key: "ALL", label: "All", count: applications.length },
    { key: "APPLIED", label: "Applied", count: counts.APPLIED ?? 0 },
    {
      key: "SHORTLISTED",
      label: "Shortlisted",
      count: counts.SHORTLISTED ?? 0,
    },
    { key: "OFFERED", label: "Offered", count: counts.OFFERED ?? 0 },
    { key: "REJECTED", label: "Rejected", count: counts.REJECTED ?? 0 },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
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
          Career
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
          My Applications
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "6px 0 0" }}>
          {activeCount} active application{activeCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "1.5rem",
          background: "#f8fafc",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <Link
              key={tab.key}
              href={`${ROUTES.applications}?status=${tab.key}`}
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
                  background: isActive ? "#dbeafe" : "#e2e8f0",
                  color: isActive ? "#1d4ed8" : "#64748b",
                }}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {applications.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            background: "#fff",
            border: "1px dashed #bfdbfe",
            borderRadius: "16px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            No applications yet
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 1rem" }}>
            Browse opportunities and start applying
          </p>
          <Link
            href={ROUTES.jobs}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: "36px",
              padding: "0 16px",
              borderRadius: "9px",
              background: "#1d4ed8",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Browse Jobs →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {applications.map((app) => {
            const cfg = STATUS_CONFIG[app.status] ?? {
              bg: "#f8fafc",
              color: "#64748b",
            };
            return (
              <Link
                key={app.id}
                href={ROUTES.applicationDetail(app.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  background: "#fff",
                  border: "1px solid #e8edf2",
                  borderRadius: "14px",
                  padding: "1rem 1.25rem",
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
                  {app.listing.company.logoUrl ? (
                    <img
                      src={app.listing.company.logoUrl}
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
                      {app.listing.company.companyName[0]}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
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
                    {app.listing.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                    {app.listing.company.companyName} · Applied{" "}
                    {app.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: cfg.bg,
                    color: cfg.color,
                    flexShrink: 0,
                  }}
                >
                  {getApplicationStatusLabel(app.status)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
