import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { OPPORTUNITY_TYPE_LABELS } from "@/lib/job-utils";

export const metadata = { title: "Job Analytics — Admin" };

export default async function JobAnalyticsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const [
    totalListings,
    publishedListings,
    totalApplications,
    totalProviders,
    approvedProviders,
    allSkillsRaw,
    typeBreakdown,
  ] = await Promise.all([
    db.jobListing.count(),
    db.jobListing.count({ where: { status: "PUBLISHED" } }),
    db.jobApplication.count(),
    db.companyProfile.count(),
    db.companyProfile.count({ where: { approvalStatus: "APPROVED" } }),
    db.jobListing.findMany({
      where: { status: "PUBLISHED" },
      select: { skills: true },
    }),
    db.jobListing.groupBy({
      by: ["opportunityType"],
      where: { status: "PUBLISHED" },
      _count: { _all: true },
    }),
  ]);

  const skillCounts: Record<string, number> = {};
  allSkillsRaw.forEach((l) =>
    l.skills.forEach((s) => {
      skillCounts[s] = (skillCounts[s] ?? 0) + 1;
    }),
  );
  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topProviders = await db.jobListing.groupBy({
    by: ["companyId"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
    orderBy: { _count: { companyId: "desc" } },
    take: 5,
  });
  const providerNames = await db.companyProfile.findMany({
    where: { id: { in: topProviders.map((p) => p.companyId) } },
    select: { id: true, companyName: true },
  });

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "1000px",
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
          Job Analytics
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Overview of the jobs and career module
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "12px",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Total Listings",
            value: totalListings,
            color: "#1d4ed8",
            bg: "#eff6ff",
          },
          {
            label: "Published",
            value: publishedListings,
            color: "#16a34a",
            bg: "#f0fdf4",
          },
          {
            label: "Applications",
            value: totalApplications,
            color: "#7c3aed",
            bg: "#faf5ff",
          },
          {
            label: "Providers",
            value: totalProviders,
            color: "#854d0e",
            bg: "#fefce8",
          },
          {
            label: "Approved",
            value: approvedProviders,
            color: "#0f766e",
            bg: "#f0fdfa",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              borderRadius: "14px",
              padding: "1rem 1.1rem",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: s.color,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 4px",
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "16px",
            padding: "1.25rem",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 1rem",
            }}
          >
            Listings by Type
          </p>
          {typeBreakdown.map((t) => (
            <div
              key={t.opportunityType}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #f1f5f9",
                fontSize: "12.5px",
              }}
            >
              <span style={{ color: "#64748b" }}>
                {OPPORTUNITY_TYPE_LABELS[t.opportunityType]}
              </span>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>
                {t._count._all}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "16px",
            padding: "1.25rem",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 1rem",
            }}
          >
            Top Skills in Demand
          </p>
          {topSkills.map(([skill, count]) => (
            <div
              key={skill}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #f1f5f9",
                fontSize: "12.5px",
              }}
            >
              <span style={{ color: "#64748b" }}>{skill}</span>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "16px",
          padding: "1.25rem",
          marginTop: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 1rem",
          }}
        >
          Most Active Providers
        </p>
        {topProviders.map((p) => {
          const name =
            providerNames.find((n) => n.id === p.companyId)?.companyName ??
            "Unknown";
          return (
            <div
              key={p.companyId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #f1f5f9",
                fontSize: "12.5px",
              }}
            >
              <span style={{ color: "#64748b" }}>{name}</span>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>
                {p._count._all} listings
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
